import { Router } from "express"
import { createPageView, getPageViews } from "../controllers/pageView.controller.js"
import { validatePageView } from "../middleware/validatePageView.js"
import { requireAdminKey } from "../middleware/requireAdminKey.js"

const router = Router()

router.post("/", validatePageView, createPageView)
router.get("/", requireAdminKey, getPageViews)

export default router
