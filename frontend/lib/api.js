// Empty string means requests go to the same origin the frontend is served from,
// and the Vite dev server proxy (see vite.config.js) forwards /api to the backend.
// Set VITE_API_BASE_URL in a .env file to point at a different backend (e.g. in production).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""

async function request(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    })

    const body = await response.json().catch(() => null)

    if (!response.ok) {
        const message = body?.errors
            ? Object.values(body.errors).join(" ")
            : body?.error ?? "Something went wrong. Please try again."
        throw new Error(message)
    }

    return body
}

export function submitContactForm(formData) {
    return request("/api/contact", {
        method: "POST",
        body: JSON.stringify(formData),
    })
}

export function logPageView(path, referrer) {
    return request("/api/page-views", {
        method: "POST",
        body: JSON.stringify({ path, referrer }),
    })
}
