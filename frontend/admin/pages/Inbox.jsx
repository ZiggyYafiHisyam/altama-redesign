import { useEffect, useMemo, useState } from "react"
import { deleteContact, fetchContacts, updateContact } from "../../lib/api"
import { useToast } from "../lib/toast"
import { IconButton } from "../components/Fields"
import { PageHeader } from "../components/Page"

// Contact-form submissions. Read, mark as handled, annotate, delete -- the
// messages themselves are never editable, since they are a record of what a
// visitor actually sent.
const Inbox = () => {
    const toast = useToast()
    const [contacts, setContacts] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [query, setQuery] = useState("")
    const [openId, setOpenId] = useState(null)

    // A promise chain that does not raise the loading flag itself -- see Media.jsx
    // for why. The Refresh button raises it explicitly.
    const load = () =>
        fetchContacts()
            // Newest first: the inbox is read from the top.
            .then((body) => setContacts([...body.data].reverse()))
            .catch((error) => toast.error(error.message))
            .finally(() => setLoading(false))

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase()
        return contacts.filter((contact) => {
            if (filter === "new" && contact.handled) return false
            if (filter === "handled" && !contact.handled) return false
            if (!term) return true
            return `${contact.name} ${contact.email} ${contact.phone} ${contact.location} ${contact.message}`
                .toLowerCase()
                .includes(term)
        })
    }, [contacts, filter, query])

    const toggleHandled = async (contact) => {
        try {
            const body = await updateContact(contact.id, { handled: !contact.handled })
            setContacts((current) =>
                current.map((item) => (item.id === contact.id ? body.data : item)),
            )
        } catch (error) {
            toast.error(error.message)
        }
    }

    const saveNote = async (contact, note) => {
        try {
            const body = await updateContact(contact.id, { handled: contact.handled, note })
            setContacts((current) =>
                current.map((item) => (item.id === contact.id ? body.data : item)),
            )
            toast.success("Note saved.")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const remove = async (contact) => {
        if (!window.confirm(`Delete the message from ${contact.name}? This cannot be undone.`)) return
        try {
            await deleteContact(contact.id)
            setContacts((current) => current.filter((item) => item.id !== contact.id))
            toast.success("Message deleted.")
        } catch (error) {
            toast.error(error.message)
        }
    }

    const newCount = contacts.filter((contact) => !contact.handled).length

    return (
        <>
            <PageHeader
                title="Inbox"
                description="Everything submitted through the contact form on /contact-us and the short form on the home page."
            >
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                    onClick={() => {
                        setLoading(true)
                        load()
                    }}
                >
                    Refresh
                </button>
            </PageHeader>

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <div className="flex rounded-xl bg-slate-100 p-1">
                    {[
                        { key: "all", label: `All (${contacts.length})` },
                        { key: "new", label: `New (${newCount})` },
                        { key: "handled", label: `Handled (${contacts.length - newCount})` },
                    ].map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            className={`rounded-lg px-3.5 py-2 font-inter text-xs font-semibold transition-colors ${
                                filter === option.key ? "bg-white text-primary shadow-sm" : "text-slate-500"
                            }`}
                            onClick={() => setFilter(option.key)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <input
                    className="ml-auto w-56 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-inter text-sm outline-none focus:border-primary"
                    type="search"
                    placeholder="Search messages…"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>

            {isLoading ? (
                <p className="font-inter text-sm text-slate-400">Loading…</p>
            ) : visible.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center font-inter text-sm text-slate-400">
                    {contacts.length === 0 ? "No messages yet." : "No message matches this filter."}
                </p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {visible.map((contact) => (
                        <li
                            key={contact.id}
                            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                                contact.handled ? "border-slate-200" : "border-primary/30"
                            }`}
                        >
                            <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                                {!contact.handled && (
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                                )}
                                <button
                                    type="button"
                                    className="min-w-0 flex-1 text-left"
                                    onClick={() => setOpenId(openId === contact.id ? null : contact.id)}
                                    aria-expanded={openId === contact.id}
                                >
                                    <span className="block font-inter text-sm font-semibold text-slate-800">
                                        {contact.name}
                                        <span className="ml-2 font-normal text-slate-400">{contact.email}</span>
                                    </span>
                                    <span className="mt-0.5 block truncate font-inter text-sm text-slate-500">
                                        {contact.message}
                                    </span>
                                </button>
                                <span className="shrink-0 font-inter text-xs text-slate-400">
                                    {new Date(contact.createdAt).toLocaleString()}
                                </span>
                                <button
                                    type="button"
                                    className={`shrink-0 rounded-lg border px-3 py-1.5 font-inter text-xs font-semibold transition-colors ${
                                        contact.handled
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700"
                                    }`}
                                    onClick={() => toggleHandled(contact)}
                                >
                                    {contact.handled ? "✓ Handled" : "Mark handled"}
                                </button>
                                <IconButton label="Delete message" tone="danger" onClick={() => remove(contact)}>
                                    ×
                                </IconButton>
                            </div>

                            {openId === contact.id && (
                                <ContactDetail contact={contact} onSaveNote={saveNote} />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

function ContactDetail({ contact, onSaveNote }) {
    const [note, setNote] = useState(contact.note ?? "")

    return (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                {[
                    ["Name", contact.name],
                    ["Email", contact.email],
                    ["Phone", contact.phone],
                    ["Location", contact.location],
                ].map(([label, value]) => (
                    <div key={label}>
                        <dt className="font-inter text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            {label}
                        </dt>
                        <dd className="font-inter text-sm text-slate-700">{value}</dd>
                    </div>
                ))}
            </dl>

            <p className="mt-4 whitespace-pre-line rounded-xl border border-slate-200 bg-white p-4 font-inter text-sm leading-relaxed text-slate-700">
                {contact.message}
            </p>

            <div className="mt-4 flex flex-col gap-2">
                <label className="font-inter text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Internal note
                </label>
                <textarea
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-inter text-sm outline-none focus:border-primary"
                    rows={2}
                    placeholder="Only visible here."
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                />
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-xl bg-primary px-4 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        onClick={() => onSaveNote(contact, note)}
                        disabled={note === (contact.note ?? "")}
                    >
                        Save note
                    </button>
                    <a
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                        href={`mailto:${contact.email}?subject=Re: your message to Altama`}
                    >
                        Reply by email
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Inbox
