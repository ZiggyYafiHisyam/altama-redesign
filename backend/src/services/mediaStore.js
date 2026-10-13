import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { DATA_DIR } from "./dataDir.js"

const DATA_FILE = path.join(DATA_DIR, "media.json")

// Uploaded images live inside the JSON store as base64 rather than as files on
// disk, because the only writable path on Vercel is /tmp and a separate file
// tree there buys nothing over one document. Keep the per-image cap modest: the
// whole library is read and rewritten on every upload.
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

export function listMedia() {
    return readAll()
        .map(toMetadata)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getMedia(id) {
    return readAll().find((entry) => entry.id === id) ?? null
}

// `dataUrl` is what a browser's FileReader.readAsDataURL produces, which is the
// simplest thing for the admin to send over plain JSON.
export function addMedia({ name, dataUrl }) {
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
        base64,
        createdAt: new Date().toISOString(),
    }

    const entries = readAll()
    entries.push(entry)
    writeAll(entries)
    return toMetadata(entry)
}

export function renameMedia(id, name) {
    const entries = readAll()
    const entry = entries.find((item) => item.id === id)
    if (!entry) throw httpError(404, `Image not found: ${id}`)

    entry.name = String(name ?? "").slice(0, 120) || entry.name
    writeAll(entries)
    return toMetadata(entry)
}

export function deleteMedia(id) {
    const entries = readAll()
    const index = entries.findIndex((entry) => entry.id === id)
    if (index === -1) throw httpError(404, `Image not found: ${id}`)

    const [removed] = entries.splice(index, 1)
    writeAll(entries)
    return toMetadata(removed)
}
