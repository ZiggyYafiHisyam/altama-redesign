// The two form pieces the admin is built from: the shell a labelled field sits in
// and the icon button used for clear and delete. The admin only edits images, so
// there is nothing else to need.

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
