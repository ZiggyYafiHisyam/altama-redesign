import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../ui/Button/Button'
import { useSection } from '../../lib/content'
import { submitContactForm } from '../../lib/api'
import { HeroTitle, Multiline } from '../../lib/text'

const emptyForm = { name: '', email: '', message: '' }

const Location = () => {
    const navigate = useNavigate()
    const { location } = useSection('home')
    const { contact } = useSection('site')
    const [form, setForm] = useState(emptyForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            // The backend requires phone and location too; this short form does
            // not ask for them, so the company's own details stand in and the
            // full form on /contact-us is where a visitor gives theirs.
            await submitContactForm({
                ...form,
                phone: contact.phone,
                location: contact.shortAddress,
            })
            setForm(emptyForm)
            navigate('/terimakasih')
        } catch (submitError) {
            setError(submitError.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="w-full bg-[#f3f3f3] px-6 py-16 sm:px-8 md:px-12 md:py-24 lg:px-20 xl:px-64.5">
            <div className="mx-auto max-w-300">
                <h2 className="text-center font-header text-[42px] font-bold leading-none tracking-[-0.04em] md:text-[56px] ">
                    <HeroTitle
                        before={location.titleBefore}
                        highlight={location.titleHighlight}
                        highlightClassName="text-primary"
                    />
                </h2>

                <div className="mt-8 flex flex-col gap-8 xl:flex-row">
                    <div className="relative w-full overflow-hidden rounded-[18px] border-[3px] border-[#0a5cd8] bg-[#dfeaf7] shadow-[0_0_0_1px_rgba(7,83,200,0.15)] xl:max-w-190">
                        <iframe
                            title="Altama Location Map"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`}
                            className="h-72 w-full border-0 sm:h-88 md:h-105"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-white/80 px-4 py-3 backdrop-blur-sm">
                            <p className="text-[15px] font-medium leading-relaxed text-[#1d1d1d]">
                                <Multiline text={contact.address} />
                            </p>
                        </div>
                    </div>

                    <form className="flex w-full flex-col justify-end xl:max-w-105" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-[18px] font-medium text-[#2c2c2c]">{location.nameLabel}</span>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={location.namePlaceholder}
                                        value={form.name}
                                        onChange={handleChange}
                                        className="h-15 w-full rounded-3xl border-0 bg-[#e9e9e9] px-4 text-[18px] text-[#444] placeholder:text-[#7a7a7a] focus:outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-[18px] font-medium text-[#2c2c2c]">{location.emailLabel}</span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={location.emailPlaceholder}
                                        value={form.email}
                                        onChange={handleChange}
                                        className="h-15 w-full rounded-3xl border-0 bg-[#e9e9e9] px-4 text-[18px] text-[#444] placeholder:text-[#7a7a7a] focus:outline-none"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-[18px] font-medium text-[#2c2c2c]">{location.messageLabel}</span>
                                <textarea
                                    name="message"
                                    placeholder={location.messagePlaceholder}
                                    rows="5"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full resize-none rounded-3xl border-0 bg-[#e9e9e9] px-4 py-4 text-[18px] text-[#444] placeholder:text-[#7a7a7a] focus:outline-none"
                                />
                            </label>
                        </div>

                        {error && <p className="mt-3 font-inter text-sm text-red-600">{error}</p>}

                        <div className="mt-6">
                            <Button
                                className="h-15! w-full! rounded-[26px]! bg-primary! text-[22px]! font-bold! shadow-none! disabled:opacity-60"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {location.buttonLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Location
