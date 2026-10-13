import { useEffect, useMemo, useRef, useState } from "react"
import { bundledAssets, describeImage, resolveImage } from "../../lib/assets"
import { deleteMedia, fetchMedia, uploadMedia } from "../../lib/api"
import { useToast } from "../lib/toast"
import { FieldShell, IconButton } from "./Fields"

// Reads a picked file into the base64 data URL the API expects.
function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
        reader.readAsDataURL(file)
    })
}

const MAX_BYTES = 3 * 1024 * 1024

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// Every image on the site is set through this one control, so there is a single
// place that knows how to upload, pick from the library, reuse a shipped asset,
// or point at an external URL.
export default function ImageField({ label, hint, value, onChange, aspect = "aspect-video" }) {
    const [isPickerOpen, setPickerOpen] = useState(false)
    const toast = useToast()
    const fileInputRef = useRef(null)
    const [isUploading, setUploading] = useState(false)

    const preview = resolveImage(value)
    const description = describeImage(value)

    const upload = async (file) => {
        if (!file) return
        if (file.size > MAX_BYTES) {
            toast.error(`${file.name} is ${formatBytes(file.size)}. The limit is 3 MB.`)
            return
        }

        setUploading(true)
        try {
            const dataUrl = await readAsDataUrl(file)
            const body = await uploadMedia(file.name, dataUrl)
            onChange(body.data.url)
            toast.success(`Uploaded ${body.data.name}.`)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setUploading(false)
            // Clear the input so picking the same file again still fires onChange.
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    return (
        <FieldShell label={label} hint={hint}>
            <div className="flex items-start gap-4">
                <div
                    className={`${aspect} w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-size-[16px_16px]`}
                >
                    {preview ? (
                        <img src={preview} alt="" className="h-full w-full object-contain" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center font-inter text-[11px] text-slate-400">
                            No image
                        </div>
                    )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <p className="truncate font-inter text-xs text-slate-500" title={description.label}>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold uppercase tracking-wide text-slate-500">
                            {description.kind}
                        </span>{" "}
                        {description.label}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="rounded-xl bg-primary px-3 py-2 font-inter text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 px-3 py-2 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                            onClick={() => setPickerOpen(true)}
                        >
                            Choose existing
                        </button>
                        {value && (
                            <IconButton label="Clear image" tone="danger" onClick={() => onChange("")}>
                                ×
                            </IconButton>
                        )}
                    </div>

                    <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-inter text-xs text-slate-700 outline-none focus:border-primary"
                        type="text"
                        value={value ?? ""}
                        placeholder="…or paste an image URL"
                        onChange={(event) => onChange(event.target.value)}
                    />

                    <input
                        ref={fileInputRef}
                        className="hidden"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                        onChange={(event) => upload(event.target.files?.[0])}
                    />
                </div>
            </div>

            {isPickerOpen && (
                <ImagePicker
                    current={value}
                    onClose={() => setPickerOpen(false)}
                    onPick={(next) => {
                        onChange(next)
                        setPickerOpen(false)
                    }}
                />
            )}
        </FieldShell>
    )
}

// The browse-and-pick dialog: everything uploaded, plus every image that ships
// with the site. Doubles as the media library's own grid (see pages/Media.jsx),
// which is why uploading and deleting live here too.
export function ImagePicker({ current, onPick, onClose, manageOnly = false }) {
    const [tab, setTab] = useState("uploads")
    const [uploads, setUploads] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [query, setQuery] = useState("")
    const toast = useToast()
    const fileInputRef = useRef(null)

    // A promise chain, so every setState lands in a callback rather than being
    // reached synchronously from the mount effect below; `isLoading` starts true.
    const load = () =>
        fetchMedia()
            .then((body) => setUploads(body.data))
            .catch((error) => toast.error(error.message))
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [onClose])

    const items = useMemo(() => {
        const source =
            tab === "uploads"
                ? uploads.map((item) => ({
                    key: item.url,
                    name: item.name,
                    url: item.url,
                    id: item.id,
                    meta: formatBytes(item.size),
                }))
                : bundledAssets.map((asset) => ({
                    key: asset.key,
                    name: asset.name,
                    url: asset.url,
                    meta: asset.folder,
                }))

        const term = query.trim().toLowerCase()
        if (!term) return source
        return source.filter((item) => `${item.name} ${item.meta}`.toLowerCase().includes(term))
    }, [tab, uploads, query])

    const handleUpload = async (files) => {
        for (const file of files) {
            if (file.size > MAX_BYTES) {
                toast.error(`${file.name} is ${formatBytes(file.size)}. The limit is 3 MB.`)
                continue
            }
            try {
                const dataUrl = await readAsDataUrl(file)
                const body = await uploadMedia(file.name, dataUrl)
                toast.success(`Uploaded ${body.data.name}.`)
            } catch (error) {
                toast.error(error.message)
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = ""
        load()
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}" from the library? Pages still using it will lose the image.`)) {
            return
        }
        try {
            await deleteMedia(id)
            toast.success(`Deleted ${name}.`)
            load()
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Choose an image"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div className="flex h-[min(44rem,92vh)] w-[min(60rem,100%)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <header className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <h2 className="font-header text-xl font-semibold text-slate-900">
                        {manageOnly ? "Media library" : "Choose an image"}
                    </h2>
                    <div className="flex rounded-xl bg-slate-100 p-1">
                        {[
                            { key: "uploads", label: "Uploaded" },
                            { key: "bundled", label: "Shipped with the site" },
                        ].map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                className={`rounded-lg px-3 py-1.5 font-inter text-xs font-semibold transition-colors ${
                                    tab === option.key ? "bg-white text-primary shadow-sm" : "text-slate-500"
                                }`}
                                onClick={() => setTab(option.key)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <input
                        className="ml-auto w-48 rounded-xl border border-slate-200 px-3 py-2 font-inter text-xs outline-none focus:border-primary"
                        type="search"
                        placeholder="Search…"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                        type="button"
                        className="rounded-xl bg-primary px-3 py-2 font-inter text-xs font-semibold text-white"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        className="text-2xl leading-none text-slate-400 transition-colors hover:text-slate-700"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <input
                        ref={fileInputRef}
                        className="hidden"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                        onChange={(event) => handleUpload([...(event.target.files ?? [])])}
                    />
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {isLoading && tab === "uploads" ? (
                        <p className="font-inter text-sm text-slate-400">Loading…</p>
                    ) : items.length === 0 ? (
                        <p className="font-inter text-sm text-slate-400">
                            {tab === "uploads"
                                ? "Nothing uploaded yet. Use Upload to add your first image."
                                : "No shipped asset matches that search."}
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {items.map((item) => {
                                const isCurrent = current === item.key

                                return (
                                    <figure
                                        key={item.key}
                                        className={`group relative overflow-hidden rounded-2xl border bg-white transition-colors ${
                                            isCurrent ? "border-primary ring-2 ring-primary/30" : "border-slate-200"
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="block w-full"
                                            onClick={() => (manageOnly ? undefined : onPick(item.key))}
                                            disabled={manageOnly}
                                        >
                                            <span className="block aspect-square bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-size-[16px_16px]">
                                                <img
                                                    src={item.url}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-contain"
                                                />
                                            </span>
                                        </button>
                                        <figcaption className="flex items-center gap-1 px-2.5 py-2">
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-inter text-xs font-semibold text-slate-700" title={item.name}>
                                                    {item.name}
                                                </span>
                                                <span className="block truncate font-inter text-[11px] text-slate-400">
                                                    {item.meta}
                                                </span>
                                            </span>
                                            {item.id && (
                                                <IconButton
                                                    label="Delete from library"
                                                    tone="danger"
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                >
                                                    ×
                                                </IconButton>
                                            )}
                                        </figcaption>
                                    </figure>
                                )
                            })}
                        </div>
                    )}
                </div>

                <footer className="border-t border-slate-100 px-6 py-3">
                    <p className="font-inter text-xs text-slate-400">
                        Images up to 3 MB. Shipped assets cannot be deleted -- they are part of the build.
                    </p>
                </footer>
            </div>
        </div>
    )
}
