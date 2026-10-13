// A deliberately small in-memory limiter for the admin login endpoint.
//
// In-memory is a real limitation on Vercel: each serverless instance keeps its
// own counter, so the effective limit is per-instance rather than global. It
// still blunts a naive password-guessing loop, which is what it is here for. A
// deployment that needs a hard guarantee wants a shared store (Redis, Upstash)
// instead.

const WINDOW_MS = 60 * 1000
const MAX_ATTEMPTS = 10

const attempts = new Map()

function prune(now) {
    for (const [key, entry] of attempts) {
        if (entry.resetAt <= now) attempts.delete(key)
    }
}

export function createRateLimiter({ windowMs = WINDOW_MS, max = MAX_ATTEMPTS } = {}) {
    return function rateLimiter(req, res, next) {
        const now = Date.now()
        // Cheap enough to sweep on every request: the map only ever holds the
        // addresses seen within the last window.
        prune(now)

        const key = req.ip ?? req.socket?.remoteAddress ?? "unknown"
        const entry = attempts.get(key) ?? { count: 0, resetAt: now + windowMs }

        entry.count += 1
        attempts.set(key, entry)

        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
            res.setHeader("Retry-After", String(retryAfter))
            return res.status(429).json({
                success: false,
                error: `Too many attempts. Try again in ${retryAfter} seconds.`,
            })
        }

        next()
    }
}

export const loginRateLimiter = createRateLimiter()
