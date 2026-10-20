// Turning the raw page-view log into the things a traffic report is made of:
// local days, visits (sessions), and the CSV reports the admin downloads.
//
// Everything here is a pure function of the log, so the analytics page can stay
// a view: the page decides what to show, this decides what the numbers are.

// A visit with no session id of its own -- a row logged before sessions existed,
// or a browser with storage blocked -- is closed after this much silence.
export const SESSION_GAP_MS = 30 * 60 * 1000

// Local calendar day, in the format <input type="date"> speaks. Deliberately not
// toISOString(), which would file an evening visit under the next day.
export function dayKey(value) {
    const date = value instanceof Date ? value : new Date(value)
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    return `${date.getFullYear()}-${month}-${day}`
}

export function parseDayKey(key) {
    const [year, month, day] = key.split("-").map(Number)
    return new Date(year, month - 1, day)
}

export function shiftDays(key, amount) {
    const date = parseDayKey(key)
    date.setDate(date.getDate() + amount)
    return dayKey(date)
}

// The Monday-to-Sunday week, and the calendar month, that a day falls in -- the
// two windows the weekly and monthly reports cover.
export function weekOf(key) {
    const date = parseDayKey(key)
    const monday = shiftDays(key, -((date.getDay() + 6) % 7))
    return { from: monday, to: shiftDays(monday, 6) }
}

export function monthOf(key) {
    const date = parseDayKey(key)
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    return { from: dayKey(new Date(date.getFullYear(), date.getMonth(), 1)), to: dayKey(last) }
}

