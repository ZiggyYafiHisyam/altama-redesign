import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"
import { HeroTitle, Multiline } from "../../lib/text"

// The photo-backed hero shared by /award, /board and /life-at: brand chips, a
// two-tone heading, a subtitle and the hashtag pill. Each page passes its own
// `hero` object from the content document.
//
// The layout props exist because /life-at uses a taller, top-aligned version of
// the same hero. They REPLACE the defaults rather than being appended, since two
// competing Tailwind utilities for one property (h-270 vs h-[clamp(...)]) would
// otherwise resolve by stylesheet order, not by call site.
const PageHero = ({
    hero,
    heightClassName = "h-[clamp(520px,56.25vw,1080px)] min-h-162.5",
    alignClassName = "items-center",
    paddingClassName = "px-8 pt-20 lg:px-28.75 lg:pt-40",
    chipClassName = "bg-[#605BC3]/80",
    titleClassName = "",
    subtitleClassName = "",
}) => {
    const site = useSection("site")

    return (
        <section
            className={`relative flex overflow-hidden bg-cover bg-center ${heightClassName} ${alignClassName}`}
            style={{ backgroundImage: `url(${resolveImage(hero.backgroundImage)})` }}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary to-primary/20"
                aria-hidden="true"
            />
            <div className={`relative z-10 w-full ${paddingClassName}`}>
                <div className="flex flex-wrap gap-3">
                    {(site.brandChips ?? []).map((chip) => (
                        <span
                            key={chip}
                            className={`rounded-md px-3 py-2 font-header text-xl font-bold text-white lg:text-2xl ${chipClassName}`}
                        >
                            {chip}
                        </span>
                    ))}
                </div>
                <h1
                    className={`mt-8 font-header text-[clamp(3rem,5.7vw,6.5rem)] font-medium leading-[0.93] tracking-[-0.04em] text-white ${titleClassName}`}
                >
                    <HeroTitle
                        before={hero.titleBefore}
                        highlight={hero.titleHighlight}
                        after={hero.titleAfter}
                        highlightClassName="rounded-md bg-[#F4C41C] px-2"
                    />
                </h1>
                <p
                    className={`mt-7 font-inter text-[clamp(1rem,1.3vw,2rem)] text-white/85 ${subtitleClassName}`}
                >
                    <Multiline text={hero.subtitle} />
                </p>
                {hero.badge && (
                    <span className="mt-8 inline-flex rounded-full border border-white/40 px-4 py-2 font-inter text-sm text-white lg:text-lg">
                        {hero.badge}
                    </span>
                )}
            </div>
        </section>
    )
}

export default PageHero
