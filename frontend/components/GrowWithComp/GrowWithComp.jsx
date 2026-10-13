import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../ui/Button/Button"
import NewsCta from "../NewsCta"
import { useSection } from "../../lib/content"
import { HeroTitle } from "../../lib/text"

const GrowWithComp = () => {
    const navigate = useNavigate()
    const careers = useSection("careers")
    const [query, setQuery] = useState("")

    const term = query.trim().toLowerCase()
    const jobs = term
        ? careers.jobs.filter((job) =>
            `${job.title} ${job.description}`.toLowerCase().includes(term))
        : careers.jobs

    return (
        <main>
            <section
                className="relative overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-18 md:pt-43"
                style={{
                    background: "linear-gradient(180deg, #353185 0%, #4B45A1 100%)",
                }}
            >
                <div className="absolute inset-0 opacity-25" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[88px_88px]" />
                </div>

                <div className="relative mx-auto max-w-350">
                    <h1 className="text-center font-header text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-white">
                        <HeroTitle
                            before={careers.hero.titleBefore}
                            highlight={careers.hero.titleHighlight}
                            after={careers.hero.titleAfter}
                            highlightClassName="text-[#F4C41C]"
                        />
                    </h1>

                    <div className="mx-auto mt-7 flex h-13.5 w-full max-w-196.25 items-center rounded-full border border-white/40 bg-white px-4">
                        <input
                            type="search"
                            placeholder={careers.hero.searchPlaceholder}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="min-w-0 flex-1 bg-transparent font-inter text-sm text-grey outline-none placeholder:text-[#999] md:text-base"
                            aria-label="Search job position"
                        />
                        <span
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                            aria-hidden="true"
                        >
                            ⌕
                        </span>
                    </div>

                    <div className="mx-auto mt-10 grid max-w-350 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <article
                                key={job.id}
                                className="flex min-h-45 flex-col rounded-3xl bg-[#F8F8F8] p-5 shadow-[0_4px_0_rgba(22,22,22,0.08)] md:min-h-50 md:p-6"
                            >
                                <h2 className="font-header text-xl font-semibold leading-tight text-[#121212]">
                                    {job.title}
                                </h2>
                                <p className="mt-2 font-inter text-sm leading-[1.35] text-grey">
                                    {job.description}
                                </p>
                                <Button
                                    className="mt-auto h-10 w-36 text-sm font-semibold md:h-12 md:w-40 md:text-base"
                                    onClick={() => navigate(job.applyPath || "/contact-us")}
                                >
                                    {careers.applyLabel}
                                </Button>
                            </article>
                        ))}
                    </div>

                    {jobs.length === 0 && (
                        <p className="mt-12 text-center font-inter text-lg text-white/80">
                            Tidak ada posisi yang cocok dengan pencarian Anda.
                        </p>
                    )}
                </div>
            </section>

            <NewsCta />
        </main>
    )
}

export default GrowWithComp
