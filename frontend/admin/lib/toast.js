import { createContext, useContext } from "react"

// Context and hook only; the provider component (which also renders the stack) is
// components/ToastProvider.jsx.

export const ToastContext = createContext(null)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error("useToast must be used inside a ToastProvider")
    return context
}
