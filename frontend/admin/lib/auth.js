import { createContext, useContext } from "react"

// Context and hook only; the provider component is AdminAuthProvider.jsx. Kept
// apart so neither file exports both a component and a hook.

export const AdminAuthContext = createContext(null)

export function useAdminAuth() {
    const context = useContext(AdminAuthContext)
    if (!context) throw new Error("useAdminAuth must be used inside an AdminAuthProvider")
    return context
}
