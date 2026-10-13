import { useRef, useState } from "react"
import { replaceContent, resetAllContent } from "../../lib/api"
import { useContent } from "../../lib/content"
import { useAdminAuth } from "../lib/auth"
import { useToast } from "../lib/toast"
import { Card, PageHeader } from "../components/Page"

// Whole-document operations: export a backup, restore one, start over.
const Settings = () => {
    const { content, refresh } = useContent()
    const { user } = useAdminAuth()
    const toast = useToast()
    const fileInputRef = useRef(null)
    const [isBusy, setBusy] = useState(false)

    const download = () => {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `altama-content-${new Date().toISOString().slice(0, 10)}.json`
        link.click()
        URL.revokeObjectURL(url)
        toast.success("Backup downloaded.")
    }

    // Restores with PUT /api/content, which replaces the whole document. Uploaded
    // images are NOT in the file -- they live in the media library -- so a restore
    // onto a server with a different library can leave an image field pointing at
    // an id that no longer exists.
    const restore = async (file) => {
        if (!file) return
        if (
            !window.confirm(
                `Replace all site content with "${file.name}"? Everything currently on the site is overwritten.`,
            )
        ) {
            return
        }

        setBusy(true)
        try {
            const text = await file.text()
            const parsed = JSON.parse(text)

            await replaceContent(parsed)
            await refresh()
            toast.success("Content restored.")
        } catch (error) {
            toast.error(
                error instanceof SyntaxError ? "That file is not valid JSON." : error.message,
            )
        } finally {
            setBusy(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const resetEverything = async () => {
        if (
            !window.confirm(
                "Reset EVERY page back to the original content? Every edit is lost. Uploaded images stay in the media library.",
            )
        ) {
            return
        }
        if (!window.confirm("Really reset everything? This cannot be undone.")) return

        setBusy(true)
        try {
            await resetAllContent()
            await refresh()
            toast.success("All content reset to the original.")
        } catch (error) {
            toast.error(error.message)
        } finally {
            setBusy(false)
        }
    }

    return (
        <>
            <PageHeader
                title="Settings"
                description="Backups, restores and the reset switch. Handle with care — these act on the whole site."
            />

            <div className="flex flex-col gap-6">
                <Card title="Signed in as">
                    <p className="font-inter text-sm text-slate-600">
                        <strong className="text-slate-900">{user?.username}</strong>. Credentials are set on
                        the server through the ADMIN_USERNAME and ADMIN_PASSWORD environment variables, not
                        from here — so changing them is a deployment change, not a content change.
                    </p>
                    <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-inter text-sm text-amber-800">
                        This install still allows the documented default of admin / 123 unless those variables
                        are set. Set them before the site is public.
                    </p>
                </Card>

                <Card
                    title="Backup"
                    description="Downloads the whole content document as JSON. Text, links and image references — not the image files themselves."
                >
                    <button
                        type="button"
                        className="self-start rounded-xl bg-primary px-4 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        onClick={download}
                    >
                        Download backup
                    </button>
                    <p className="font-inter text-xs text-slate-400">
                        Last saved:{" "}
                        {content.updatedAt
                            ? new Date(content.updatedAt).toLocaleString()
                            : "never — the site is showing the original content"}
                    </p>
                </Card>

                <Card
                    title="Restore"
                    description="Replaces everything with a backup file. Any field the file is missing falls back to the original content."
                >
                    <button
                        type="button"
                        className="self-start rounded-xl border border-slate-200 px-4 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isBusy}
                    >
                        Choose a backup file…
                    </button>
                    <input
                        ref={fileInputRef}
                        className="hidden"
                        type="file"
                        accept="application/json,.json"
                        onChange={(event) => restore(event.target.files?.[0])}
                    />
                </Card>

                <Card
                    title="Reset everything"
                    description="Puts every page back to the content the site shipped with."
                    className="border-rose-200"
                >
                    <button
                        type="button"
                        className="self-start rounded-xl bg-rose-600 px-4 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        onClick={resetEverything}
                        disabled={isBusy}
                    >
                        Reset all content
                    </button>
                </Card>

                <Card title="Where this is stored">
                    <p className="font-inter text-sm leading-relaxed text-slate-600">
                        Content, uploaded images, contact messages and the page-view log are JSON files on the
                        server. On Vercel they are written to <code className="rounded bg-slate-100 px-1">/tmp</code>,
                        which is wiped whenever the serverless instance is recycled — so treat anything saved
                        there as temporary and keep a backup. Set <code className="rounded bg-slate-100 px-1">DATA_DIR</code>{" "}
                        to a persistent volume for a permanent store.
                    </p>
                </Card>
            </div>
        </>
    )
}

export default Settings
