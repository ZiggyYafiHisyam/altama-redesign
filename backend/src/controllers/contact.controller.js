import { randomUUID } from "node:crypto"
import { addContact, listContacts } from "../services/contactStore.js"

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
