// Empty string means requests go to the same origin the frontend is served from,
// and the Vite dev server proxy (see vite.config.js) forwards /api to the backend.
// Set VITE_API_BASE_URL in a .env file to point at a different backend (e.g. in production).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

// Where the admin session token lives. sessionStorage, not localStorage, so
// closing the tab ends the session.
const TOKEN_KEY = "altama.admin.token"

export function getAdminToken() {
    try {
        return sessionStorage.getItem(TOKEN_KEY)
    } catch {
        // Private browsing or blocked storage: treat it as "not signed in".
        return null
    }
}

export function setAdminToken(token) {
    try {
        if (token) sessionStorage.setItem(TOKEN_KEY, token)
        else sessionStorage.removeItem(TOKEN_KEY)
    } catch {
        // Nothing to do -- the caller keeps the token in memory for this page.
    }
}

// Raised on 401 so the admin app can send the user back to the login screen
// instead of showing "Unauthorized." as a form error.
export class UnauthorizedError extends Error {}

// By far the most common thing to go wrong in development is running only the
// frontend, so the message names the fix instead of being vague about it.
const API_DOWN_MESSAGE =
    "Could not reach the API. Start the backend too — run `npm run dev` (not just `vite`), which serves it on port 4000."

async function request(path, options = {}) {
    const { auth = false, ...rest } = options

    const headers = { "Content-Type": "application/json", ...rest.headers }
    if (auth) {
        const token = getAdminToken()
        if (token) headers.Authorization = `Bearer ${token}`
    }

    let response
    try {
        response = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers })
    } catch {
        // fetch only rejects when the request never got an answer: the backend is
        // not running, or the network is gone. Saying so beats a generic failure,
        // because no amount of retrying or re-typing a password will fix it.
        throw new Error(API_DOWN_MESSAGE)
    }

    const body = await response.json().catch(() => null)

    if (!response.ok) {
        // A 5xx with no JSON body is the dev proxy failing to reach the backend --
        // the same situation as above, just reported one layer further out.
        const fallback =
            body === null && response.status >= 500
                ? API_DOWN_MESSAGE
                : "Something went wrong. Please try again."
        const message = body?.errors
            ? Object.values(body.errors).join(" ")
            : body?.error ?? fallback
        if (response.status === 401) throw new UnauthorizedError(message)
        throw new Error(message)
    }

    return body
}

const json = (body) => JSON.stringify(body)

// --- Public site -----------------------------------------------------------

export function submitContactForm(formData) {
    return request("/api/contact", { method: "POST", body: json(formData) })
}

// `sessionId` ties the pages of one visit together so the admin can read a
// journey rather than a pile of hits. See reportPageView in routes/Route.jsx.
export function logPageView(path, referrer, sessionId) {
    return request("/api/page-views", { method: "POST", body: json({ path, referrer, sessionId }) })
}

export function fetchContent() {
    return request("/api/content")
}

// --- Admin -----------------------------------------------------------------

export function adminLogin(username, password) {
    return request("/api/admin/login", { method: "POST", body: json({ username, password }) })
}

export function adminMe() {
    return request("/api/admin/me", { auth: true })
}

export function fetchStats() {
    return request("/api/admin/stats", { auth: true })
}

// Merges `value` into one section, leaving its other fields untouched -- which is
// how the admin saves images without touching the copy around them. Arrays are
// taken wholesale, so a gallery list is saved exactly as the editor shows it.
export function saveSection(section, value) {
    return request(`/api/content/${section}`, { method: "PATCH", auth: true, body: json(value) })
}

// Replaces the whole content document; used by the admin's restore-from-backup.
export function replaceContent(document) {
    return request("/api/content", { method: "PUT", auth: true, body: json(document) })
}

export function resetAllContent() {
    return request("/api/content/reset", { method: "POST", auth: true })
}

// --- Admin: media library --------------------------------------------------

export function fetchMedia() {
    return request("/api/admin/media", { auth: true })
}

// `dataUrl` comes straight from FileReader.readAsDataURL.
export function uploadMedia(name, dataUrl) {
    return request("/api/admin/media", { method: "POST", auth: true, body: json({ name, dataUrl }) })
}

export function renameMedia(id, name) {
    return request(`/api/admin/media/${id}`, { method: "PATCH", auth: true, body: json({ name }) })
}

export function deleteMedia(id) {
    return request(`/api/admin/media/${id}`, { method: "DELETE", auth: true })
}

// --- Admin: inbox and analytics -------------------------------------------

export function fetchContacts() {
    return request("/api/contact", { auth: true })
}

export function updateContact(id, patch) {
    return request(`/api/contact/${id}`, { method: "PATCH", auth: true, body: json(patch) })
}

export function deleteContact(id) {
    return request(`/api/contact/${id}`, { method: "DELETE", auth: true })
}

export function fetchPageViews() {
    return request("/api/page-views", { auth: true })
}

export function clearPageViews() {
    return request("/api/page-views", { method: "DELETE", auth: true })
}
