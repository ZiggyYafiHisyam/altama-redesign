import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { resolveImage } from "../../lib/assets"
import { useContent } from "../../lib/content"
import { useAdminAuth } from "../lib/auth"

// The one page of the admin that is reachable without a session. Styled from the
// same kit as the site's gradient sections -- the purple gradient, the grid
// texture and Alva -- so it reads as part of Altama rather than a generic login.
const Login = () => {
    const { isSignedIn, login } = useAdminAuth()
    const { content } = useContent()
    const navigate = useNavigate()
    const location = useLocation()

    // Prefilled with the project's documented credentials, so signing in locally is
    // a single click and there is nothing to mistype. Clear them (and set
    // ADMIN_USERNAME / ADMIN_PASSWORD on the server) before this site is public.
    const [username, setUsername] = useState("admin")
    const [password, setPassword] = useState("123")
    const [error, setError] = useState("")
    const [isSubmitting, setSubmitting] = useState(false)

    // Already signed in: go straight through rather than asking again.
    if (isSignedIn) return <Navigate to={location.state?.from ?? "/admin"} replace />

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setSubmitting(true)
        try {
            await login(username, password)
            navigate(location.state?.from ?? "/admin", { replace: true })
        } catch (loginError) {
            setError(loginError.message)
        } finally {
            setSubmitting(false)
        }
    }

    const mascot = resolveImage(content.site?.mascot)

    return (
        <main
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 font-inter"
            style={{ background: "linear-gradient(160deg, #353185 0%, #211e5c 60%, #15133c 100%)" }}
        >
            <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
                <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[88px_88px]" />
            </div>
            {/* Two soft blooms, the same trick the Terima Kasih page uses. */}
            <div
                className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#605BC3]/40 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#F4C41C]/15 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
                <div className="hidden text-white lg:block">
                    <span className="inline-flex rounded-full border border-white/30 px-4 py-1.5 text-sm">
                        {content.site?.hashtag}
                    </span>
                    <h1 className="mt-7 font-header text-6xl font-semibold leading-[0.95] tracking-[-0.03em]">
                        Content
                        <br />
                        <span className="rounded-md bg-[#F4C41C] px-2 text-[#15133c]">Studio</span>
                    </h1>
                    <p className="mt-6 max-w-md text-lg leading-snug text-white/70">
                        Every headline, photo and job opening on {content.site?.companyName} is edited
                        from here -- and goes live the moment you save.
                    </p>
                    {mascot && (
                        <img
                            className="alva-breathe mt-10 h-56 w-auto object-contain"
                            src={mascot}
                            alt={content.site?.mascotAlt ?? ""}
                        />
                    )}
                </div>

                <div className="rounded-[28px] border border-white/15 bg-white p-7 shadow-2xl sm:p-9">
                    <div className="mb-7">
                        <h2 className="font-header text-3xl font-semibold text-slate-900">Sign in</h2>
                        <p className="mt-1.5 text-sm text-slate-500">
                            Administrator access to the {content.site?.shortName ?? "Altama"} website.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Username
                            </span>
                            <input
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                                type="text"
                                name="username"
                                autoComplete="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </label>

                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Password
                            </span>
                            <input
                                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </label>

                        {error && (
                            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm leading-relaxed text-rose-700">
                                {error}
                            </p>
                        )}

                        <button
                            className="mt-1 h-12 rounded-xl bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            type="submit"
                            disabled={isSubmitting}
                            autoFocus
                        >
                            {isSubmitting ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-6 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
                        Default credentials are <strong className="text-slate-700">admin</strong> /{" "}
                        <strong className="text-slate-700">123</strong>. Change them by setting
                        ADMIN_USERNAME and ADMIN_PASSWORD on the server before this goes public.
                    </p>

                    <Link
                        className="mt-5 block text-center text-xs font-semibold text-slate-400 transition-colors hover:text-primary"
                        to="/"
                    >
                        ← Back to the website
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default Login