export function formatDay(key) {
    return parseDayKey(key).toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

export function formatClock(value) {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// A visit's length is the gap between its first and last page, because there is
// no event for closing the tab: a one-page visit therefore has no measurable
// length at all, and saying so is better than printing "0s".
export function formatDuration(ms) {
    if (!ms) return "—"
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

// The host a visit came in from. Same-origin hops are the visitor walking the
// site, which is traffic *within* the site rather than a source for it.
export function sourceOf(view, siteHost) {
    if (!view.referrer) return "Direct"
    try {
        const host = new URL(view.referrer, "http://localhost").host
        if (!host) return "Direct"
        return host === siteHost ? "This site" : host
    } catch {
        return view.referrer
    }
}

// The log as the rest of the app wants it: oldest first, with the fields every
// summary needs resolved once.
export function prepareViews(views, siteHost) {
    return views
        .map((view) => ({
            ...view,
            at: new Date(view.openedAt).getTime(),
            day: dayKey(view.openedAt),
            source: sourceOf(view, siteHost),
            device: view.device ?? "Unknown",
            browser: view.browser ?? "Unknown",
        }))
        .sort((a, b) => a.at - b.at)
}

// Hits grouped into visits. A hit carrying a session id joins that visit; a hit
// without one (logged before sessions existed, or from a browser that blocks
// storage) opens a new visit after 30 minutes of silence, which is the usual
// convention -- those are flagged `estimated`, because that is a guess and the
// others are not.
export function buildSessions(views) {
    const groups = new Map()
    let fallbackKey = null
    let fallbackLastAt = 0

    for (const view of views) {
        let key
        if (view.sessionId) {
            key = `s:${view.sessionId}`
        } else {
            if (!fallbackKey || view.at - fallbackLastAt > SESSION_GAP_MS) fallbackKey = `g:${view.id}`
            fallbackLastAt = view.at
            key = fallbackKey
        }
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key).push(view)
    }

    return [...groups.entries()]
        .map(([key, hits]) => {
            const first = hits[0]
            const last = hits[hits.length - 1]
            return {
                key,
                hits,
                estimated: !first.sessionId,
                startedAt: first.at,
                endedAt: last.at,
                duration: last.at - first.at,
                day: first.day,
                // The source is where the visit came in, so it is the first hit's
                // -- a later hit's referrer is just the previous page.
                source: first.source,
                entryPath: first.path,
                exitPath: last.path,
                pageCount: hits.length,
                uniquePages: new Set(hits.map((hit) => hit.path)).size,
                device: first.device,
                browser: first.browser,
                isBot: first.device === "Bot",
            }
        })
        .sort((a, b) => a.startedAt - b.startedAt)
}

export function tally(items, key) {
    const counts = new Map()
    for (const item of items) counts.set(item[key], (counts.get(item[key]) ?? 0) + 1)
    return [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
}

// Hits per hour of one local day, always all 24 so the shape of the day is
// visible rather than implied by whichever hours happen to have traffic.
export function hourlyCounts(views, day) {
    const hours = Array.from({ length: 24 }, (_, hour) => ({ hour, value: 0 }))
    for (const view of views) {
        if (view.day !== day) continue
        hours[new Date(view.at).getHours()].value += 1
    }
    return hours
}

export function inPeriod(items, from, to) {
    return items.filter((item) => item.day >= from && item.day <= to)
}

// --- CSV -------------------------------------------------------------------

// RFC 4180 quoting: a page path or a referrer can hold a comma, and a quote in a
// field has to be doubled or the row splits in the wrong place.
function csvCell(value) {
    const text = value == null ? "" : String(value)
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function downloadCsv(filename, rows) {
    const body = rows.map((row) => row.map(csvCell).join(",")).join("\r\n")
    // The BOM is what makes Excel open UTF-8 as UTF-8 rather than as Latin-1.
    const blob = new Blob([`\uFEFF${body}`], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}

const percent = (part, whole) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "0%")

// The raw log: one row per page opened, for the day you are looking at. This is
// the evidence; the report below is the summary.
export function logCsv(views) {
    return [
        ["Date", "Time", "Page", "Visit", "Source", "Device", "Browser", "Referrer"],
        ...views.map((view) => [
            view.day,
            new Date(view.at).toLocaleTimeString(),
            view.path,
            // Short and stable: enough to tell two visits apart in a spreadsheet
            // without pasting a UUID into every row.
            view.sessionId ? view.sessionId.slice(0, 8) : "—",
            view.source,
            view.device,
            view.browser,
            view.referrer ?? "",
        ]),
    ]
}

// The weekly and monthly download: a report someone can forward, not a dump.
// Sections are separated by a blank row, which spreadsheets handle fine and a
// reader handles better than 3000 timestamps.
export function reportCsv({ from, to, label, views, sessions }) {
    const visits = sessions.length
    const pageViews = views.length
    const days = tally(views, "day")
    const perDay = new Map(days.map((entry) => [entry.label, entry.value]))
    const visitsPerDay = new Map(tally(sessions, "day").map((entry) => [entry.label, entry.value]))

    const rows = [
        ["Altama website traffic report"],
        ["Period", label],
        ["From", from],
        ["To", to],
        ["Generated", new Date().toLocaleString()],
        [],
        ["Summary"],
        ["Visits", visits],
        ["Page views", pageViews],
        ["Pages per visit", visits ? (pageViews / visits).toFixed(1) : "0"],
        ["Days with traffic", days.length],
        ["Busiest day", days[0] ? `${days[0].label} (${days[0].value} views)` : "—"],
        [],
        ["Daily"],
        ["Date", "Weekday", "Visits", "Page views"],
    ]

    for (let day = from; day <= to; day = shiftDays(day, 1)) {
        rows.push([
            day,
            parseDayKey(day).toLocaleDateString(undefined, { weekday: "long" }),
            visitsPerDay.get(day) ?? 0,
            perDay.get(day) ?? 0,
        ])
    }

    const section = (title, heading, entries, whole) => {
        rows.push([], [title], heading)
        if (entries.length === 0) rows.push(["—", 0, "0%"])
        for (const entry of entries) rows.push([entry.label, entry.value, percent(entry.value, whole)])
    }

    section("Pages", ["Page", "Views", "Share of views"], tally(views, "path"), pageViews)
    section("Sources", ["Source", "Visits", "Share of visits"], tally(sessions, "source"), visits)
    section("Entry pages", ["Landed on", "Visits", "Share of visits"], tally(sessions, "entryPath"), visits)
    section("Devices", ["Device", "Visits", "Share of visits"], tally(sessions, "device"), visits)

    return rows
}
