import { useCallback, useMemo, useState } from "react"
import { ToastContext } from "../lib/toast"

// Small toast stack for the admin: every save, delete and failure says so.

const TONES = {
    success: "border-emerald-300 bg-emerald-50 text-emerald-900",
    error: "border-rose-300 bg-rose-50 text-rose-900",
    info: "border-indigo-300 bg-indigo-50 text-indigo-900",
}

const ICONS = { success: "✓", error: "!", info: "i" }

let nextId = 0

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const push = useCallback((tone, message) => {
        const id = (nextId += 1)
        setToasts((current) => [...current, { id, tone, message }])
        // Errors stay up longer: they usually need reading, not just noticing.
        window.setTimeout(() => dismiss(id), tone === "error" ? 6000 : 3000)
    }, [dismiss])

    const value = useMemo(
        () => ({
            success: (message) => push("success", message),
            error: (message) => push("error", message),
            info: (message) => push("info", message),
        }),
        [push],
    )

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[min(24rem,calc(100vw-3rem))] flex-col gap-3"
                role="status"
                aria-live="polite"
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`admin-toast pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${TONES[toast.tone]}`}
                    >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-xs font-bold">
                            {ICONS[toast.tone]}
                        </span>
                        <p className="flex-1 text-sm leading-snug">{toast.message}</p>
                        <button
                            type="button"
                            className="shrink-0 text-lg leading-none opacity-50 transition-opacity hover:opacity-100"
                            onClick={() => dismiss(toast.id)}
                            aria-label="Dismiss"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastProvider
