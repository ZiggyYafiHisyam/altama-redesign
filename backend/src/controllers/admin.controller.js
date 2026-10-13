import { issueToken, verifyCredentials } from "../services/adminAuth.js"
import {
    addMedia,
    deleteMedia,
    getMedia,
    listMedia,
    renameMedia,
} from "../services/mediaStore.js"
import { listContacts } from "../services/contactStore.js"
import { listPageViews } from "../services/pageViewStore.js"
import { getContent } from "../services/contentStore.js"

export function login(req, res) {
    const { username, password } = req.body ?? {}

    if (!verifyCredentials(username, password)) {
        return res.status(401).json({ success: false, error: "Wrong username or password." })
    }

    const { token, expiresAt } = issueToken(String(username))
    res.status(200).json({
        success: true,
        data: { token, expiresAt, user: { username: String(username) } },
    })
}

// Lets the admin app confirm a token it restored from storage is still good
// before it shows the dashboard.
export function me(req, res) {
    res.status(200).json({ success: true, data: { user: { username: req.admin.username } } })
}

export function getMediaLibrary(_req, res) {
    res.status(200).json({ success: true, data: listMedia() })
}

export function uploadMedia(req, res) {
    const { name, dataUrl } = req.body ?? {}
    res.status(201).json({ success: true, data: addMedia({ name, dataUrl }) })
}

export function patchMedia(req, res) {
    res.status(200).json({ success: true, data: renameMedia(req.params.id, req.body?.name) })
}

export function removeMedia(req, res) {
    res.status(200).json({ success: true, data: deleteMedia(req.params.id) })
}

// Public: the <img> tags on the live site point here. Cached hard because the id
// changes whenever the image does.
export function serveMedia(req, res) {
    const entry = getMedia(req.params.id)
    if (!entry) {
        return res.status(404).json({ success: false, error: "Image not found." })
    }

    const bytes = Buffer.from(entry.base64, "base64")
    res.setHeader("Content-Type", entry.mimeType)
    res.setHeader("Content-Length", bytes.length)
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    res.status(200).end(bytes)
}

// Everything the dashboard's overview needs, in one request.
export function getStats(_req, res) {
    const content = getContent()
    const views = listPageViews()
    const contacts = listContacts()

    const since = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recentViews = views.filter((view) => Date.parse(view.openedAt) >= since)

    // Visits per path, most visited first.
    const byPath = new Map()
    for (const view of views) {
        byPath.set(view.path, (byPath.get(view.path) ?? 0) + 1)
    }
    const topPaths = [...byPath.entries()]
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8)

    // Visits per day for the last 7 days, oldest first, with empty days filled in
    // so the dashboard chart has no gaps.
    const daily = []
    for (let offset = 6; offset >= 0; offset -= 1) {
        const day = new Date(Date.now() - offset * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)
        daily.push({
            day,
            count: views.filter((view) => view.openedAt?.slice(0, 10) === day).length,
        })
    }

    res.status(200).json({
        success: true,
        data: {
            totals: {
                pageViews: views.length,
                pageViewsLast7Days: recentViews.length,
                contacts: contacts.length,
                mediaFiles: listMedia().length,
                jobs: content.careers?.jobs?.length ?? 0,
                articles: content.news?.articles?.length ?? 0,
                brands: content.brands?.items?.length ?? 0,
                testimonials: content.lifeAt?.testimonials?.length ?? 0,
                galleryImages:
                    (content.gallery?.web?.length ?? 0) +
                    (content.gallery?.instagram?.filter((item) => item.image).length ?? 0),
            },
            topPaths,
            daily,
            contentUpdatedAt: content.updatedAt ?? null,
            recentContacts: contacts.slice(-5).reverse(),
        },
    })
}
