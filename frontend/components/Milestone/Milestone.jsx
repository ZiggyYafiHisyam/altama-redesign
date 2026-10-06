import { useRef } from "react"

const milestones = [
    {
        year: "2011",
        description: "Altama berdiri di Jakarta, memulai perjalanan sebagai distributor teknik.",
    },
    {
        year: "2015",
        description: "Perluasan jaringan distribusi ke lebih banyak kota besar.",
    },
    {
        year: "2018",
        description: "Penambahan produk baru: Tekiro Handtools, RYU Power Tools, Rexco Chemicals.",
    },
    {
        year: "2021",
        description: "Pertumbuhan bisnis dan penguatan jaringan distribusi nasional.",
    },
    {
        year: "2024",
        description: "Terus berkembang menghadirkan solusi terbaik untuk Indonesia.",
    },
]

const Milestone = () => {
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
        <section className="px-5 py-16 md:px-10 lg:px-14.5 lg:py-24">
            <div className="mx-auto max-w-422.5 overflow-hidden rounded-4xl bg-linear-to-br from-primary to-[#605BC3] py-9 text-white md:py-10 lg:py-11">
                <h2 className="font-inter text-center text-[34px] font-semibold leading-none tracking-[-0.04em] md:text-[40px]">
                    MILESTONE
                </h2>

                <div
                    ref={trackRef}
                    className="milestone-track mt-12 flex cursor-grab touch-pan-x select-none gap-6 overflow-x-auto px-12 pb-1 md:px-16 lg:mt-14 lg:px-12"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={stopDragging}
                    onPointerCancel={stopDragging}
                    aria-label="Company milestones"
                >
                    {milestones.map((milestone, index) => (
                        <article
                            key={milestone.year}
                            className={`flex h-36 ${index === 0 ? "w-[min(469px,calc(100vw-64px))]" : "w-[min(427px,calc(100vw-64px))]"} shrink-0 items-start gap-4 rounded-2xl px-5 py-5 lg:gap-4 lg:px-5 ${
                                index === 0
                                    ? "border-2 border-[#ACA9DF] bg-primary shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                                    : "bg-primary/40"
                            }`}
                        >
                            <span className="mt-2 h-4 w-4 shrink-0 rounded-full bg-[#ACA9DF] shadow-[0_0_10px_rgba(202,200,255,0.9)]" />
                            <div>
                                <h3 className="font-inter text-[24px] font-semibold leading-none tracking-[-0.04em] md:text-[26px] lg:text-[32px]">
                                    {milestone.year}
                                </h3>
                                <p className="mt-1 max-w-90 font-inter text-[16px] leading-tight tracking-[-0.04em] md:text-[18px] lg:text-[20px]">
                                    {milestone.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-white" />
                    <span className="h-3 w-3 rounded-full bg-[#ACA9DF]" />
                </div>
            </div>
        </section>
    )
}

export default Milestone