import { useState } from "react"
import alva from "../../assets/hero/ALVA.png"
import { useNavigate } from "react-router-dom"
import emailIcon from "../../assets/icon/email.svg"
import locationIcon from "../../assets/icon/location.svg"
import phoneIcon from "../../assets/icon/telepon.svg"
import { submitContactForm } from "../../lib/api"

const contactDetails = [
    { icon: phoneIcon, label: "+62 xxx xxxx xxxx" },
    { icon: emailIcon, label: "info@altama.co.id" },
    { icon: locationIcon, label: "Jakarta, Indonesia" },
]

const initialFormState = {
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
}

const ContactUsComp = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((previous) => ({ ...previous, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("")
        setIsSubmitting(true)
        try {
            await submitContactForm(formData)
            setFormData(initialFormState)
            navigate("/terimakasih")
        } catch (submitError) {
            setError(submitError.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main>
            <section
                className="relative overflow-hidden px-6 pb-14 pt-35 md:px-12 md:pb-18 md:pt-40"
                style={{
                    background: "linear-gradient(180deg, #353185 0%, #4B45A1 100%)",
                }}
            >
                <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[88px_88px]" />
                </div>

                <div className="relative mx-auto grid max-w-275 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                    <div className="relative min-h-125">
                        <h1 className="font-header text-[42px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[56px]">
                            Connect <span className="text-[#F4C41C]">With Us!</span>
                        </h1>
                        <p className="mt-3 max-w-85 font-inter text-base leading-[1.15] text-white md:text-xl">
                            Kami siap membantu kebutuhan bisnis, distribusi, dan kerja sama Anda.
                        </p>

                        <div className="mt-8 flex flex-col gap-4">
                            {contactDetails.map((detail) => (
                                <div key={detail.label} className="flex items-center gap-3">
                                    <img className="h-11 w-11" src={detail.icon} alt="" />
                                    <span className="font-inter text-base text-white md:text-lg">{detail.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 flex h-31.5 w-full max-w-104 items-end rounded-3xl bg-white px-7 pt-5 md:h-36">
                            <div className="relative z-10 self-start">
                                <h2 className="font-header text-xl font-semibold text-primary md:text-2xl">
                                    Connect With Altama!
                                </h2>
                                <p className="mt-1 max-w-53 font-inter text-xs leading-tight text-grey md:text-sm">
                                    Tim kami siap membantu Anda setiap saat.
                                </p>
                            </div>
                            <img
                                className="pointer-events-none absolute bottom-0 right-2 z-20 h-48 object-contain md:h-56"
                                src={alva}
                                alt="Alva menyambut pengunjung"
                            />
                        </div>
                    </div>

                    <form
                        className="rounded-3xl bg-[#F8F8F8] p-7 md:p-10"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="font-inter text-sm text-[#121212]">
                                Your Name
                                <input
                                    className="mt-2 h-14 w-full rounded-full bg-[#EDEDED] px-5 outline-none placeholder:text-[#B8B8B8] focus:ring-2 focus:ring-primary"
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="font-inter text-sm text-[#121212]">
                                Email Address
                                <input
                                    className="mt-2 h-14 w-full rounded-full bg-[#EDEDED] px-5 outline-none placeholder:text-[#B8B8B8] focus:ring-2 focus:ring-primary"
                                    type="email"
                                    name="email"
                                    placeholder="Your Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="font-inter text-sm text-[#121212]">
                                Phone Number
                                <input
                                    className="mt-2 h-14 w-full rounded-full bg-[#EDEDED] px-5 outline-none placeholder:text-[#B8B8B8] focus:ring-2 focus:ring-primary"
                                    type="tel"
                                    name="phone"
                                    placeholder="Your Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className="font-inter text-sm text-[#121212]">
                                Location
                                <input
                                    className="mt-2 h-14 w-full rounded-full bg-[#EDEDED] px-5 outline-none placeholder:text-[#B8B8B8] focus:ring-2 focus:ring-primary"
                                    type="text"
                                    name="location"
                                    placeholder="Your Location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <label className="mt-5 block font-inter text-sm text-[#121212]">
                            Tell Us Your Story
                            <textarea
                                className="mt-2 h-36 w-full resize-none rounded-3xl bg-[#EDEDED] p-5 outline-none placeholder:text-[#B8B8B8] focus:ring-2 focus:ring-primary"
                                placeholder="Write Something..."
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </label>
                        {error && (
                            <p className="mt-3 font-inter text-sm text-red-600">{error}</p>
                        )}
                        <button
                            className="mt-5 h-14 w-full rounded-full bg-primary font-inter text-base font-semibold text-white transition-colors hover:bg-darkBlue disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </section>

            <section className="relative overflow-hidden bg-white px-6 py-18 md:px-12 md:py-22">
                <div className="mx-auto flex min-h-67.5 max-w-265 flex-col items-center justify-center rounded-3xl border border-[#ACA9DF] px-6 text-center">
                    <h2 className="font-header text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-primary md:text-[56px]">
                        Insights, Innovation, and Progress
                    </h2>
                    <p className="mt-4 max-w-121.75 font-inter text-base leading-[1.3] text-grey md:text-xl">
                        Temukan solusi terbaik untuk kebutuhan teknik, otomotif, dan industri Anda.
                    </p>
                        <button
                            className="mt-8 h-15.25 w-53 rounded-full bg-primary font-inter text-base font-semibold text-white"
                            type="button"
                            onClick={() => navigate("/detail-news")}
                        >
                        Explore News
                    </button>
                </div>
            </section>
        </main>
    )
}

export default ContactUsComp