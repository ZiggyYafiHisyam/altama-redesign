import fs from "node:fs"
import path from "node:path"
import { DATA_DIR } from "./dataDir.js"

const DATA_FILE = path.join(DATA_DIR, "contacts.json")

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

export function listContacts() {
    return readAll()
}

export function addContact(entry) {
    const entries = readAll()
    entries.push(entry)
    writeAll(entries)
    return entry
}
