export function validatePageView(req, res, next) {
    const { path: pagePath } = req.body ?? {}

    if (!pagePath || !String(pagePath).trim()) {
        return res.status(400).json({ success: false, errors: { path: "Page path is required." } })
    }

    // The session id groups the pages one visitor opened in one sitting. It is a
    // random value the browser keeps in sessionStorage for the life of the tab:
    // it identifies a visit, never a person, and it is capped here because it
    // arrives from the client like everything else in this body.
    const sessionId = req.body?.sessionId ? String(req.body.sessionId).trim().slice(0, 64) : null

    req.body = {
        path: String(pagePath).trim(),
        referrer: req.body?.referrer ? String(req.body.referrer).trim() : null,
        sessionId: sessionId || null,
    }
    next()
}
