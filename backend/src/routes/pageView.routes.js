import { Router } from "express"
import { createPageView, getPageViews, resetPageViews } from "../controllers/pageView.controller.js"
import { validatePageView } from "../middleware/validatePageView.js"
import { requireAdminAuth } from "../middleware/requireAdminAuth.js"

const router = Router()

router.post("/", validatePageView, createPageView)
router.get("/", requireAdminAuth, getPageViews)
router.delete("/", requireAdminAuth, resetPageViews)

export default router
