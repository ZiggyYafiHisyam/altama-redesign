import { Router } from "express"
import { createContact, getContacts } from "../controllers/contact.controller.js"
import { validateContact } from "../middleware/validateContact.js"
import { requireAdminKey } from "../middleware/requireAdminKey.js"

const router = Router()

router.post("/", validateContact, createContact)
router.get("/", requireAdminKey, getContacts)

export default router
