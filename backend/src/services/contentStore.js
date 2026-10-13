import fs from "node:fs"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { DATA_DIR } from "./dataDir.js"
import {
    CONTENT_COLLECTIONS,
    CONTENT_SECTIONS,
    CONTENT_VERSION,
    defaultContent,
} from "../../../shared/defaultContent.js"

const DATA_FILE = path.join(DATA_DIR, "content.json")

// Structured clone keeps the defaults immutable: every read hands out a copy, so
// an accidental mutation upstream can never corrupt the fallback.
function clone(value) {
    return JSON.parse(JSON.stringify(value))
}

function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value)
}

// Fills in anything the stored document is missing from the defaults, which is
// what makes adding a field to shared/defaultContent.js a non-breaking change:
// existing stores gain the new field on their next read instead of rendering
// `undefined`. Arrays are taken from the stored document wholesale, because a
// list the admin emptied on purpose must stay empty.
function withDefaults(stored, fallback = defaultContent) {
    if (!isPlainObject(stored)) return clone(fallback)

    const merged = clone(fallback)
    for (const [key, value] of Object.entries(stored)) {
        if (isPlainObject(value) && isPlainObject(merged[key])) {
            merged[key] = withDefaults(value, merged[key])
        } else if (value !== undefined) {
            merged[key] = clone(value)
        }
    }
    return merged
}

function readRaw() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
    } catch {
        // No file yet (first boot, or a recycled /tmp on Vercel) -- fall back to
        // the shipped defaults rather than serving an empty site.
        return null
    }
}

function writeRaw(document) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(document, null, 2), "utf-8")
}

export function getContent() {
    const content = withDefaults(readRaw())
    content.version = CONTENT_VERSION
    return content
}

function save(content) {
    const next = {
        ...content,
        version: CONTENT_VERSION,
        updatedAt: new Date().toISOString(),
    }
    writeRaw(next)
    return next
}

export function replaceContent(incoming) {
    if (!isPlainObject(incoming)) {
        throw httpError(400, "Content must be an object.")
    }
    return save(withDefaults(incoming))
}

export function updateSection(section, value) {
    if (!CONTENT_SECTIONS.includes(section)) {
        throw httpError(404, `Unknown content section: ${section}`)
    }
    if (!isPlainObject(value)) {
        throw httpError(400, "Section value must be an object.")
    }

    const content = getContent()
    // Merged rather than replaced so a form that only posts the fields it owns
    // cannot wipe the rest of its section.
    content[section] = withDefaults(value, content[section])
    return save(content)
}

export function resetContent(section) {
    if (!section) return save(clone(defaultContent))

    if (!CONTENT_SECTIONS.includes(section)) {
        throw httpError(404, `Unknown content section: ${section}`)
    }
    const content = getContent()
    content[section] = clone(defaultContent[section])
    return save(content)
}

// --- Collection CRUD -------------------------------------------------------
//
// Collections are addressed by their dotted path ("visiMisi.milestones"), and
// only the paths declared in CONTENT_COLLECTIONS are reachable, so a request
// cannot walk into an arbitrary part of the document.

function httpError(status, message) {
    const error = new Error(message)
    error.status = status
    return error
}

function resolveCollection(content, collectionPath) {
    const definition = CONTENT_COLLECTIONS[collectionPath]
    if (!definition) {
        throw httpError(404, `Unknown collection: ${collectionPath}`)
    }

    const segments = collectionPath.split(".")
    const key = segments.pop()
    let parent = content
    for (const segment of segments) {
        parent = parent?.[segment]
        if (!isPlainObject(parent)) {
            throw httpError(500, `Collection parent is missing: ${collectionPath}`)
        }
    }
    if (!Array.isArray(parent[key])) parent[key] = []

    return { definition, parent, key, items: parent[key] }
}

export function listItems(collectionPath) {
    return resolveCollection(getContent(), collectionPath).items
}

export function createItem(collectionPath, body) {
    const content = getContent()
    const { definition, items } = resolveCollection(content, collectionPath)

    const item = {
        ...clone(definition.fields),
        ...(isPlainObject(body) ? body : {}),
        // The id is ours to hand out; a client-supplied one is ignored so two
        // items can never collide.
        id: `${collectionPath.split(".").pop()}-${randomUUID().slice(0, 8)}`,
    }
    items.push(item)
    save(content)
    return item
}

export function updateItem(collectionPath, id, body) {
    const content = getContent()
    const { definition, items } = resolveCollection(content, collectionPath)

    const index = items.findIndex((item) => item.id === id)
    if (index === -1) {
        throw httpError(404, `${definition.label} not found: ${id}`)
    }

    items[index] = { ...items[index], ...(isPlainObject(body) ? body : {}), id }
    save(content)
    return items[index]
}

export function deleteItem(collectionPath, id) {
    const content = getContent()
    const { definition, items } = resolveCollection(content, collectionPath)

    const index = items.findIndex((item) => item.id === id)
    if (index === -1) {
        throw httpError(404, `${definition.label} not found: ${id}`)
    }

    const [removed] = items.splice(index, 1)
    save(content)
    return removed
}

// Reordering is its own operation because the order of a list is content too
// (which milestone comes first, which gallery tile sits where).
export function reorderItems(collectionPath, orderedIds) {
    if (!Array.isArray(orderedIds)) {
        throw httpError(400, "`ids` must be an array of item ids.")
    }

    const content = getContent()
    const { parent, key, items } = resolveCollection(content, collectionPath)

    const byId = new Map(items.map((item) => [item.id, item]))
    const reordered = []
    for (const id of orderedIds) {
        const item = byId.get(id)
        if (!item) throw httpError(400, `Unknown item id in order: ${id}`)
        byId.delete(id)
        reordered.push(item)
    }
    // Anything the caller left out keeps its relative position at the end, so a
    // stale client cannot silently drop items.
    parent[key] = [...reordered, ...byId.values()]

    save(content)
    return parent[key]
}

export { CONTENT_COLLECTIONS, CONTENT_SECTIONS }
