import { useState } from "react"
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom"
import { resolveImage } from "../lib/assets"
import { useContent } from "../lib/content"
import { useAdminAuth } from "./lib/auth"
import ToastProvider from "./components/ToastProvider"

// Grouped so the sidebar mirrors how someone thinks about the site -- "the pages"
// first, then the lists that feed several pages, then the data coming in.
const NAV_GROUPS = [
    {
        title: "Overview",
        links: [{ to: "/admin", label: "Dashboard", icon: "◫", end: true }],
    },
    {
        title: "Pages",
        links: [
            { to: "/admin/home", label: "Home", icon: "⌂" },
            { to: "/admin/visi-misi", label: "Vision & Mission", icon: "◎" },
            { to: "/admin/awards", label: "Awards", icon: "✦" },
            { to: "/admin/board", label: "Board of Directors", icon: "☖" },
            { to: "/admin/life-at", label: "Life at Altama", icon: "♥" },
            { to: "/admin/careers", label: "Careers", icon: "⚒" },
            { to: "/admin/gallery", label: "Gallery", icon: "▦" },
            { to: "/admin/news", label: "News", icon: "✎" },
            { to: "/admin/brands", label: "Brands", icon: "◈" },
            { to: "/admin/contact", label: "Contact & Thanks", icon: "✉" },
        ],
    },
    {
        title: "Site-wide",
        links: [
            { to: "/admin/identity", label: "Identity & contact", icon: "❖" },
            { to: "/admin/navigation", label: "Menus & footer", icon: "☰" },
            { to: "/admin/media", label: "Media library", icon: "▤" },
        ],
    },
    {
        title: "Incoming",
        links: [
            { to: "/admin/inbox", label: "Inbox", icon: "✦" },
            { to: "/admin/analytics", label: "Analytics", icon: "◔" },
        ],
    },
    {
        title: "Danger zone",
        links: [{ to: "/admin/settings", label: "Settings", icon: "⚙" }],
    },
]

const AdminLayout = () => {
    const { isSignedIn, status, user, logout } = useAdminAuth()
    const { content, isLoading, error } = useContent()
    const location = useLocation()
    const [isSidebarOpen, setSidebarOpen] = useState(false)

    // Still verifying a restored token: show nothing rather than flashing the
    // login screen at someone who is signed in.
    if (status === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="font-inter text-sm text-slate-400">Checking your session…</p>
            </div>
        )
    }

    if (!isSignedIn) {
        // `from` lets the login screen send you back where you were heading.
        return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    }

    return (
        <ToastProvider>
            <div className="admin-root flex min-h-screen bg-slate-50 font-inter text-slate-900">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto bg-linear-to-b from-[#2a2770] to-[#17153f] text-white transition-transform lg:static lg:translate-x-0 ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="flex items-center gap-3 px-6 pb-6 pt-7">
                        {resolveImage(content.site?.navLogo) && (
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 p-1.5">
                                <img
                                    src={resolveImage(content.site.navLogo)}
                                    alt=""
                                    className="h-full w-full object-contain"
                                />
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="truncate font-header text-lg font-semibold leading-tight">
                                {content.site?.shortName ?? "Altama"} CMS
                            </p>
                            <p className="truncate text-xs text-white/50">{user?.username}</p>
                        </div>
                    </div>

                    <nav className="flex-1 px-3 pb-4" aria-label="Admin sections">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.title} className="mb-5">
                                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                                    {group.title}
                                </p>
                                <ul className="flex flex-col gap-0.5">
                                    {group.links.map((link) => (
                                        <li key={link.to}>
                                            <NavLink
                                                to={link.to}
                                                end={link.end}
                                                onClick={() => setSidebarOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                                                        isActive
                                                            ? "bg-white/15 font-semibold text-white"
                                                            : "text-white/70 hover:bg-white/8 hover:text-white"
                                                    }`
                                                }
                                            >
                                                <span aria-hidden="true" className="w-4 text-center text-[#F4C41C]">
                                                    {link.icon}
                                                </span>
                                                {link.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    <div className="border-t border-white/10 px-5 py-4">
                        <Link
                            className="mb-2 block rounded-xl bg-white/10 px-3 py-2 text-center text-sm font-semibold transition-colors hover:bg-white/20"
                            to="/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Open the site ↗
                        </Link>
                        <button
                            type="button"
                            className="w-full rounded-xl px-3 py-2 text-sm text-white/60 transition-colors hover:text-white"
                            onClick={logout}
                        >
                            Sign out
                        </button>
                    </div>
                </aside>

                {isSidebarOpen && (
                    <button
                        type="button"
                        className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
                        aria-label="Close menu"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
                        <button
                            type="button"
                            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-primary"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <span className="h-0.5 w-5 bg-current" />
                            <span className="h-0.5 w-5 bg-current" />
                            <span className="h-0.5 w-5 bg-current" />
                        </button>
                        <p className="font-header text-lg font-semibold">
                            {content.site?.shortName ?? "Altama"} CMS
                        </p>
                    </div>

                    {error && (
                        <p className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-800">
                            Could not reach the API ({error}). You are seeing the built-in content, and
                            saving will fail until the backend is back.
                        </p>
                    )}

                    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
                        {isLoading && !content.updatedAt ? (
                            <p className="font-inter text-sm text-slate-400">Loading content…</p>
                        ) : (
                            <Outlet />
                        )}
                    </main>
                </div>
            </div>
        </ToastProvider>
    )
}

export default AdminLayout
