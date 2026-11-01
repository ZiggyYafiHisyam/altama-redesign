import fs from "node:fs"
import path from "node:path"
import { DATA_DIR } from "./dataDir.js"
import { query, usingDatabase } from "./db.js"

const DATA_FILE = path.join(DATA_DIR, "pageViews.json")
const MAX_ENTRIES = 5000

// --- JSON file (no DATABASE_URL) -------------------------------------------

function readAll() {
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8")
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function writeAll(entries) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8")
}

// --- Postgres ---------------------------------------------------------------

const COLUMNS = "id, path, referrer, session_id, device, browser, opened_at"

function fromRow(row) {
    return {
        id: row.id,
        path: row.path,
        referrer: row.referrer,
        sessionId: row.session_id,
        device: row.device,
        browser: row.browser,
        openedAt: row.opened_at.toISOString(),
    }
}

// --- Store ------------------------------------------------------------------

// Oldest first.
export async function listPageViews() {
    if (!usingDatabase) return readAll()

    const { rows } = await query(`SELECT ${COLUMNS} FROM page_views ORDER BY opened_at, id`)
    return rows.map(fromRow)
}

export async function addPageView(entry) {
    if (!usingDatabase) {
        const entries = readAll()
        entries.push(entry)
        // Keep the log from growing forever; drop the oldest entries once past the cap.
        const trimmed = entries.length > MAX_ENTRIES ? entries.slice(entries.length - MAX_ENTRIES) : entries
        writeAll(trimmed)
        return entry
    }

    await query(
        `INSERT INTO page_views (id, path, referrer, session_id, device, browser, opened_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [entry.id, entry.path, entry.referrer, entry.sessionId, entry.device, entry.browser, entry.openedAt],
    )
    // Same cap as the file. Done on roughly one insert in fifty, which keeps the
    // table within a few dozen rows of the cap without a delete on every visit.
    if (Math.random() < 0.02) {
        await query(
            `DELETE FROM page_views WHERE opened_at < (
                SELECT opened_at FROM page_views ORDER BY opened_at DESC OFFSET $1 LIMIT 1
            )`,
            [MAX_ENTRIES - 1],
        )
    }
    return entry
}

// Lets the admin reset the analytics log (useful after testing, and the only
// way to shrink a log that has hit MAX_ENTRIES).
export async function clearPageViews() {
    if (!usingDatabase) {
        writeAll([])
        return
    }

    await query("DELETE FROM page_views")
}
