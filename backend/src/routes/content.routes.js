import { Router } from "express"
import { asyncRoute } from "../middleware/asyncRoute.js"
import {
    deleteCollectionItem,
    getCollection,
    patchSection,
    postItem,
    postReset,
    putCollectionOrder,
    putContent,
    putItem,
    readContent,
    readContentSchema,
} from "../controllers/content.controller.js"
import { requireAdminAuth } from "../middleware/requireAdminAuth.js"

const router = Router()

// Reading content is public -- it is what the site renders.
router.get("/", asyncRoute(readContent))
router.get("/schema", asyncRoute(readContentSchema))

// Everything below changes the live site.
router.put("/", requireAdminAuth, asyncRoute(putContent))
router.post("/reset", requireAdminAuth, asyncRoute(postReset))
router.post("/reset/:section", requireAdminAuth, asyncRoute(postReset))

// Collection CRUD. `:collection` is a dotted path such as
// "visiMisi.milestones"; contentStore only accepts the declared ones.
router.get("/items/:collection", asyncRoute(getCollection))
router.post("/items/:collection", requireAdminAuth, asyncRoute(postItem))
router.put("/items/:collection/order", requireAdminAuth, asyncRoute(putCollectionOrder))
router.put("/items/:collection/:id", requireAdminAuth, asyncRoute(putItem))
router.delete("/items/:collection/:id", requireAdminAuth, asyncRoute(deleteCollectionItem))

// Declared last so "/reset", "/schema" and "/items/..." are matched first rather
// than being swallowed as a section name.
router.patch("/:section", requireAdminAuth, asyncRoute(patchSection))

export default router
