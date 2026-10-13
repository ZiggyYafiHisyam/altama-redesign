import { Link } from "react-router-dom"
import { useSection } from "../../lib/content"
import { HeroTitle } from "../../lib/text"

// Heading and the Instagram/Web tab switch shared by /gallery and /web-gallery.
// `active` says which tab is the current page, and therefore which one is filled
// in rather than a link-coloured pill.
const GalleryHeader = ({ active }) => {
    const gallery = useSection("gallery")

    const tabs = [
        { key: "instagram", label: gallery.instagramTabLabel, to: "/gallery" },
        { key: "web", label: gallery.webTabLabel, to: "/web-gallery" },
    ]

    return (
        <header className="text-center text-white">
            <h1 className="font-header text-4xl font-semibold tracking-[-0.04em] md:text-[56px]">
                <HeroTitle
                    before={gallery.titleBefore}
                    highlight={gallery.titleHighlight}
                    highlightClassName="text-[#F4C41C]"
                />
            </h1>
            <p className="mt-3 font-inter text-base text-white/75 md:text-xl">{gallery.subtitle}</p>

            <div className="mx-auto mt-8 flex w-fit rounded-full border-4 border-[#ACA9DF] bg-abu p-0.5">
                {tabs.map((tab) => (
                    <Link
                        key={tab.key}
                        className={
                            tab.key === active
                                ? "h-11 rounded-full bg-primary px-7 py-3 font-inter text-sm font-semibold text-white md:text-base"
                                : "h-11 rounded-full px-7 py-3 font-inter text-sm font-semibold text-grey transition-colors hover:bg-white md:text-base"
                        }
                        to={tab.to}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </header>
    )
}

export default GalleryHeader
