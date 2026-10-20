import { randomUUID } from "node:crypto"
import { addPageView, clearPageViews, listPageViews } from "../services/pageViewStore.js"

// What kind of client made the request, from the user-agent header. Only this
// summary is stored -- never the header itself, which is long, high-entropy and
// of no use to anyone reading the traffic log.
function describeClient(userAgent) {
    const agent = String(userAgent ?? "")
    if (!agent) return { device: "Unknown", browser: "Unknown" }

    if (/bot|crawler|spider|crawl|slurp|headless|preview|monitor|curl|wget|python-requests/i.test(agent)) {
        return { device: "Bot", browser: "Bot" }
    }

    const device = /ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(agent)
        ? "Tablet"
        : /mobi|iphone|ipod|android|blackberry|windows phone/i.test(agent)
          ? "Mobile"
          : "Desktop"

    // Order matters: the browsers below all claim to be several of the others.
    const browser = /edg\//i.test(agent)
        ? "Edge"
        : /opr\/|opera/i.test(agent)
          ? "Opera"
          : /samsungbrowser/i.test(agent)
            ? "Samsung Internet"
            : /chrome|crios/i.test(agent)
              ? "Chrome"
              : /firefox|fxios/i.test(agent)
                ? "Firefox"
                : /safari/i.test(agent)
                  ? "Safari"
                  : "Other"

    return { device, browser }
}

export function createPageView(req, res) {
    const entry = {
        id: randomUUID(),
        ...req.body,
        ...describeClient(req.get("user-agent")),
        openedAt: new Date().toISOString(),
    }
    addPageView(entry)
    console.log(`[page-view] ${entry.path}${entry.referrer ? ` (from ${entry.referrer})` : ""}`)
    res.status(201).json({ success: true, data: entry })
}

export function getPageViews(_req, res) {
    res.status(200).json({ success: true, data: listPageViews() })
}

export function resetPageViews(_req, res) {
    clearPageViews()
    res.status(200).json({ success: true, data: [] })
}
