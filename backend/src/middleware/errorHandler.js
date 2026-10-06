export function notFoundHandler(req, res) {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, _req, res, _next) {
    console.error(err)
    res.status(err.status || 500).json({ success: false, error: err.message || "Internal server error" })
}
