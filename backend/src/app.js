import cors from "cors"
import express from "express"
import adminRoutes from "./routes/admin.routes.js"
import contactRoutes from "./routes/contact.routes.js"
import contentRoutes from "./routes/content.routes.js"
import pageViewRoutes from "./routes/pageView.routes.js"
import { serveMedia } from "./controllers/admin.controller.js"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js"
import { requestLogger } from "./middleware/requestLogger.js"

const configuredOrigins = (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

// With CORS_ORIGIN unset: on Vercel the frontend and this API are served from
// the same origin, so reflect whatever origin asks (which also covers the
// per-deployment preview URLs); locally, allow the Vite dev server.
const allowedOrigins = configuredOrigins.length > 0
    ? configuredOrigins
    : process.env.VERCEL
        ? true
        : ["http://localhost:5173"]

const app = express()

app.use(requestLogger)
app.use(cors({ origin: allowedOrigins }))
// Images reach the media library as base64 data URLs in a JSON body, which is
// roughly a third larger than the file itself, so the default 100kb limit is far
// too small. Kept comfortably above mediaStore's 3MB per-image cap.
app.use(express.json({ limit: "12mb" }))

app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, status: "ok" })
})

app.use("/api/contact", contactRoutes)
app.use("/api/page-views", pageViewRoutes)
app.use("/api/content", contentRoutes)
app.use("/api/admin", adminRoutes)
// Public, and deliberately outside /api/admin: these URLs are what the live
// site's <img> tags point at.
app.get("/api/media/:id", serveMedia)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
