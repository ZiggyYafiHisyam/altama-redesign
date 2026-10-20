import { useState } from "react"
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom"
import { resolveImage } from "../lib/assets"
import { useContent } from "../lib/content"
import { useAdminAuth } from "./lib/auth"
import { IMAGE_GROUPS } from "./lib/imageFields"
import ToastProvider from "./components/ToastProvider"

// Every page of the site whose images can be replaced, as the "Site images" menu
// lists them. The fixed slots come straight from the image registry, so a new
// group in lib/imageFields.js appears here on its own; the gallery is its own
// editor because its images are a list you add to and delete from.
const IMAGE_PAGES = [
    ...IMAGE_GROUPS.map((group) => ({ to: `/admin/images/${group.id}`, label: group.title })),
    { to: "/admin/gallery", label: "Gallery & Instagram" },
]

// The admin edits images, so the sidebar is short: one menu for the images --
// uploading and deleting happen inside the image picker, so the library needs no
// entry of its own -- then the data the site collects, then the whole-document
// operations.
const NAV_GROUPS = [
    {
        title: "Overview",
        links: [{ to: "/admin", label: "Dashboard", icon: "◫", end: true }],
    },
    {
        title: "Images",
        links: [{ label: "Site images", icon: "▣", children: IMAGE_PAGES }],
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
                                        <NavItem
                                            key={link.to ?? link.label}
                                            link={link}
                                            onNavigate={() => setSidebarOpen(false)}
                                        />
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

const itemClass = (isActive) =>
    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
        isActive
            ? "bg-white/15 font-semibold text-white"
            : "text-white/70 hover:bg-white/8 hover:text-white"
    }`

// A sidebar entry: either a plain link, or -- for "Site images" -- a button that
// drops its pages down underneath it. The menu opens itself whenever one of those
// pages is the one on screen, so a reload never hides where you are.
function NavItem({ link, onNavigate }) {
    const location = useLocation()
    const isSectionOpen = (link.children ?? []).some(
        (child) => location.pathname === child.to || location.pathname.startsWith(`${child.to}/`),
    )
    // Open by default whenever one of its pages is on screen; clicking the entry
    // overrides that, so the menu can be collapsed out of the way and reopened.
    const [override, setOverride] = useState(null)
    const isOpen = override ?? isSectionOpen

    if (!link.children) {
        return (
            <li>
                <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={onNavigate}
                    className={({ isActive }) => itemClass(isActive)}
                >
                    <span aria-hidden="true" className="w-4 text-center text-[#F4C41C]">
                        {link.icon}
                    </span>
                    {link.label}
                </NavLink>
            </li>
        )
    }

    return (
        <li>
            <button
                type="button"
                className={`w-full ${itemClass(isSectionOpen)}`}
                aria-expanded={isOpen}
                onClick={() => setOverride(!isOpen)}
            >
                <span aria-hidden="true" className="w-4 text-center text-[#F4C41C]">
                    {link.icon}
                </span>
                {link.label}
                <span
                    aria-hidden="true"
                    className={`ml-auto text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                    ▾
                </span>
            </button>

            {isOpen && (
                <ul className="ml-5 mb-1 mt-0.5 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                    {link.children.map((child) => (
                        <li key={child.to}>
                            <NavLink
                                to={child.to}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    `block rounded-lg px-3 py-1.5 text-[13px] transition-colors ${
                                        isActive
                                            ? "bg-white/15 font-semibold text-white"
                                            : "text-white/60 hover:bg-white/8 hover:text-white"
                                    }`
                                }
                            >
                                {child.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}

export default AdminLayout
