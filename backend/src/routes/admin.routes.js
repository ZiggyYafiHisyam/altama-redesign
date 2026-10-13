import { Router } from "express"
import {
    getMediaLibrary,
    getStats,
    login,
    me,
    patchMedia,
    removeMedia,
    uploadMedia,
} from "../controllers/admin.controller.js"
import { requireAdminAuth } from "../middleware/requireAdminAuth.js"
import { loginRateLimiter } from "../middleware/rateLimit.js"

const router = Router()

// Rate-limited: this is the one endpoint where guessing is the attack.
router.post("/login", loginRateLimiter, login)

router.get("/me", requireAdminAuth, me)
router.get("/stats", requireAdminAuth, getStats)

router.get("/media", requireAdminAuth, getMediaLibrary)
router.post("/media", requireAdminAuth, uploadMedia)
router.patch("/media/:id", requireAdminAuth, patchMedia)
router.delete("/media/:id", requireAdminAuth, removeMedia)

export default router
