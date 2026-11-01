import { Router } from "express"
import { asyncRoute } from "../middleware/asyncRoute.js"
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
router.post("/login", loginRateLimiter, asyncRoute(login))

router.get("/me", requireAdminAuth, asyncRoute(me))
router.get("/stats", requireAdminAuth, asyncRoute(getStats))

router.get("/media", requireAdminAuth, asyncRoute(getMediaLibrary))
router.post("/media", requireAdminAuth, asyncRoute(uploadMedia))
router.patch("/media/:id", requireAdminAuth, asyncRoute(patchMedia))
router.delete("/media/:id", requireAdminAuth, asyncRoute(removeMedia))

export default router
