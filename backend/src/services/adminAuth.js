import crypto from "node:crypto"

// Admin credentials. The defaults are the ones documented for this project
// (admin / 123) so a fresh clone can sign in immediately; override both env vars
// on any deployment that is reachable from the internet.
const USERNAME = process.env.ADMIN_USERNAME ?? "admin"
const PASSWORD = process.env.ADMIN_PASSWORD ?? "123"

// Signing key for session tokens. Unset, it falls back to a key derived from the
// password, which keeps local dev working; sessions are then invalidated
// whenever the password changes, which is the behaviour you want anyway.
const SECRET =
    process.env.ADMIN_SESSION_SECRET ??
    crypto.createHash("sha256").update(`altama:${USERNAME}:${PASSWORD}`).digest("hex")

const SESSION_HOURS = Number(process.env.ADMIN_SESSION_HOURS ?? 12)

function base64url(buffer) {
    return Buffer.from(buffer).toString("base64url")
}

function sign(payload) {
    return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url")
}

// Constant-time compare, so a wrong password cannot be narrowed down by timing.
function safeEqual(a, b) {
    const left = Buffer.from(String(a))
    const right = Buffer.from(String(b))
    if (left.length !== right.length) return false
    return crypto.timingSafeEqual(left, right)
}

export function verifyCredentials(username, password) {
    // Both comparisons always run: bailing out early on a bad username would
    // leak which half was wrong.
    const userOk = safeEqual(username ?? "", USERNAME)
    const passOk = safeEqual(password ?? "", PASSWORD)
    return userOk && passOk
}

// A self-contained signed token: `<payload>.<signature>`. There is no server-side
// session list, which matters on Vercel where each request may hit a different
// instance with its own (empty) memory.
export function issueToken(username = USERNAME) {
    const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000
    const payload = base64url(JSON.stringify({ sub: username, exp: expiresAt }))
    return { token: `${payload}.${sign(payload)}`, expiresAt }
}

export function verifyToken(token) {
    if (typeof token !== "string" || !token.includes(".")) return null

    const [payload, signature] = token.split(".")
    if (!payload || !signature) return null
    if (!safeEqual(signature, sign(payload))) return null

    try {
        const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"))
        if (typeof claims.exp !== "number" || claims.exp < Date.now()) return null
        return { username: claims.sub, expiresAt: claims.exp }
    } catch {
        return null
    }
}

export const ADMIN_USERNAME = USERNAME
