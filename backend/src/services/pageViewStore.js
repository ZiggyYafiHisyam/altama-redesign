import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR ?? path.join(__dirname, "..", "..", "data")
const DATA_FILE = path.join(DATA_DIR, "pageViews.json")
const MAX_ENTRIES = 5000

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

export function listPageViews() {
    return readAll()
}

export function addPageView(entry) {
    const entries = readAll()
    entries.push(entry)
    // Keep the log from growing forever; drop the oldest entries once past the cap.
    const trimmed = entries.length > MAX_ENTRIES ? entries.slice(entries.length - MAX_ENTRIES) : entries
    writeAll(trimmed)
    return entry
}
