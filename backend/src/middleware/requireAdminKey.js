export function requireAdminKey(req, res, next) {
    const expected = process.env.ADMIN_API_KEY

    if (!expected) {
        return res.status(503).json({ success: false, error: "Admin access is not configured on this server." })
    }
    if (req.get("x-admin-key") !== expected) {
        return res.status(401).json({ success: false, error: "Unauthorized." })
    }
    next()
}
