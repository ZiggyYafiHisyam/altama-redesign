import { Link } from "react-router-dom"

// Shared chrome for an editor page: title, the "view on the site" shortcut, and a
// sticky save bar that only appears once something is actually unsaved.

export function PageHeader({ title, description, previewPath, children }) {
    return (
        <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="font-header text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
                {description && (
                    <p className="mt-2 max-w-3xl font-inter text-sm leading-relaxed text-slate-500">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                {children}
                {previewPath && (
                    <Link
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                        to={previewPath}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View page ↗
                    </Link>
                )}
            </div>
        </header>
    )
}

// Groups related fields. Sections of the site are big, so an editor page is a
// stack of these rather than one long form.
export function Card({ title, description, children, className = "" }) {
    return (
        <section className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
            {(title || description) && (
                <header className="mb-5">
                    {title && (
                        <h2 className="font-header text-xl font-semibold text-slate-900">{title}</h2>
                    )}
                    {description && (
                        <p className="mt-1 max-w-2xl font-inter text-sm text-slate-500">{description}</p>
                    )}
                </header>
            )}
            <div className="flex flex-col gap-4">{children}</div>
        </section>
    )
}

export function Grid({ children, columns = 2 }) {
    const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-3" }[columns] ?? "md:grid-cols-2"
    return <div className={`grid grid-cols-1 gap-4 ${cols}`}>{children}</div>
}

// Sticky, and only rendered while there is something to save -- so it never
// covers content it is not relevant to.
export function SaveBar({ isDirty, isSaving, onSave, onRevert, onReset, resetLabel = "Reset to original" }) {
    return (
        <div className="sticky bottom-4 z-20 mt-8">
            <div
                className={`flex flex-wrap items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-lg backdrop-blur transition-colors ${
                    isDirty ? "border-amber-200 bg-amber-50/95" : "border-slate-200 bg-white/95"
                }`}
            >
                <span className="font-inter text-sm font-semibold text-slate-700">
                    {isDirty ? "You have unsaved changes" : "Everything is saved"}
                </span>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                    {onReset && (
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm font-semibold text-slate-500 transition-colors hover:border-rose-300 hover:text-rose-600"
                            onClick={onReset}
                            disabled={isSaving}
                        >
                            {resetLabel}
                        </button>
                    )}
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400 disabled:opacity-50"
                        onClick={onRevert}
                        disabled={!isDirty || isSaving}
                    >
                        Discard
                    </button>
                    <button
                        type="button"
                        className="rounded-xl bg-primary px-5 py-2 font-inter text-sm font-semibold text-white shadow transition-opacity hover:opacity-90 disabled:opacity-50"
                        onClick={onSave}
                        disabled={!isDirty || isSaving}
                    >
                        {isSaving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// The hero-heading pattern shows up on nearly every page, so its three fields get
// one explainer instead of repeating it everywhere.
export const HIGHLIGHT_HINT =
    'The highlight is the part shown in yellow. Leave a field empty to drop it.'
