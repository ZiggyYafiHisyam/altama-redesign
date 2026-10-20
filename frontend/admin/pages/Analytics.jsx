import { useEffect, useMemo, useState } from "react"
import { clearPageViews, fetchContacts, fetchPageViews } from "../../lib/api"
import { useToast } from "../lib/toast"
import { PageHeader } from "../components/Page"
import { BarChart, DonutChart, HourStrip } from "../components/Charts"
import {
    buildSessions,
    dayKey,
    downloadCsv,
    formatClock,
    formatDay,
    formatDuration,
    hourlyCounts,
    inPeriod,
    logCsv,
    monthOf,
    prepareViews,
    reportCsv,
    shiftDays,
    tally,
    weekOf,
} from "../lib/traffic"

// The page-view log, read as a report. Hits are grouped into visits (see
// lib/traffic.js), so the question this page answers is "who came, where did
// they land, what did they read" rather than "what was requested at 14:02".
// Everything is derived in the browser from the one /api/page-views response --
// the log is capped at 5000 entries server-side, well inside what a page can
// count.

const RANGES = [
    { id: "7", label: "Last 7 days", days: 7 },
    { id: "30", label: "Last 30 days", days: 30 },
    { id: "all", label: "All time", days: null },
]

const TOP_PAGES = 12
// Six is the most a part-to-whole chart can be read at a glance, and the sixth
// slot is spent on "Other" so the rest is never silently dropped.
const TOP_SOURCES = 5

// The journey a visit took, as a trail. Long ones are cut in the middle: the
// landing page and the last page are the two that matter, and the full list is
// one click away in the expanded row.
function trail(session, limit = 4) {
    const paths = session.hits.map((hit) => hit.path)
    if (paths.length <= limit) return paths.join(" → ")
    return `${paths.slice(0, limit - 1).join(" → ")} → … → ${paths[paths.length - 1]}`
}

// "October 2026", for the monthly report's own title line.
function monthLabel(from) {
    const [year, month] = from.split("-").map(Number)
    return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" })
}

