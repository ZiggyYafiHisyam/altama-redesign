import { Router } from "express"
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
router.get("/", readContent)
router.get("/schema", readContentSchema)

// Everything below changes the live site.
router.put("/", requireAdminAuth, putContent)
router.post("/reset", requireAdminAuth, postReset)
router.post("/reset/:section", requireAdminAuth, postReset)

// Collection CRUD. `:collection` is a dotted path such as
// "visiMisi.milestones"; contentStore only accepts the declared ones.
router.get("/items/:collection", getCollection)
router.post("/items/:collection", requireAdminAuth, postItem)
router.put("/items/:collection/order", requireAdminAuth, putCollectionOrder)
router.put("/items/:collection/:id", requireAdminAuth, putItem)
router.delete("/items/:collection/:id", requireAdminAuth, deleteCollectionItem)

// Declared last so "/reset", "/schema" and "/items/..." are matched first rather
// than being swallowed as a section name.
router.patch("/:section", requireAdminAuth, patchSection)

export default router
