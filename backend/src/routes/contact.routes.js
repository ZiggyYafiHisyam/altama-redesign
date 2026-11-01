import { Router } from "express"
import { asyncRoute } from "../middleware/asyncRoute.js"
import { createContact, getContacts, patchContact, removeContact } from "../controllers/contact.controller.js"
import { validateContact } from "../middleware/validateContact.js"
import { requireAdminAuth } from "../middleware/requireAdminAuth.js"

const router = Router()

router.post("/", validateContact, asyncRoute(createContact))
router.get("/", requireAdminAuth, asyncRoute(getContacts))
router.patch("/:id", requireAdminAuth, asyncRoute(patchContact))
router.delete("/:id", requireAdminAuth, asyncRoute(removeContact))

export default router
