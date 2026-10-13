import { useRef } from "react"
import PageHero from "../PageHero"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

const LifeAtComp = () => {
    const lifeAt = useSection("lifeAt")
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
            <PageHero
                hero={lifeAt.hero}
                heightClassName="h-270"
                alignClassName="items-start"
                paddingClassName="px-8 pt-56 lg:px-27.25 lg:pt-72.25"
                chipClassName="bg-primary"
                titleClassName="max-w-190 font-semibold"
                subtitleClassName="max-w-170 leading-none"
            />

            <section className="overflow-hidden bg-white px-6 py-16 lg:px-27.25 lg:py-24">
                <div className="mx-auto max-w-422.5">
                    <p className="font-inter text-lg text-primary lg:text-2xl">{lifeAt.testimonialsEyebrow}</p>
                    <div className="mt-2 flex items-end justify-between gap-6">
                        <h2 className="max-w-155 font-header text-[clamp(2rem,3vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#121212]">
                            {lifeAt.testimonialsTitle}
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
                        {lifeAt.testimonials.map((testimonial) => {
                            const rating = Math.max(0, Math.min(5, Number(testimonial.rating) || 0))

                            return (
                                <article
                                    key={testimonial.id}
                                    className="flex h-86 w-[min(690px,calc(100vw-48px))] shrink-0 flex-col rounded-3xl bg-[#F8F7F7] p-8 lg:p-10"
                                >
                                    <div
                                        className="flex gap-1 text-xl text-[#F4C41C]"
                                        aria-label={`${rating} out of 5 stars`}
                                    >
                                        {Array.from({ length: rating }, (_, index) => (
                                            <span key={index}>★</span>
                                        ))}
                                    </div>
                                    <p className="mt-6 max-w-145 font-inter text-lg leading-tight tracking-[-0.04em] text-grey lg:text-2xl">
                                        {testimonial.quote}
                                    </p>
                                    <div className="mt-auto flex items-center gap-4 border-t border-[#D9D9D9] pt-5">
                                        {resolveImage(testimonial.avatar) && (
                                            <img
                                                className="h-14 w-14 rounded-full object-cover"
                                                src={resolveImage(testimonial.avatar)}
                                                alt=""
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-inter text-lg font-semibold text-grey lg:text-xl">{testimonial.name}</h3>
                                            <p className="font-inter text-sm text-primary lg:text-base">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LifeAtComp
