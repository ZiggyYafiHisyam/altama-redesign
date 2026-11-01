export function notFoundHandler(req, res) {
    res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, _req, res, _next) {
    console.error(err)
    // A store's own errors (400s, 404s) are written for the client. Anything else
    // -- a database outage, a bug -- can carry internals such as the database
    // host, so it stays in the log.
    const status = err.status || 500
    const message = status < 500 && err.message ? err.message : "Internal server error"
    res.status(status).json({ success: false, error: message })
}
