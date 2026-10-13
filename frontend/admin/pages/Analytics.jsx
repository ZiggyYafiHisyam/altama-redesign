import { useEffect, useMemo, useState } from "react"
import { clearPageViews, fetchPageViews } from "../../lib/api"
import { useToast } from "../lib/toast"
import { PageHeader } from "../components/Page"

// Page-view log. Deliberately plain: it is a log of what the site recorded, not a
// product analytics suite, and saying so is more useful than pretending otherwise.
const Analytics = () => {
    const toast = useToast()
    const [views, setViews] = useState([])
    const [isLoading, setLoading] = useState(true)

    // A promise chain that does not raise the loading flag itself: a setState
    // reached synchronously from the mount effect would cost an extra render before
    // the fetch even starts. The Refresh button raises it explicitly.
    const load = () =>
        fetchPageViews()
            .then((body) => setViews(body.data))
            .catch((error) => toast.error(error.message))
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { byPath, byReferrer, recent } = useMemo(() => {
        const paths = new Map()
        const referrers = new Map()

        for (const view of views) {
            paths.set(view.path, (paths.get(view.path) ?? 0) + 1)
            const referrer = view.referrer ? new URL(view.referrer, "http://x").host || view.referrer : "direct"
            referrers.set(referrer, (referrers.get(referrer) ?? 0) + 1)
        }

        const sort = (map) =>
            [...map.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count)

        return {
            byPath: sort(paths),
            byReferrer: sort(referrers),
            recent: [...views].reverse().slice(0, 60),
        }
    }, [views])

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

    const peak = Math.max(1, ...byPath.map((entry) => entry.count))

    return (
        <>
            <PageHeader
                title="Analytics"
                description="Every page a visitor opens is logged, including navigation within the site. Admin pages are not counted."
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
                    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 font-header text-xl font-semibold text-slate-900">
                                Views by page
                            </h2>
                            {byPath.length === 0 ? (
                                <p className="font-inter text-sm text-slate-400">Nothing recorded yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {byPath.map((entry) => (
                                        <li key={entry.key}>
                                            <div className="mb-1 flex items-baseline justify-between gap-3">
                                                <span className="min-w-0 truncate font-inter text-sm text-slate-700">
                                                    {entry.key}
                                                </span>
                                                <span className="font-inter text-sm font-semibold text-slate-500">
                                                    {entry.count}
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-[#353185] to-[#605BC3]"
                                                    style={{ width: `${(entry.count / peak) * 100}%` }}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-1 font-header text-xl font-semibold text-slate-900">
                                Where visitors came from
                            </h2>
                            <p className="mb-4 font-inter text-sm text-slate-500">
                                “direct” means no referrer was sent.
                            </p>
                            {byReferrer.length === 0 ? (
                                <p className="font-inter text-sm text-slate-400">Nothing recorded yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {byReferrer.map((entry) => (
                                        <li key={entry.key} className="flex items-center gap-3">
                                            <span className="min-w-0 flex-1 truncate font-inter text-sm text-slate-600">
                                                {entry.key}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-inter text-xs font-semibold text-slate-500">
                                                {entry.count}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-1 font-header text-xl font-semibold text-slate-900">Recent visits</h2>
                        <p className="mb-4 font-inter text-sm text-slate-500">
                            The last {recent.length} of {views.length} recorded.
                        </p>
                        {recent.length === 0 ? (
                            <p className="font-inter text-sm text-slate-400">Nothing recorded yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-120 text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {["When", "Page", "Referrer"].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="pb-2 font-inter text-[11px] font-bold uppercase tracking-wide text-slate-400"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent.map((view) => (
                                            <tr key={view.id} className="border-b border-slate-50">
                                                <td className="py-2 pr-4 font-inter text-xs text-slate-400">
                                                    {new Date(view.openedAt).toLocaleString()}
                                                </td>
                                                <td className="py-2 pr-4 font-inter text-sm text-slate-700">
                                                    {view.path}
                                                </td>
                                                <td className="max-w-80 truncate py-2 font-inter text-xs text-slate-400">
                                                    {view.referrer ?? "direct"}
                                                </td>
                                            </tr>
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

export default Analytics
