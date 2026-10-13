import { useEffect, useRef, useState } from "react"
import { deleteMedia, fetchMedia, renameMedia, uploadMedia } from "../../lib/api"
import { bundledAssets } from "../../lib/assets"
import { useToast } from "../lib/toast"
import { IconButton } from "../components/Fields"
import { PageHeader } from "../components/Page"

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

// The library in full: upload, rename, delete, and browse what ships with the
// build. Image fields elsewhere open a compact version of the same grid.
const Media = () => {
    const toast = useToast()
    const [uploads, setUploads] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [isDragging, setDragging] = useState(false)
    const [tab, setTab] = useState("uploads")
    const fileInputRef = useRef(null)

    // A promise chain, not async/await, and it does not raise the loading flag
    // itself: this is called straight from an effect on mount, and every setState
    // has to land in a callback after the request resolves rather than
    // synchronously inside the effect. `isLoading` starts true instead.
    const load = () =>
        fetchMedia()
            .then((body) => setUploads(body.data))
            .catch((error) => toast.error(error.message))
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
        // Loading once on mount; the library is re-read after every upload or delete.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFiles = async (files) => {
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not an image.`)
                continue
            }
            if (file.size > MAX_BYTES) {
                toast.error(`${file.name} is ${formatBytes(file.size)}. The limit is 3 MB.`)
                continue
            }
            try {
                const dataUrl = await readAsDataUrl(file)
                await uploadMedia(file.name, dataUrl)
                toast.success(`Uploaded ${file.name}.`)
            } catch (error) {
                toast.error(error.message)
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = ""
        load()
    }

    const handleRename = async (item) => {
        const name = window.prompt("New name for this image:", item.name)
        if (name === null || name.trim() === "" || name === item.name) return
        try {
            await renameMedia(item.id, name.trim())
            toast.success("Renamed.")
            load()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (item) => {
        if (
            !window.confirm(
                `Delete "${item.name}"? Any page still pointing at it will show no image.`,
            )
        ) {
            return
        }
        try {
            await deleteMedia(item.id)
            toast.success("Deleted.")
            load()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const copyUrl = async (url) => {
        try {
            await navigator.clipboard.writeText(url)
            toast.success("Path copied. Paste it into any image field.")
        } catch {
            toast.error("Could not copy. The path is " + url)
        }
    }

    const totalBytes = uploads.reduce((sum, item) => sum + item.size, 0)

    return (
        <>
            <PageHeader
                title="Media library"
                description="Images you upload here can be used in any image field on the site."
            >
                <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload images
                </button>
            </PageHeader>

            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
                onChange={(event) => handleFiles([...(event.target.files ?? [])])}
            />

            <div
                className={`mb-6 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                }`}
                onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault()
                    setDragging(false)
                    handleFiles([...(event.dataTransfer.files ?? [])])
                }}
            >
                <p className="font-inter text-sm font-semibold text-slate-700">
                    Drop images here to upload
                </p>
                <p className="mt-1 font-inter text-xs text-slate-400">
                    PNG, JPEG, WebP, GIF, SVG or AVIF, up to 3 MB each.
                </p>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="flex rounded-xl bg-slate-100 p-1">
                    {[
                        { key: "uploads", label: `Uploaded (${uploads.length})` },
                        { key: "bundled", label: `Shipped with the site (${bundledAssets.length})` },
                    ].map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            className={`rounded-lg px-3.5 py-2 font-inter text-xs font-semibold transition-colors ${
                                tab === option.key ? "bg-white text-primary shadow-sm" : "text-slate-500"
                            }`}
                            onClick={() => setTab(option.key)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                {tab === "uploads" && uploads.length > 0 && (
                    <span className="font-inter text-xs text-slate-400">
                        {formatBytes(totalBytes)} total
                    </span>
                )}
            </div>

            {tab === "uploads" ? (
                isLoading ? (
                    <p className="font-inter text-sm text-slate-400">Loading…</p>
                ) : uploads.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center font-inter text-sm text-slate-400">
                        Nothing uploaded yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {uploads.map((item) => (
                            <figure
                                key={item.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="aspect-square bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-size-[16px_16px]">
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        loading="lazy"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <figcaption className="p-3">
                                    <p
                                        className="truncate font-inter text-sm font-semibold text-slate-800"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </p>
                                    <p className="mt-0.5 font-inter text-xs text-slate-400">
                                        {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="mt-3 flex gap-1.5">
                                        <button
                                            type="button"
                                            className="flex-1 rounded-lg border border-slate-200 px-2 py-1.5 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                                            onClick={() => copyUrl(item.url)}
                                        >
                                            Copy path
                                        </button>
                                        <IconButton label="Rename" onClick={() => handleRename(item)}>
                                            ✎
                                        </IconButton>
                                        <IconButton label="Delete" tone="danger" onClick={() => handleDelete(item)}>
                                            ×
                                        </IconButton>
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                )
            ) : (
                <>
                    <p className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-inter text-sm text-slate-500">
                        These images are part of the build and cannot be deleted or renamed here. They are
                        the defaults every page starts from, and they stay available even if the uploads are
                        cleared.
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {bundledAssets.map((asset) => (
                            <figure
                                key={asset.key}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="aspect-square bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-size-[16px_16px]">
                                    <img
                                        src={asset.url}
                                        alt={asset.name}
                                        loading="lazy"
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <figcaption className="p-3">
                                    <p
                                        className="truncate font-inter text-sm font-semibold text-slate-800"
                                        title={asset.name}
                                    >
                                        {asset.name}
                                    </p>
                                    <p className="truncate font-inter text-xs text-slate-400">{asset.folder}</p>
                                    <button
                                        type="button"
                                        className="mt-3 w-full rounded-lg border border-slate-200 px-2 py-1.5 font-inter text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                                        onClick={() => copyUrl(asset.key)}
                                    >
                                        Copy reference
                                    </button>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default Media
