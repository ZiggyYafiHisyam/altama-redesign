import cors from "cors"
import express from "express"
import contactRoutes from "./routes/contact.routes.js"
import pageViewRoutes from "./routes/pageView.routes.js"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js"
import { requestLogger } from "./middleware/requestLogger.js"

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

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