const Analytics = () => {
    const toast = useToast()
    const [views, setViews] = useState([])
    const [contacts, setContacts] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [rangeId, setRangeId] = useState("30")
    // null until a date is picked, so the log can open on the most recent day
    // that actually has traffic rather than on an empty today.
    const [pickedDay, setDay] = useState(null)
    const [showBots, setShowBots] = useState(false)
    const [openSession, setOpenSession] = useState(null)

    // A promise chain that does not raise the loading flag itself: a setState
    // reached synchronously from the mount effect would cost an extra render before
    // the fetch even starts. The Refresh button raises it explicitly.
    //
    // The submissions come along for the ride: the share of contact-page visits
    // that end in a message is the one number here that says whether the traffic
    // is worth anything, and it needs both logs.
    const load = () =>
        Promise.all([
            fetchPageViews().then((body) => setViews(body.data)),
            fetchContacts()
                .then((body) => setContacts(body.data))
                .catch(() => setContacts([])),
        ])
            .catch((error) => toast.error(error.message))
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const siteHost = typeof window === "undefined" ? "" : window.location.host
    const allViews = useMemo(() => prepareViews(views, siteHost), [views, siteHost])

    const botViews = useMemo(() => allViews.filter((view) => view.device === "Bot").length, [allViews])
    const entries = useMemo(
        () => (showBots ? allViews : allViews.filter((view) => view.device !== "Bot")),
        [allViews, showBots],
    )

    const day = pickedDay ?? entries.at(-1)?.day ?? dayKey(new Date())
    const range = RANGES.find((option) => option.id === rangeId) ?? RANGES[1]

    const inRange = useMemo(() => {
        if (!range.days) return entries
        const from = shiftDays(dayKey(new Date()), -(range.days - 1))
        return entries.filter((entry) => entry.day >= from)
    }, [entries, range])

    const rangeSessions = useMemo(() => buildSessions(inRange), [inRange])

    const { byPath, bySource, busiest } = useMemo(() => {
        const sources = tally(rangeSessions, "source")
        // Everything past the fifth source is real traffic, so it is folded into
        // one segment rather than left off the chart.
        const head = sources.slice(0, TOP_SOURCES)
        const tail = sources.slice(TOP_SOURCES)

        return {
            byPath: tally(inRange, "path").slice(0, TOP_PAGES),
            bySource: tail.length
                ? [
                      ...head,
                      {
                          label: `Other (${tail.length})`,
                          value: tail.reduce((sum, item) => sum + item.value, 0),
                      },
                  ]
                : head,
            busiest: tally(inRange, "day")[0] ?? null,
        }
    }, [inRange, rangeSessions])

    // Contact-page visits that ended in a message. Both sides are counted over
    // the same period, so the figure moves with the filter above.
    const conversion = useMemo(() => {
        const visits = rangeSessions.filter((session) =>
            session.hits.some((hit) => hit.path.startsWith("/contact-us")),
        ).length
        const from = range.days ? shiftDays(dayKey(new Date()), -(range.days - 1)) : "0000-00-00"
        const messages = contacts.filter((contact) => dayKey(contact.createdAt) >= from).length
        return { visits, messages, rate: visits ? Math.round((messages / visits) * 100) : null }
    }, [rangeSessions, contacts, range])

    // The log, and the two report windows, all hang off the chosen date.
    const dayViews = useMemo(() => entries.filter((entry) => entry.day === day), [entries, day])
    const daySessions = useMemo(() => buildSessions(dayViews).reverse(), [dayViews])
    const hours = useMemo(() => hourlyCounts(entries, day), [entries, day])
    const week = weekOf(day)
    const month = monthOf(day)
    const busiestHour = hours.reduce((best, entry) => (entry.value > best.value ? entry : best), hours[0])

    const exportReport = (from, to, label, filename) => {
        const periodViews = inPeriod(entries, from, to)
        if (periodViews.length === 0) {
            toast.info("Nothing was recorded in that period.")
            return
        }
        downloadCsv(
            filename,
            reportCsv({ from, to, label, views: periodViews, sessions: buildSessions(periodViews) }),
        )
        toast.success(`${label} report downloaded.`)
    }

    const exportDayLog = () => {
        if (dayViews.length === 0) {
            toast.info("Nothing was recorded on that day.")
            return
        }
        downloadCsv(`traffic-log-${day}.csv`, logCsv(dayViews))
        toast.success(`Exported ${dayViews.length} rows.`)
    }

    const reset = async () => {
        if (!window.confirm("Clear the whole page-view log? This cannot be undone.")) return
        try {
            await clearPageViews()
            setViews([])
            toast.success("Log cleared.")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const pagesPerVisit = rangeSessions.length ? (inRange.length / rangeSessions.length).toFixed(1) : "0"

    return (
        <>
            <PageHeader
                title="Analytics"
                description="Every page a visitor opens is logged and grouped into visits. Admin pages are not counted."
            >
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                    onClick={() => {
                        setLoading(true)
                        load()
                    }}
                >
                    Refresh
                </button>
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm font-semibold text-slate-500 transition-colors hover:border-rose-300 hover:text-rose-600"
                    onClick={reset}
                >
                    Clear log
                </button>
            </PageHeader>

            {isLoading ? (
                <p className="font-inter text-sm text-slate-400">Loading…</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* One row of filters above the charts: the range governs every
                        figure on this screen except the traffic log, which has its
                        own date. */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
                            Period
                        </span>
                        <div className="flex rounded-xl bg-slate-100 p-1">
                            {RANGES.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`rounded-lg px-3 py-1.5 font-inter text-xs font-semibold transition-colors ${
                                        option.id === rangeId
                                            ? "bg-white text-primary shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                    onClick={() => setRangeId(option.id)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {botViews > 0 && (
                            <label className="flex items-center gap-2 font-inter text-xs text-slate-500">
                                <input
                                    type="checkbox"
                                    className="h-3.5 w-3.5 accent-[#353185]"
                                    checked={showBots}
                                    onChange={(event) => setShowBots(event.target.checked)}
                                />
                                Include bots ({botViews})
                            </label>
                        )}

                        <span className="font-inter text-xs text-slate-400">
                            {views.length} page views recorded in total
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Metric label="Visits" value={rangeSessions.length} sub={`${inRange.length} page views`} />
                        <Metric
                            label="Pages per visit"
                            value={pagesPerVisit}
                            sub={`${new Set(inRange.map((entry) => entry.path)).size} different pages opened`}
                        />
                        <Metric
                            label="Busiest day"
                            value={busiest ? busiest.value : 0}
                            sub={busiest ? formatDay(busiest.label) : "no traffic yet"}
                        />
                        <Metric
                            label="Contact conversion"
                            value={conversion.rate == null ? "—" : `${conversion.rate}%`}
                            sub={`${conversion.messages} messages from ${conversion.visits} contact-page visits`}
                        />
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <header className="mb-5">
                            <h2 className="font-header text-xl font-semibold text-slate-900">Views by page</h2>
                            <p className="mt-1 font-inter text-sm text-slate-500">
                                {byPath.length === TOP_PAGES
                                    ? `The ${TOP_PAGES} most visited paths, `
                                    : "Every path visited, "}
                                {range.label.toLowerCase()}. Hover a bar for the exact count.
                            </p>
                        </header>
                        {byPath.length === 0 ? (
                            <p className="font-inter text-sm text-slate-400">Nothing recorded in this period.</p>
                        ) : (
                            <BarChart
                                data={byPath.map((entry) => ({
                                    ...entry,
                                    share: Math.round((entry.value / inRange.length) * 100),
                                }))}
                            />
                        )}
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <header className="mb-5">
                            <h2 className="font-header text-xl font-semibold text-slate-900">
                                Where visitors came from
                            </h2>
                            <p className="mt-1 font-inter text-sm text-slate-500">
                                One slice per referring host, counted once per visit rather than once per page.
                                “Direct” means no referrer was sent — a typed address, a bookmark, or a link from
                                an app.
                            </p>
                        </header>
                        {bySource.length === 0 ? (
                            <p className="font-inter text-sm text-slate-400">Nothing recorded in this period.</p>
                        ) : (
                            <DonutChart data={bySource} total={rangeSessions.length} centerLabel="visits" />
                        )}
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h2 className="font-header text-xl font-semibold text-slate-900">
                                    Web traffic log
                                </h2>
                                <p className="mt-1 font-inter text-sm text-slate-500">
                                    One row per visit on the chosen day, newest first. Open a row to see every
                                    page that visit went through, in order.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-end gap-2">
                                <label className="flex flex-col gap-1">
                                    <span className="font-inter text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                        Day
                                    </span>
                                    <input
                                        className="rounded-xl border border-slate-200 px-3 py-2 font-inter text-sm text-slate-700 outline-none focus:border-primary"
                                        type="date"
                                        value={day}
                                        max={dayKey(new Date())}
                                        onChange={(event) => setDay(event.target.value || dayKey(new Date()))}
                                    />
                                </label>
                                <button
                                    type="button"
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                                    onClick={() => setDay(shiftDays(day, -1))}
                                >
                                    ← Previous
                                </button>
                                <button
                                    type="button"
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                                    onClick={() => setDay(shiftDays(day, 1))}
                                    disabled={day >= dayKey(new Date())}
                                >
                                    Next →
                                </button>
                            </div>
                        </header>

                        <div className="mb-6 grid gap-4 sm:grid-cols-3">
                            <DayStat label="Visits" value={daySessions.length} />
                            <DayStat label="Page views" value={dayViews.length} />
                            <DayStat
                                label="Busiest hour"
                                value={
                                    dayViews.length ? `${`${busiestHour.hour}`.padStart(2, "0")}:00` : "—"
                                }
                            />
                        </div>

                        <div className="mb-6">
                            <p className="mb-2 font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
                                Page views by hour — {formatDay(day)}
                            </p>
                            <HourStrip hours={hours} />
                        </div>

                        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                            <span className="font-inter text-xs font-bold uppercase tracking-wider text-slate-400">
                                Download
                            </span>
                            <button
                                type="button"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                                onClick={exportDayLog}
                            >
                                Day log ({dayViews.length} rows)
                            </button>
                            <button
                                type="button"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                                onClick={() =>
                                    exportReport(
                                        week.from,
                                        week.to,
                                        `Week of ${formatDay(week.from)}`,
                                        `traffic-report-week-${week.from}.csv`,
                                    )
                                }
                                title={`${formatDay(week.from)} – ${formatDay(week.to)}`}
                            >
                                Weekly report
                            </button>
                            <button
                                type="button"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                                onClick={() =>
                                    exportReport(
                                        month.from,
                                        month.to,
                                        monthLabel(month.from),
                                        `traffic-report-${month.from.slice(0, 7)}.csv`,
                                    )
                                }
                                title={`${formatDay(month.from)} – ${formatDay(month.to)}`}
                            >
                                Monthly report
                            </button>
                            <span className="font-inter text-xs text-slate-400">
                                The reports summarise the period; the day log is the raw rows.
                            </span>
                        </div>

                        {daySessions.length === 0 ? (
                            <p className="font-inter text-sm text-slate-400">
                                No visits recorded on {formatDay(day)}.
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-slate-100">
                                <table className="w-full min-w-200 text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            {[
                                                "Arrived",
                                                "Source",
                                                "Landed on",
                                                "Journey",
                                                "Pages",
                                                "Time on site",
                                                "Device",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-4 py-2.5 font-inter text-[11px] font-bold uppercase tracking-wide text-slate-400"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daySessions.map((session) => (
                                            <SessionRow
                                                key={session.key}
                                                session={session}
                                                isOpen={openSession === session.key}
                                                onToggle={() =>
                                                    setOpenSession(
                                                        openSession === session.key ? null : session.key,
                                                    )
                                                }
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </>
    )
}

// One visit, and -- once opened -- every page it touched. The disclosure is a
// button inside the first cell rather than a clickable <tr>, so the row can be
// reached from the keyboard.
function SessionRow({ session, isOpen, onToggle }) {
    return (
        <>
            <tr className={`border-b border-slate-50 ${isOpen ? "bg-slate-50/60" : ""}`}>
                <td className="whitespace-nowrap px-4 py-2.5">
                    <button
                        type="button"
                        className="flex items-center gap-2 font-mono text-xs text-slate-500 transition-colors hover:text-primary"
                        onClick={onToggle}
                        aria-expanded={isOpen}
                    >
                        <span
                            aria-hidden="true"
                            className={`inline-block text-[9px] transition-transform ${isOpen ? "rotate-90" : ""}`}
                        >
                            ▶
                        </span>
                        {formatClock(session.startedAt)}
                    </button>
                </td>
                <td className="max-w-40 truncate px-4 py-2.5 font-inter text-xs text-slate-500">
                    {session.source}
                </td>
                <td className="px-4 py-2.5 font-inter text-sm text-slate-700">{session.entryPath}</td>
                <td
                    className="max-w-80 truncate px-4 py-2.5 font-inter text-xs text-slate-500"
                    title={trail(session, 99)}
                >
                    {session.pageCount === 1 ? "—" : trail(session)}
                </td>
                <td className="px-4 py-2.5 font-inter text-sm text-slate-700">{session.pageCount}</td>
                <td className="whitespace-nowrap px-4 py-2.5 font-inter text-xs text-slate-500">
                    {formatDuration(session.duration)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 font-inter text-xs text-slate-500">
                    {session.device}
                    {session.estimated && (
                        <span
                            className="ml-1.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700"
                            title="Logged before visits were grouped, or by a browser that blocks storage. These pages were grouped by a 30-minute gap rule, so the grouping is an estimate."
                        >
                            est.
                        </span>
                    )}
                </td>
            </tr>

            {isOpen && (
                <tr className="border-b border-slate-100 bg-slate-50/60">
                    <td colSpan={7} className="px-4 pb-4 pt-1">
                        <ol className="flex flex-col gap-1">
                            {session.hits.map((hit, index) => (
                                <li key={hit.id} className="flex items-baseline gap-3">
                                    <span className="w-5 text-right font-inter text-[11px] text-slate-400">
                                        {index + 1}
                                    </span>
                                    <span className="font-mono text-xs text-slate-400">{formatClock(hit.at)}</span>
                                    <span className="font-inter text-sm text-slate-700">{hit.path}</span>
                                    {index > 0 && (
                                        <span className="font-inter text-[11px] text-slate-400">
                                            +{formatDuration(hit.at - session.hits[index - 1].at)} on the page
                                            before
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>
                        <p className="mt-3 font-inter text-[11px] text-slate-400">
                            {session.browser} on {session.device} · came from{" "}
                            {session.hits[0].referrer ?? "no referrer"}
                        </p>
                    </td>
                </tr>
            )}
        </>
    )
}

// A headline figure. The number is the chart here -- a bar of one is not.
function Metric({ label, value, sub }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-inter text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 font-header text-3xl font-semibold text-slate-900">{value}</p>
            {sub && (
                <p className="mt-1 truncate font-inter text-xs text-slate-400" title={sub}>
                    {sub}
                </p>
            )}
        </div>
    )
}

function DayStat({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="font-inter text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-1 font-header text-2xl font-semibold text-slate-900">{value}</p>
        </div>
    )
}

export default Analytics
