import { FieldShell, IconButton } from "./Fields"

// A list of objects nested inside one item: an article's sections, a brand's
// highlight stats, a menu's links.
//
// These are edited as part of their parent (the parent's Save sends the whole
// array), which is why this is a form field and not a CollectionEditor: the API
// addresses the parent item, not these.
export default function ObjectListField({
    label,
    hint,
    value,
    onChange,
    newItem,
    renderSummary,
    children,
    addLabel = "Add",
    itemLabel = "item",
}) {
    const items = Array.isArray(value) ? value : []

    const replace = (index, next) => {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? next : item)))
    }

    const update = (index) => (field, fieldValue) => {
        replace(index, { ...items[index], [field]: fieldValue })
    }

    const remove = (index) => {
        const name = renderSummary?.(items[index], index) ?? itemLabel
        if (!window.confirm(`Remove "${name}"? It is deleted once you save.`)) return
        onChange(items.filter((_, itemIndex) => itemIndex !== index))
    }

    const move = (index, direction) => {
        const target = index + direction
        if (target < 0 || target >= items.length) return
        const next = [...items]
        ;[next[index], next[target]] = [next[target], next[index]]
        onChange(next)
    }

    const add = () => {
        // Nested items are not addressed by the API, but a stable id still makes a
        // good React key and keeps the shape consistent with top-level items.
        const id = `${itemLabel}-${Date.now().toString(36)}`
        onChange([...items, { id, ...(typeof newItem === "function" ? newItem() : newItem) }])
    }

    return (
        <FieldShell label={label} hint={hint}>
            <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <div
                        key={item.id ?? index}
                        className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                    >
                        <div className="mb-3 flex items-center gap-2">
                            <span className="min-w-0 flex-1 truncate font-inter text-xs font-bold uppercase tracking-wide text-slate-400">
                                {renderSummary?.(item, index) ?? `${itemLabel} ${index + 1}`}
                            </span>
                            <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                                ↑
                            </IconButton>
                            <IconButton
                                label="Move down"
                                onClick={() => move(index, 1)}
                                disabled={index === items.length - 1}
                            >
                                ↓
                            </IconButton>
                            <IconButton label="Remove" tone="danger" onClick={() => remove(index)}>
                                ×
                            </IconButton>
                        </div>
                        <div className="flex flex-col gap-3">
                            {children({ item, update: update(index), index })}
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    className="self-start rounded-xl border border-dashed border-slate-300 px-3 py-2 font-inter text-xs font-semibold text-slate-500 transition-colors hover:border-primary hover:text-primary"
                    onClick={add}
                >
                    + {addLabel}
                </button>
            </div>
        </FieldShell>
    )
}
