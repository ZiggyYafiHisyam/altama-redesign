import { Router } from "express"
import { asyncRoute } from "../middleware/asyncRoute.js"
import { createPageView, getPageViews, resetPageViews } from "../controllers/pageView.controller.js"
import { validatePageView } from "../middleware/validatePageView.js"
import { requireAdminAuth } from "../middleware/requireAdminAuth.js"

const router = Router()

router.post("/", validatePageView, asyncRoute(createPageView))
router.get("/", requireAdminAuth, asyncRoute(getPageViews))
router.delete("/", requireAdminAuth, asyncRoute(resetPageViews))

export default router
