import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchStats } from "../../lib/api"
import { useContent } from "../../lib/content"
import { useToast } from "../lib/toast"
import { PageHeader } from "../components/Page"

const SHORTCUTS = [
    { to: "/admin/home", label: "Home page", hint: "Hero, intro, award block" },
    { to: "/admin/careers", label: "Job openings", hint: "Add or close a vacancy" },
    { to: "/admin/news", label: "News", hint: "Write and publish an article" },
    { to: "/admin/gallery", label: "Gallery", hint: "Swap the photo mosaic" },
    { to: "/admin/media", label: "Media library", hint: "Upload and manage images" },
    { to: "/admin/inbox", label: "Inbox", hint: "Read contact submissions" },
]

function Stat({ label, value, sub }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-inter text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 font-header text-3xl font-semibold text-slate-900">{value}</p>
            {sub && <p className="mt-1 font-inter text-xs text-slate-400">{sub}</p>}
        </div>
    )
}

// A plain CSS bar chart: seven bars never justifies a charting library, and this
// stays legible when the API returns all zeros.
function DailyChart({ daily }) {
    const peak = Math.max(1, ...daily.map((day) => day.count))

    return (
        <div className="flex h-40 items-end gap-2">
            {daily.map((day) => (
                <div key={day.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="font-inter text-[11px] font-semibold text-slate-400">{day.count}</span>
                    <div
                        className="w-full rounded-t-lg bg-linear-to-t from-[#605BC3] to-[#353185] transition-all"
                        style={{ height: `${Math.max(2, (day.count / peak) * 100)}%` }}
                        title={`${day.count} views on ${day.day}`}
                    />
                    <span className="font-inter text-[10px] text-slate-400">{day.day.slice(5)}</span>
                </div>
            ))}
        </div>
    )
}

const Dashboard = () => {
    const { content } = useContent()
    const toast = useToast()
    const [stats, setStats] = useState(null)

    useEffect(() => {
        fetchStats()
            .then((body) => setStats(body.data))
            .catch((error) => toast.error(error.message))
        // Loading once on mount is intentional; the numbers are not live.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updatedAt = content.updatedAt
        ? new Date(content.updatedAt).toLocaleString()
        : "never (showing the original content)"

    return (
        <>
            <PageHeader
                title="Welcome back"
                description={`You are editing ${content.site?.companyName}. Content last saved: ${updatedAt}.`}
                previewPath="/"
            />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat
                    label="Page views"
                    value={stats?.totals.pageViews ?? "—"}
                    sub={`${stats?.totals.pageViewsLast7Days ?? 0} in the last 7 days`}
                />
                <Stat label="Contact messages" value={stats?.totals.contacts ?? "—"} sub="From both forms" />
                <Stat label="Images uploaded" value={stats?.totals.mediaFiles ?? "—"} sub="In the media library" />
                <Stat label="Open positions" value={stats?.totals.jobs ?? "—"} sub="Shown on /grow-with" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="font-header text-xl font-semibold text-slate-900">Visits this week</h2>
                    <p className="mb-5 mt-1 font-inter text-sm text-slate-500">
                        Every page a visitor opens is logged, including navigation inside the site.
                    </p>
                    {stats ? <DailyChart daily={stats.daily} /> : (
                        <p className="font-inter text-sm text-slate-400">Loading…</p>
                    )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="font-header text-xl font-semibold text-slate-900">Most visited</h2>
                    <p className="mb-4 mt-1 font-inter text-sm text-slate-500">All time.</p>
                    {stats?.topPaths.length ? (
                        <ol className="flex flex-col gap-2">
                            {stats.topPaths.map((entry) => (
                                <li key={entry.path} className="flex items-center gap-3">
                                    <span className="min-w-0 flex-1 truncate font-inter text-sm text-slate-600">
                                        {entry.path}
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-inter text-xs font-semibold text-slate-500">
                                        {entry.count}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="font-inter text-sm text-slate-400">No visits recorded yet.</p>
                    )}
                </section>
            </div>

            <section className="mt-6">
                <h2 className="mb-4 font-header text-xl font-semibold text-slate-900">Jump to</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {SHORTCUTS.map((shortcut) => (
                        <Link
                            key={shortcut.to}
                            to={shortcut.to}
                            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-primary"
                        >
                            <p className="font-inter text-sm font-semibold text-slate-800 group-hover:text-primary">
                                {shortcut.label}
                            </p>
                            <p className="mt-0.5 font-inter text-xs text-slate-400">{shortcut.hint}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {stats?.recentContacts?.length ? (
                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <header className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="font-header text-xl font-semibold text-slate-900">Latest messages</h2>
                        <Link className="font-inter text-sm font-semibold text-primary" to="/admin/inbox">
                            Open inbox →
                        </Link>
                    </header>
                    <ul className="flex flex-col divide-y divide-slate-100">
                        {stats.recentContacts.map((contact) => (
                            <li key={contact.id} className="flex flex-wrap gap-x-3 gap-y-1 py-3">
                                <span className="font-inter text-sm font-semibold text-slate-800">{contact.name}</span>
                                <span className="font-inter text-sm text-slate-400">{contact.email}</span>
                                <span className="w-full truncate font-inter text-sm text-slate-500">
                                    {contact.message}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </>
    )
}

export default Dashboard
