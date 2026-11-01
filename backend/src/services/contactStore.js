import fs from "node:fs"
import path from "node:path"
import { DATA_DIR } from "./dataDir.js"
import { query, usingDatabase } from "./db.js"

const DATA_FILE = path.join(DATA_DIR, "contacts.json")

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

const COLUMNS = "id, name, email, phone, location, message, handled, note, created_at"

// Same shape the JSON store has always returned, so the admin is unaffected.
function fromRow(row) {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        location: row.location,
        message: row.message,
        handled: row.handled,
        ...(row.note !== null ? { note: row.note } : {}),
        createdAt: row.created_at.toISOString(),
    }
}

// --- Store ------------------------------------------------------------------

// Oldest first, as submitted.
export async function listContacts() {
    if (!usingDatabase) return readAll()

    const { rows } = await query(`SELECT ${COLUMNS} FROM contacts ORDER BY created_at, id`)
    return rows.map(fromRow)
}

export async function addContact(entry) {
    if (!usingDatabase) {
        const entries = readAll()
        entries.push(entry)
        writeAll(entries)
        return entry
    }

    const { rows } = await query(
        `INSERT INTO contacts (id, name, email, phone, location, message, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING ${COLUMNS}`,
        [entry.id, entry.name, entry.email, entry.phone, entry.location, entry.message, entry.createdAt],
    )
    return fromRow(rows[0])
}

// The admin inbox can mark a submission as handled and remove ones it is done
// with, so the store needs more than append.
export async function updateContact(id, patch) {
    if (!usingDatabase) {
        const entries = readAll()
        const entry = entries.find((item) => item.id === id)
        if (!entry) return null

        // Skip undefined fields, so a patch without a note keeps the saved one.
        const defined = Object.entries(patch).filter(([, value]) => value !== undefined)
        Object.assign(entry, Object.fromEntries(defined), { id })
        writeAll(entries)
        return entry
    }

    // A note left out of the patch keeps the one already saved.
    const { rows } = await query(
        `UPDATE contacts SET handled = $2, note = COALESCE($3, note)
         WHERE id = $1
         RETURNING ${COLUMNS}`,
        [id, Boolean(patch.handled), patch.note ?? null],
    )
    return rows[0] ? fromRow(rows[0]) : null
}

export async function deleteContact(id) {
    if (!usingDatabase) {
        const entries = readAll()
        const index = entries.findIndex((entry) => entry.id === id)
        if (index === -1) return null

        const [removed] = entries.splice(index, 1)
        writeAll(entries)
        return removed
    }

    const { rows } = await query(`DELETE FROM contacts WHERE id = $1 RETURNING ${COLUMNS}`, [id])
    return rows[0] ? fromRow(rows[0]) : null
}
