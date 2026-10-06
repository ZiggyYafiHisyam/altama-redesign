import { randomUUID } from "node:crypto"
import { addPageView, listPageViews } from "../services/pageViewStore.js"

export function createPageView(req, res) {
    const entry = {
        id: randomUUID(),
        ...req.body,
        openedAt: new Date().toISOString(),
    }
    addPageView(entry)
    console.log(`[page-view] ${entry.path}${entry.referrer ? ` (from ${entry.referrer})` : ""}`)
    res.status(201).json({ success: true, data: entry })
}

export function getPageViews(_req, res) {
    res.status(200).json({ success: true, data: listPageViews() })
}
