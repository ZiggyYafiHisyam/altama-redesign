import { Router } from "express"
import { createContact, getContacts, patchContact, removeContact } from "../controllers/contact.controller.js"
import { validateContact } from "../middleware/validateContact.js"
import { requireAdminAuth } from "../middleware/requireAdminAuth.js"

const router = Router()

router.post("/", validateContact, createContact)
router.get("/", requireAdminAuth, getContacts)
router.patch("/:id", requireAdminAuth, patchContact)
router.delete("/:id", requireAdminAuth, removeContact)

export default router
