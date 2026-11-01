import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { DATA_DIR } from "./dataDir.js"
import { query, usingDatabase } from "./db.js"

const DATA_FILE = path.join(DATA_DIR, "media.json")

// Uploaded images live in Postgres as bytea when DATABASE_URL is set, and
// otherwise inside the JSON file as base64 (the only writable path on Vercel is
// /tmp, so a separate file tree there buys nothing over one document). Keep the
// per-image cap modest: without a database the whole library is read and
// rewritten on every upload.
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024

const ALLOWED_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/avif",
])

function readAll() {
    try {
        const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function writeAll(entries) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries), "utf-8")
}

function httpError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}

// The admin lists the library constantly; the bytes are only needed when an
// image is actually served, so they are stripped out of list responses.
function toMetadata(entry) {
    return {
        id: entry.id,
        name: entry.name,
        mimeType: entry.mimeType,
        size: entry.size,
        url: `/api/media/${entry.id}`,
        createdAt: entry.createdAt,
    }
}

const METADATA_COLUMNS = "id, name, mime_type, size, created_at"

function fromRow(row) {
    return {
        id: row.id,
        name: row.name,
        mimeType: row.mime_type,
        size: row.size,
        createdAt: row.created_at.toISOString(),
    }
}

export async function listMedia() {
    if (usingDatabase) {
        const { rows } = await query(`SELECT ${METADATA_COLUMNS} FROM media ORDER BY created_at DESC, id`)
        return rows.map((row) => toMetadata(fromRow(row)))
    }

    return readAll()
        .map(toMetadata)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

// The one read that needs the bytes: serving the image. Returns them as a
// Buffer in `bytes`, whichever store they came from.
export async function getMedia(id) {
    if (usingDatabase) {
        const { rows } = await query(`SELECT ${METADATA_COLUMNS}, data FROM media WHERE id = $1`, [id])
        return rows[0] ? { ...fromRow(rows[0]), bytes: rows[0].data } : null
    }

    const entry = readAll().find((item) => item.id === id)
    return entry ? { ...entry, bytes: Buffer.from(entry.base64, "base64") } : null
}

// `dataUrl` is what a browser's FileReader.readAsDataURL produces, which is the
// simplest thing for the admin to send over plain JSON.
export async function addMedia({ name, dataUrl }) {
    const match = /^data:([^;,]+);base64,(.+)$/s.exec(String(dataUrl ?? ""))
    if (!match) {
        throw httpError(400, "Expected a base64 data URL, e.g. data:image/png;base64,...")
    }

    const [, mimeType, base64] = match
    if (!ALLOWED_TYPES.has(mimeType)) {
        throw httpError(415, `Unsupported image type: ${mimeType}`)
    }

    const bytes = Buffer.from(base64, "base64")
    if (bytes.length === 0) throw httpError(400, "The uploaded file is empty.")
    if (bytes.length > MAX_IMAGE_BYTES) {
        throw httpError(413, `Images must be ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB or smaller.`)
    }

    const entry = {
        id: randomUUID(),
        name: String(name ?? "untitled").slice(0, 120),
        mimeType,
        size: bytes.length,
        createdAt: new Date().toISOString(),
    }

    if (usingDatabase) {
        await query(
            "INSERT INTO media (id, name, mime_type, size, data, created_at) VALUES ($1, $2, $3, $4, $5, $6)",
            [entry.id, entry.name, entry.mimeType, entry.size, bytes, entry.createdAt],
        )
        return toMetadata(entry)
    }

    entry.base64 = base64
    const entries = readAll()
    entries.push(entry)
    writeAll(entries)
    return toMetadata(entry)
}

export async function renameMedia(id, name) {
    if (usingDatabase) {
        const { rows } = await query(
            `UPDATE media SET name = COALESCE(NULLIF($2, ''), name) WHERE id = $1 RETURNING ${METADATA_COLUMNS}`,
            [id, String(name ?? "").slice(0, 120)],
        )
        if (!rows[0]) throw httpError(404, `Image not found: ${id}`)
        return toMetadata(fromRow(rows[0]))
    }

    const entries = readAll()
    const entry = entries.find((item) => item.id === id)
    if (!entry) throw httpError(404, `Image not found: ${id}`)

    entry.name = String(name ?? "").slice(0, 120) || entry.name
    writeAll(entries)
    return toMetadata(entry)
}

export async function deleteMedia(id) {
    if (usingDatabase) {
        const { rows } = await query(`DELETE FROM media WHERE id = $1 RETURNING ${METADATA_COLUMNS}`, [id])
        if (!rows[0]) throw httpError(404, `Image not found: ${id}`)
        return toMetadata(fromRow(rows[0]))
    }

    const entries = readAll()
    const index = entries.findIndex((entry) => entry.id === id)
    if (index === -1) throw httpError(404, `Image not found: ${id}`)

    const [removed] = entries.splice(index, 1)
    writeAll(entries)
    return toMetadata(removed)
}
