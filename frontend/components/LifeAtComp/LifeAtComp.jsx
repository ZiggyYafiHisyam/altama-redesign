import { useRef } from "react"
import heroLifeAt from "../../assets/LifeAt/heroLifeAt.png"
import videoTestimoni from "../../assets/LifeAt/VideoTestimoni.png"

const testimonials = [
    {
        name: "Marvin McKinney",
        role: "Louis Vuitton",
        quote: "Altama selalu konsisten menyediakan produk berkualitas dengan distribusi yang tepat waktu.",
    },
    {
        name: "Andi Pratama",
        role: "Procurement Manager - Retail Partner",
        quote: "Timnya profesional dan mudah diajak bekerja sama.",
    },
    {
        name: "Marvin McKinney",
        role: "Louis Vuitton",
        quote: "Produk Tekiro dan RYU dapat diandalkan untuk kebutuhan pekerjaan.",
    },
    {
        name: "Sarah Williams",
        role: "Business Partner",
        quote: "Pelayanan dan kualitas produk Altama membantu bisnis kami berkembang.",
    },
    {
        name: "Dimas Saputra",
        role: "Retail Partner",
        quote: "Kolaborasi yang baik dengan dukungan distribusi yang terpercaya.",
    },
]

const LifeAtComp = () => {
    const trackRef = useRef(null)
    const isDragging = useRef(false)
    const dragStartX = useRef(0)
    const scrollStart = useRef(0)

    const handlePointerDown = (event) => {
        const track = trackRef.current
        if (!track) return

        isDragging.current = true
        dragStartX.current = event.clientX
        scrollStart.current = track.scrollLeft
        track.setPointerCapture(event.pointerId)
        track.classList.add("cursor-grabbing")
    }

    const handlePointerMove = (event) => {
        if (!isDragging.current || !trackRef.current) return
        trackRef.current.scrollLeft = scrollStart.current - (event.clientX - dragStartX.current)
    }

    const stopDragging = (event) => {
        if (!isDragging.current) return
        isDragging.current = false
        trackRef.current?.releasePointerCapture(event.pointerId)
        trackRef.current?.classList.remove("cursor-grabbing")
    }

    return (
        <main>
            <section
                className="relative h-270 overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${heroLifeAt})` }}
            >
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary to-primary/20" aria-hidden="true" />
                <div className="relative z-10 px-8 pt-56 lg:px-27.25 lg:pt-72.25">
                    <div className="flex gap-3">
                        {["TEKIRO", "REXCO", "RYU"].map((brand) => (
                            <span key={brand} className="rounded-md bg-primary px-3 py-2 font-header text-xl font-bold text-white lg:text-2xl">
                                {brand}
                            </span>
                        ))}
                    </div>
                    <h1 className="mt-8 max-w-190 font-header text-[clamp(3rem,5.7vw,6.5rem)] font-semibold leading-[0.93] tracking-[-0.04em] text-white">
                        <span className="rounded-md bg-[#F4C41C] px-2">JOIN US HERE!</span>
                        <br />
                        GROW TOGETHER
                    </h1>
                    <p className="mt-7 max-w-170 font-inter text-[clamp(1rem,1.3vw,2rem)] leading-none text-white/85">
                        Your partner in progress, empowering every
                        <br />
                        step toward Indonesia&apos;s success.
                    </p>
                    <span className="mt-8 inline-flex rounded-full border border-white/40 px-4 py-2 font-inter text-sm text-white lg:text-lg">
                        #AltamaGueBanget
                    </span>
                </div>
            </section>

            <section className="overflow-hidden bg-white px-6 py-16 lg:px-27.25 lg:py-24">
                <div className="mx-auto max-w-422.5">
                    <p className="font-inter text-lg text-primary lg:text-2xl">Testimonials</p>
                    <div className="mt-2 flex items-end justify-between gap-6">
                        <h2 className="max-w-155 font-header text-[clamp(2rem,3vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#121212]">
                            What our partners say about Altama
                        </h2>
                        <div className="hidden shrink-0 gap-3 lg:flex" aria-hidden="true">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-2xl text-primary">‹</span>
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white">›</span>
                        </div>
                    </div>

                    <div
                        ref={trackRef}
                        className="milestone-track mt-10 flex cursor-grab touch-pan-x select-none gap-6 overflow-x-auto pb-2"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={stopDragging}
                        onPointerCancel={stopDragging}
                        aria-label="Customer testimonials"
                    >
                        {testimonials.map((testimonial, index) => (
                            <article
                                key={`${testimonial.name}-${index}`}
                                className="flex h-86 w-[min(690px,calc(100vw-48px))] shrink-0 flex-col rounded-3xl bg-[#F8F7F7] p-8 lg:p-10"
                            >
                                <div className="flex gap-1 text-xl text-[#F4C41C]" aria-label="5 out of 5 stars">
                                    {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
                                </div>
                                <p className="mt-6 max-w-145 font-inter text-lg leading-tight tracking-[-0.04em] text-grey lg:text-2xl">
                                    {testimonial.quote}
                                </p>
                                <div className="mt-auto flex items-center gap-4 border-t border-[#D9D9D9] pt-5">
                                    <img className="h-14 w-14 rounded-full object-cover" src={videoTestimoni} alt="" />
                                    <div>
                                        <h3 className="font-inter text-lg font-semibold text-grey lg:text-xl">{testimonial.name}</h3>
                                        <p className="font-inter text-sm text-primary lg:text-base">{testimonial.role}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LifeAtComp