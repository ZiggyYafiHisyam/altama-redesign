// Vercel serverless entry point for the backend.
//
// vercel.json rewrites every /api/* request here and Express handles the
// routing from there, so there is still a single app definition shared with
// backend/src/server.js (the standalone server used for local dev).
import app from "../backend/src/app.js"

export default app
