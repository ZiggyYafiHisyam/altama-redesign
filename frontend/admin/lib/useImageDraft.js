import { useCallback, useMemo, useState } from "react"
import { defaultContent } from "../../../shared/defaultContent.js"
import { saveSection } from "../../lib/api"
import { useContent } from "../../lib/content"
import { IMAGE_GROUPS, IMAGE_SECTIONS } from "./imageFields"
import { useToast } from "./toast"

// The content document is plain JSON, so this is both correct and the cheapest way
// to detach a draft from the live content.
function clone(value) {
    return JSON.parse(JSON.stringify(value))
}

function getAtPath(source, path) {
    return path.split(".").reduce((cursor, segment) => cursor?.[segment], source)
}

function setAtPath(target, path, value) {
    const segments = path.split(".")
    const last = segments.pop()
    let cursor = target
    for (const segment of segments) {
        if (typeof cursor[segment] !== "object" || cursor[segment] === null) cursor[segment] = {}
        cursor = cursor[segment]
    }
    cursor[last] = value
}

// Every image path the registry owns, flattened. List images are addressed per
// item, by id, because an item's position can change.
function registeredPaths(content, groups = IMAGE_GROUPS) {
    const paths = []
    for (const group of groups) {
        for (const field of group.fields ?? []) {
            paths.push({ path: field.path, id: null })
        }
        for (const list of group.lists ?? []) {
            const items = getAtPath(content, list.path) ?? []
            items.forEach((item, index) => {
                paths.push({ path: `${list.path}.${index}.${list.imageKey}`, id: item.id, list })
            })
        }
    }
    return paths
}

// One draft spanning the given sections (every section holding a registry image
// by default; the gallery editor passes its own). The draft is the image
// sections of the content document, so saving is a PATCH per section that actually
// changed -- and a section whose images were left alone is never written at all.
//
// The draft is seeded once, on mount, which is safe because AdminLayout does not
// render an editor until the first content fetch has landed, and a save refreshes
// the shared content to exactly what was just sent -- leaving draft and live
// identical, which is what clears the dirty flag.
export function useImageDraft(sections = IMAGE_SECTIONS) {
    const { content, refresh } = useContent()
    const toast = useToast()

    // Falling back per section, so a document stored before a section existed
    // still opens in the editor rather than throwing on the clone below.
    const live = useMemo(
        () =>
            Object.fromEntries(
                sections.map((section) => [section, content[section] ?? defaultContent[section]]),
            ),
        [content, sections],
    )

    const [draft, setDraft] = useState(() => clone(live))
    const [isSaving, setIsSaving] = useState(false)

    // Which sections differ, so Save knows what to send and the bar knows whether
    // to show itself.
    const dirtySections = useMemo(
        () =>
            sections.filter(
                (section) => JSON.stringify(live[section]) !== JSON.stringify(draft[section]),
            ),
        [sections, live, draft],
    )

    const get = useCallback((path) => getAtPath(draft, path), [draft])

    const update = useCallback((path, value) => {
        setDraft((previous) => {
            const next = clone(previous)
            setAtPath(next, path, value)
            return next
        })
    }, [])

    const save = useCallback(async () => {
        setIsSaving(true)
        try {
            for (const section of dirtySections) {
                await saveSection(section, draft[section])
            }
            await refresh()
            toast.success("Saved. The live site is updated.")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }, [dirtySections, draft, refresh, toast])

    const revert = useCallback(() => {
        setDraft(clone(live))
        toast.info("Unsaved changes discarded.")
    }, [live, toast])

    // Puts part of the draft back to what the site shipped with. The caller says
    // which part -- restoreRegistryImages below for the fixed slots, the gallery
    // editor for its two lists -- so a restore never has to be the API's section
    // reset, which would take the surrounding copy with it.
    const restore = useCallback(
        (restorer, message) => {
            setDraft((previous) => {
                const next = clone(previous)
                restorer(next)
                return next
            })
            toast.info(message)
        },
        [toast],
    )

    return useMemo(
        () => ({
            get,
            update,
            isDirty: dirtySections.length > 0,
            isSaving,
            save,
            revert,
            restore,
        }),
        [get, update, dirtySections, isSaving, save, revert, restore],
    )
}

// Every registry image back to the one the site shipped with, in place. List
// images are matched by item id, so an item added after release (a new article,
// say) keeps whatever image it has.
export function restoreRegistryImages(draft, groups = IMAGE_GROUPS) {
    for (const entry of registeredPaths(draft, groups)) {
        if (!entry.id) {
            const original = getAtPath(defaultContent, entry.path)
            if (original !== undefined) setAtPath(draft, entry.path, original)
            continue
        }
        const originalItems = getAtPath(defaultContent, entry.list.path) ?? []
        const original = originalItems.find((item) => item.id === entry.id)
        if (original) setAtPath(draft, entry.path, original[entry.list.imageKey])
    }
}

// The same restore, limited to one page's images -- which is all a single-page
// editor has in its draft, so a wider restore would write sections it never
// loaded.
export function restoreGroupImages(group) {
    return (draft) => restoreRegistryImages(draft, [group])
}
