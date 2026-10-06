import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// On Vercel the deployment filesystem is read-only and /tmp is the only
// writable path, so that is where the JSON stores go. /tmp is scoped to a
// single serverless instance and is wiped when that instance is recycled,
// which makes this temporary storage, not a database: entries can disappear
// at any time, and two concurrent instances do not see each other's writes.
// Set DATA_DIR to override (e.g. a mounted volume on a long-running host).
const defaultDir = process.env.VERCEL
    ? "/tmp/altama-data"
    : path.join(__dirname, "..", "..", "data")

export const DATA_DIR = process.env.DATA_DIR ?? defaultDir
