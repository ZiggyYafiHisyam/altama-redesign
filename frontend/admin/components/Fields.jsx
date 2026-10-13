import { useId } from "react"

// The form vocabulary every editor page is built from. They are all controlled
// and all take the same (label, value, onChange) shape, so a section page reads
// as a list of the fields it owns rather than as markup.

const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-inter text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"

export function FieldShell({ label, hint, htmlFor, children, className = "" }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label
                    className="font-inter text-xs font-semibold uppercase tracking-wide text-slate-500"
                    htmlFor={htmlFor}
                >
                    {label}
                </label>
            )}
            {children}
            {hint && <p className="font-inter text-xs leading-snug text-slate-400">{hint}</p>}
        </div>
    )
}

export function TextField({ label, hint, value, onChange, placeholder, className }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} htmlFor={id} className={className}>
            <input
                id={id}
                className={inputClass}
                type="text"
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </FieldShell>
    )
}

// Newlines in content text become line breaks on the page (see lib/text.jsx), so
// the hint says so wherever that matters.
export function TextAreaField({ label, hint, value, onChange, rows = 4, placeholder, className }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} htmlFor={id} className={className}>
            <textarea
                id={id}
                className={`${inputClass} resize-y leading-relaxed`}
                rows={rows}
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        </FieldShell>
    )
}

export function NumberField({ label, hint, value, onChange, min, max, className }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} htmlFor={id} className={className}>
            <input
                id={id}
                className={inputClass}
                type="number"
                min={min}
                max={max}
                value={value ?? 0}
                onChange={(event) => {
                    const next = Number(event.target.value)
                    onChange(Number.isNaN(next) ? 0 : next)
                }}
            />
        </FieldShell>
    )
}

export function SelectField({ label, hint, value, onChange, options, className }) {
    const id = useId()
    return (
        <FieldShell label={label} hint={hint} htmlFor={id} className={className}>
            <select
                id={id}
                className={inputClass}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </FieldShell>
    )
}

export function ToggleField({ label, hint, value, onChange, className = "" }) {
    return (
        <label className={`flex cursor-pointer items-start gap-3 ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={Boolean(value)}
                onClick={() => onChange(!value)}
                className={`mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                    value ? "bg-primary" : "bg-slate-300"
                }`}
            >
                <span
                    className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        value ? "translate-x-5" : "translate-x-0"
                    }`}
                />
            </button>
            <span>
                <span className="block font-inter text-sm font-semibold text-slate-700">{label}</span>
                {hint && <span className="block font-inter text-xs text-slate-400">{hint}</span>}
            </span>
        </label>
    )
}

// For the content's plain string arrays: brand chips, article tags, a board
// member's paragraphs. One row per entry, with add/remove/move.
export function StringListField({
    label,
    hint,
    value,
    onChange,
    placeholder = "",
    multiline = false,
    addLabel = "Add item",
}) {
    const items = Array.isArray(value) ? value : []

    const replace = (index, next) => {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? next : item)))
    }

    const remove = (index) => {
        onChange(items.filter((_, itemIndex) => itemIndex !== index))
    }

    const move = (index, direction) => {
        const target = index + direction
        if (target < 0 || target >= items.length) return
        const next = [...items]
        ;[next[index], next[target]] = [next[target], next[index]]
        onChange(next)
    }

    return (
        <FieldShell label={label} hint={hint}>
            <div className="flex flex-col gap-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                        {multiline ? (
                            <textarea
                                className={`${inputClass} resize-y leading-relaxed`}
                                rows={3}
                                value={item}
                                placeholder={placeholder}
                                onChange={(event) => replace(index, event.target.value)}
                            />
                        ) : (
                            <input
                                className={inputClass}
                                type="text"
                                value={item}
                                placeholder={placeholder}
                                onChange={(event) => replace(index, event.target.value)}
                            />
                        )}
                        <div className="flex shrink-0 gap-1">
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
                    </div>
                ))}
                <button
                    type="button"
                    className="self-start rounded-xl border border-dashed border-slate-300 px-3 py-2 font-inter text-xs font-semibold text-slate-500 transition-colors hover:border-primary hover:text-primary"
                    onClick={() => onChange([...items, ""])}
                >
                    + {addLabel}
                </button>
            </div>
        </FieldShell>
    )
}

export function IconButton({ label, onClick, disabled, tone = "default", children }) {
    const tones = {
        default: "border-slate-200 text-slate-500 hover:border-primary hover:text-primary",
        danger: "border-rose-200 text-rose-500 hover:border-rose-400 hover:bg-rose-50",
    }

    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={`flex h-10 w-9 items-center justify-center rounded-xl border bg-white text-base transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]}`}
        >
            {children}
        </button>
    )
}
