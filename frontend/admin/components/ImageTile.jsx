import { useRef, useState } from "react"
import { resolveImage } from "../../lib/assets"
import { useToast } from "../lib/toast"
import { IMAGE_ACCEPT, uploadImageFile } from "../lib/upload"
import { ImagePicker } from "./ImageField"

// An image edited where it sits: the tile shows the picture at the shape the site
// renders it, and the controls sit on top of it. It is what the gallery grids are
// made of, so swapping a photo is one click on the photo itself rather than a row
// to expand and a field to find.
//
// Drop a file anywhere on the tile and it uploads, which is the fastest path when
// you are replacing several at once.
export default function ImageTile({
    value,
    onChange,
    label,
    className = "",
    style,
    children,
    emptyHint = "Empty",
}) {
    const toast = useToast()
    const fileInputRef = useRef(null)
    const [isPickerOpen, setPickerOpen] = useState(false)
    const [isUploading, setUploading] = useState(false)
    const [isDraggedOver, setDraggedOver] = useState(false)

    const preview = resolveImage(value)

    const upload = async (file) => {
        if (!file) return
        setUploading(true)
        const url = await uploadImageFile(file, toast)
        if (url) onChange(url)
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl border bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#ffffff_0%_50%)] bg-size-[16px_16px] transition-colors ${
                isDraggedOver ? "border-primary ring-2 ring-primary/30" : "border-slate-200"
            } ${className}`}
            style={style}
            onDragOver={(event) => {
                event.preventDefault()
                setDraggedOver(true)
            }}
            onDragLeave={() => setDraggedOver(false)}
            onDrop={(event) => {
                event.preventDefault()
                setDraggedOver(false)
                upload(event.dataTransfer.files?.[0])
            }}
        >
            {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
                <div className="flex h-full w-full items-center justify-center px-2 text-center font-inter text-xs text-slate-400">
                    {emptyHint}
                </div>
            )}

            {label && (
                <span className="pointer-events-none absolute left-2 top-2 rounded-lg bg-slate-900/70 px-2 py-0.5 font-inter text-[11px] font-semibold text-white">
                    {label}
                </span>
            )}

            {/* Always visible on touch, where there is no hover to reveal it. */}
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-1.5 bg-linear-to-t from-slate-900/85 to-transparent p-2 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                <TileButton onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? "Uploading…" : value ? "Replace" : "Upload"}
                </TileButton>
                <TileButton onClick={() => setPickerOpen(true)}>Library</TileButton>
                {value && <TileButton onClick={() => onChange("")}>Clear</TileButton>}
                {children}
            </div>

            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept={IMAGE_ACCEPT}
                onChange={(event) => upload(event.target.files?.[0])}
            />

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
        </div>
    )
}

export function TileButton({ onClick, disabled, title, children }) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className="rounded-lg bg-white/90 px-2 py-1 font-inter text-[11px] font-semibold text-slate-700 transition-colors hover:bg-white disabled:opacity-60"
        >
            {children}
        </button>
    )
}
