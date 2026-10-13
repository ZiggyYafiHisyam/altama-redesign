import { useCallback, useEffect, useMemo, useState } from "react"
import { adminLogin, adminMe, getAdminToken, setAdminToken } from "../lib/api"
import { AdminAuthContext } from "./lib/auth"

// Holds the admin session. The token itself lives in sessionStorage (see
// lib/api.js), so a reload keeps you signed in and closing the tab does not.
export function AdminAuthProvider({ children }) {
    const [user, setUser] = useState(null)
    // "checking" only when there is a stored token to validate -- otherwise we
    // already know the answer and can say so without a round trip.
    const [status, setStatus] = useState(() => (getAdminToken() ? "checking" : "signed-out"))

    useEffect(() => {
        if (!getAdminToken()) return

        let cancelled = false
        adminMe()
            .then((body) => {
                if (cancelled) return
                setUser(body.data.user)
                setStatus("signed-in")
            })
            .catch(() => {
                if (cancelled) return
                // Expired or tampered with: drop it and start over.
                setAdminToken(null)
                setStatus("signed-out")
            })

        return () => { cancelled = true }
    }, [])

    const login = useCallback(async (username, password) => {
        const body = await adminLogin(username, password)
        setAdminToken(body.data.token)
        setUser(body.data.user)
        setStatus("signed-in")
        return body.data.user
    }, [])

    const logout = useCallback(() => {
        setAdminToken(null)
        setUser(null)
        setStatus("signed-out")
    }, [])

    const value = useMemo(
        () => ({ user, status, isSignedIn: status === "signed-in", login, logout }),
        [user, status, login, logout],
    )

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export default AdminAuthProvider
