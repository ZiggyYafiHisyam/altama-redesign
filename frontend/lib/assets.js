// Turns the image strings stored in the content document into URLs the browser
// can load. See shared/defaultContent.js for the three forms.
//
// Bundled assets are addressed as "asset:<path under frontend/assets>", e.g.
// "asset:hero/hero.png". They cannot be stored as plain "/assets/..." URLs
// because Vite fingerprints these files at build time, so the final URL is only
// known to the bundler -- which is what this glob asks it for.

const modules = import.meta.glob("../assets/**/*", {
    eager: true,
    query: "?url",
    import: "default",
})

export const ASSET_PREFIX = "asset:"

// "../assets/hero/hero.png" -> "hero/hero.png"
const assetUrls = Object.fromEntries(
    Object.entries(modules).map(([path, url]) => [path.replace("../assets/", ""), url]),
)

// Every bundled image, for the admin's "shipped assets" picker.
export const bundledAssets = Object.keys(assetUrls)
    .sort()
    .map((key) => ({
        key: `${ASSET_PREFIX}${key}`,
        name: key.split("/").pop(),
        folder: key.includes("/") ? key.slice(0, key.lastIndexOf("/")) : "",
        url: assetUrls[key],
    }))

// `value` is whatever the content document holds. Returns "" for anything empty
// or unresolvable, which every component treats as "render the placeholder".
export function resolveImage(value) {
    if (typeof value !== "string" || value === "") return ""

    if (value.startsWith(ASSET_PREFIX)) {
        const key = value.slice(ASSET_PREFIX.length)
        if (!assetUrls[key]) {
            // A bundled file was renamed or removed but the content still points
            // at it. Warn rather than throw: one stale image must not take the
            // page down.
            if (import.meta.env.DEV) console.warn(`[assets] unknown bundled asset: ${key}`)
            return ""
        }
        return assetUrls[key]
    }

    // "/api/media/<id>" (uploaded), or any absolute/external URL, as-is.
    return value
}

// Where an image came from, for the admin to label a field's current value.
export function describeImage(value) {
    if (typeof value !== "string" || value === "") return { kind: "empty", label: "No image" }
    if (value.startsWith(ASSET_PREFIX)) {
        return { kind: "bundled", label: value.slice(ASSET_PREFIX.length) }
    }
    if (value.startsWith("/api/media/")) return { kind: "uploaded", label: "Uploaded image" }
    return { kind: "external", label: value }
}
