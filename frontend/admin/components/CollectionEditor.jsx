import { useCallback, useState } from "react"
import {
    createItem as apiCreate,
    deleteItem as apiDelete,
    reorderItems as apiReorder,
    updateItem as apiUpdate,
} from "../../lib/api"
import { useContent } from "../../lib/content"
import { useToast } from "../lib/toast"
import { IconButton } from "./Fields"

// Create/read/update/delete plus ordering for one list in the content document.
//
// Items are saved per item rather than with the section around them: each row keeps
// its own draft, and Save sends just that row. That way two people (or two tabs)
// editing different milestones cannot overwrite each other, and a half-finished new
// row never reaches the live site.
export default function CollectionEditor({
    collection,
    items,
    title,
    description,
    itemLabel = "item",
    renderSummary,
    children,
    newItem,
    startOpen = false,
}) {
    const { refresh } = useContent()
    const toast = useToast()
    const [busyId, setBusyId] = useState(null)
    // Pages that are mostly a list (Careers) open their first row straight away;
    // the rest start collapsed so the list is scannable.
    const [openId, setOpenId] = useState(() => (startOpen ? items[0]?.id ?? null : null))

    const add = async () => {
        setBusyId("new")
        try {
            const body = await apiCreate(collection, newItem ?? {})
            await refresh()
            setOpenId(body.data.id)
            toast.success(`${itemLabel} added.`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBusyId(null)
        }
    }

    const remove = async (item, index) => {
        const name = renderSummary?.(item, index) ?? itemLabel
        if (!window.confirm(`Delete "${name}"? This updates the live site straight away.`)) return

        setBusyId(item.id)
        try {
            await apiDelete(collection, item.id)
            await refresh()
            toast.success(`${itemLabel} deleted.`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBusyId(null)
        }
    }

    const move = async (index, direction) => {
        const target = index + direction
        if (target < 0 || target >= items.length) return

        const ids = items.map((item) => item.id)
        ;[ids[index], ids[target]] = [ids[target], ids[index]]

        setBusyId(items[index].id)
        try {
            await apiReorder(collection, ids)
            await refresh()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBusyId(null)
        }
    }

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="font-header text-xl font-semibold text-slate-900">{title}</h2>
                    {description && (
                        <p className="mt-1 max-w-2xl font-inter text-sm text-slate-500">{description}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-inter text-xs font-semibold text-slate-500">
                        {items.length} {items.length === 1 ? itemLabel : `${itemLabel}s`}
                    </span>
                    <button
                        type="button"
                        className="rounded-xl bg-primary px-4 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        onClick={add}
                        disabled={busyId === "new"}
                    >
                        {busyId === "new" ? "Adding…" : `+ New ${itemLabel}`}
                    </button>
                </div>
            </header>

            {items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center font-inter text-sm text-slate-400">
                    Nothing here yet. Add your first {itemLabel}.
                </p>
            ) : (
                <ol className="flex flex-col gap-3">
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/60"
                        >
                            <div className="flex items-center gap-2 px-3 py-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white font-inter text-xs font-bold text-slate-400">
                                    {index + 1}
                                </span>
                                <button
                                    type="button"
                                    className="min-w-0 flex-1 truncate text-left font-inter text-sm font-semibold text-slate-700 transition-colors hover:text-primary"
                                    onClick={() => setOpenId(openId === item.id ? null : item.id)}
                                    aria-expanded={openId === item.id}
                                >
                                    {renderSummary?.(item, index) ?? `${itemLabel} ${index + 1}`}
                                </button>
                                <IconButton
                                    label="Move up"
                                    onClick={() => move(index, -1)}
                                    disabled={index === 0 || busyId !== null}
                                >
                                    ↑
                                </IconButton>
                                <IconButton
                                    label="Move down"
                                    onClick={() => move(index, 1)}
                                    disabled={index === items.length - 1 || busyId !== null}
                                >
                                    ↓
                                </IconButton>
                                <IconButton
                                    label={`Delete ${itemLabel}`}
                                    tone="danger"
                                    onClick={() => remove(item, index)}
                                    disabled={busyId !== null}
                                >
                                    ×
                                </IconButton>
                            </div>

                            {openId === item.id && (
                                <ItemEditor
                                    // Keying on the item's own serialised state restarts the
                                    // row's draft whenever the stored item changes (a save, a
                                    // reorder, another tab) without an effect that writes
                                    // state. It cannot interrupt typing: the key only tracks
                                    // what the server has, not what is being typed.
                                    key={JSON.stringify(item)}
                                    collection={collection}
                                    item={item}
                                    itemLabel={itemLabel}
                                >
                                    {children}
                                </ItemEditor>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </section>
    )
}

// One expanded row. Holds its own draft, so typing is instant and only this row's
// Save touches the API.
function ItemEditor({ collection, item, itemLabel, children }) {
    const { refresh } = useContent()
    const toast = useToast()
    const [draft, setDraft] = useState(item)
    const [isSaving, setSaving] = useState(false)

    const isDirty = JSON.stringify(item) !== JSON.stringify(draft)

    const update = useCallback((field, value) => {
        setDraft((previous) => ({ ...previous, [field]: value }))
    }, [])

    const save = async () => {
        setSaving(true)
        try {
            await apiUpdate(collection, item.id, draft)
            await refresh()
            toast.success(`${itemLabel} saved.`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="border-t border-slate-200 bg-white px-4 py-5">
            <div className="flex flex-col gap-4">{children({ item: draft, update })}</div>

            <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    onClick={save}
                    disabled={isSaving || !isDirty}
                >
                    {isSaving ? "Saving…" : "Save"}
                </button>
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-4 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400 disabled:opacity-50"
                    onClick={() => setDraft(item)}
                    disabled={!isDirty}
                >
                    Discard
                </button>
                {isDirty && (
                    <span className="font-inter text-xs font-semibold text-amber-600">Unsaved changes</span>
                )}
            </div>
        </div>
    )
}
