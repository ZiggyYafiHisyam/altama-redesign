import { uploadMedia } from "../../lib/api"

// One place that knows how a picked file becomes an image the content document
// can point at. Shared by the image fields and the gallery's tiles, so the size
// limit and the error wording cannot drift apart.

export const MAX_BYTES = 3 * 1024 * 1024

export function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// Reads a picked file into the base64 data URL the API expects.
export function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
        reader.readAsDataURL(file)
    })
}

// Uploads one file and returns its "/api/media/<id>" URL, or null if it was
// rejected or failed -- having reported why through the toast. Callers only have
// to decide what to do with a URL, which keeps the upload button in every
// context down to a few lines.
export async function uploadImageFile(file, toast) {
    if (!file) return null
    if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is ${formatBytes(file.size)}. The limit is 3 MB.`)
        return null
    }

    try {
        const dataUrl = await readAsDataUrl(file)
        const body = await uploadMedia(file.name, dataUrl)
        toast.success(`Uploaded ${body.data.name}.`)
        return body.data.url
    } catch (error) {
        toast.error(error.message)
        return null
    }
}

// The file types the <input type="file"> controls accept, kept identical
// everywhere a file can be picked.
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
