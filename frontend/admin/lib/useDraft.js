import { useCallback, useMemo, useState } from "react"
import { resetSection, saveSection } from "../../lib/api"
import { useContent } from "../../lib/content"
import { useToast } from "./toast"

// The content document is plain JSON, so this is both correct and the cheapest way
// to detach a draft from the live content.
function clone(value) {
    return JSON.parse(JSON.stringify(value))
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

function getAtPath(source, path) {
    return path.split(".").reduce((cursor, segment) => cursor?.[segment], source)
}

// The editing model every section page uses: one local draft, a dirty flag, and
// save/discard/reset against the API.
//
// The draft is seeded once, when the page mounts. That is safe because the admin
// layout does not render an editor until the first content fetch has landed, and
// because a save refreshes the shared content to exactly what was just sent --
// leaving the draft and the live section identical, which is what clears the dirty
// flag. Saving also means the public pages pick the change up without a reload.
export function useSectionDraft(section) {
    const { content, refresh } = useContent()
    const toast = useToast()

    const live = content[section]
    const [draft, setDraft] = useState(() => clone(live))
    const [isSaving, setIsSaving] = useState(false)

    const isDirty = JSON.stringify(live) !== JSON.stringify(draft)

    // update("hero.badge", value) -- so the form components stay unaware of where
    // in the section they sit.
    const update = useCallback((path, value) => {
        setDraft((previous) => {
            const next = clone(previous)
            setAtPath(next, path, value)
            return next
        })
    }, [])

    const get = useCallback((path) => getAtPath(draft, path), [draft])

    const save = useCallback(async () => {
        setIsSaving(true)
        try {
            await saveSection(section, draft)
            await refresh()
            toast.success("Saved. The live site is updated.")
        } catch (error) {
            toast.error(error.message)
            throw error
        } finally {
            setIsSaving(false)
        }
    }, [section, draft, refresh, toast])

    const revert = useCallback(() => {
        setDraft(clone(live))
        toast.info("Unsaved changes discarded.")
    }, [live, toast])

    const resetToDefaults = useCallback(async () => {
        setIsSaving(true)
        try {
            const body = await resetSection(section)
            setDraft(clone(body.data[section]))
            await refresh()
            toast.success("Reset to the original content.")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }, [section, refresh, toast])

    return useMemo(
        () => ({ draft, setDraft, get, update, isDirty, isSaving, save, revert, resetToDefaults }),
        [draft, get, update, isDirty, isSaving, save, revert, resetToDefaults],
    )
}
