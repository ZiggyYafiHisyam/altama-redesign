import { randomUUID } from "node:crypto"
import { addContact, deleteContact, listContacts, updateContact } from "../services/contactStore.js"

export function createContact(req, res) {
    const entry = {
        id: randomUUID(),
        ...req.body,
        createdAt: new Date().toISOString(),
    }
    addContact(entry)
    res.status(201).json({ success: true, data: entry })
}

export function getContacts(_req, res) {
    res.status(200).json({ success: true, data: listContacts() })
}

export function patchContact(req, res) {
    const entry = updateContact(req.params.id, {
        // Only the admin's own bookkeeping fields are writable; the visitor's
        // message itself is a record and stays as submitted.
        handled: Boolean(req.body?.handled),
        note: typeof req.body?.note === "string" ? req.body.note : undefined,
    })
    if (!entry) {
        return res.status(404).json({ success: false, error: "Submission not found." })
    }
    res.status(200).json({ success: true, data: entry })
}

export function removeContact(req, res) {
    const entry = deleteContact(req.params.id)
    if (!entry) {
        return res.status(404).json({ success: false, error: "Submission not found." })
    }
    res.status(200).json({ success: true, data: entry })
}
