import cors from "cors"
import express from "express"
import contactRoutes from "./routes/contact.routes.js"
import pageViewRoutes from "./routes/pageView.routes.js"
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
app.use(express.json())

app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, status: "ok" })
})

app.use("/api/contact", contactRoutes)
app.use("/api/page-views", pageViewRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
