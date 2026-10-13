import { verifyToken } from "../services/adminAuth.js"

// Guards every write endpoint behind the admin panel.
//
// Two credentials are accepted, both optional on the client's side:
//   Authorization: Bearer <token>   a session from POST /api/admin/login
//   x-admin-key: <ADMIN_API_KEY>    the pre-existing machine key, kept so the
//                                   contact/page-view exports keep working for
//                                   anything already using them
export function requireAdminAuth(req, res, next) {
    const header = req.get("authorization") ?? ""
    const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null

    const session = bearer ? verifyToken(bearer) : null
    if (session) {
        req.admin = session
        return next()
    }

    const apiKey = process.env.ADMIN_API_KEY
    if (apiKey && req.get("x-admin-key") === apiKey) {
        req.admin = { username: "api-key" }
        return next()
    }

    // 401 either way: a bearer token that failed to verify is indistinguishable
    // from none at all as far as the client needs to know.
    res.status(401).json({
        success: false,
        error: bearer ? "Your session has expired. Please sign in again." : "Unauthorized.",
    })
}
