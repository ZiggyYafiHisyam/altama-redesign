export function validatePageView(req, res, next) {
    const { path: pagePath } = req.body ?? {}

    if (!pagePath || !String(pagePath).trim()) {
        return res.status(400).json({ success: false, errors: { path: "Page path is required." } })
    }

    req.body = {
        path: String(pagePath).trim(),
        referrer: req.body?.referrer ? String(req.body.referrer).trim() : null,
    }
    next()
}
