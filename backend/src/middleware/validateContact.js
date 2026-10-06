const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContact(req, res, next) {
    const { name, email, phone, location, message } = req.body ?? {}
    const errors = {}

    if (!name || !String(name).trim()) errors.name = "Name is required."
    if (!email || !String(email).trim()) errors.email = "Email is required."
    else if (!EMAIL_RE.test(String(email).trim())) errors.email = "Email is not valid."
    if (!phone || !String(phone).trim()) errors.phone = "Phone number is required."
    if (!location || !String(location).trim()) errors.location = "Location is required."
    if (!message || !String(message).trim()) errors.message = "Message is required."

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors })
    }

    req.body = {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        location: String(location).trim(),
        message: String(message).trim(),
    }
    next()
}
