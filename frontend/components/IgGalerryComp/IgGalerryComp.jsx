import GalleryHeader from "../GalleryHeader"
import NewsCta from "../NewsCta"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"
import SmartLink from "../../ui/SmartLink"

// One gallery tile. A post with no image yet renders the translucent placeholder
// the page shipped with, so the grid keeps its shape while the real photos are
// still being collected.
const Tile = ({ post }) => {
    const image = resolveImage(post.image)

    const tile = image ? (
        <img
            className="h-full w-full object-cover"
            src={image}
            alt={post.caption || ""}
            loading="lazy"
        />
    ) : null

    const className = "aspect-405/629 overflow-hidden rounded-3xl border border-white/10 bg-white/10"

    if (post.link) {
        return (
            <a
                className={`${className} block transition-transform hover:scale-[1.02]`}
                href={post.link}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={post.caption || "Instagram post"}
            >
                {tile}
            </a>
        )
    }

    return (
        <div className={className} aria-label={post.caption || undefined}>
            {tile}
        </div>
    )
}

const IgGalerryComp = () => {
    const gallery = useSection("gallery")

    return (
        <main>
            <section
                className="relative overflow-hidden bg-primary px-6 pb-12 pt-32 md:px-12 md:pb-16 md:pt-40"
                style={{
                    background: "linear-gradient(180deg, #353185 0%, #3F3A91 100%)",
                }}
            >
                <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[88px_88px]" />
                </div>

                <div className="relative mx-auto max-w-350">
                    <GalleryHeader active="instagram" />

                    <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 lg:mt-14 lg:gap-6">
                        {gallery.instagram.map((post) => (
                            <Tile key={post.id} post={post} />
                        ))}
                    </div>

                    <div className="flex justify-center pt-10 lg:pt-14">
                        <SmartLink
                            className="inline-flex h-13 items-center rounded-full border-4 border-[#ACA9DF] bg-white px-8 font-inter text-sm font-semibold text-primary transition-transform hover:scale-105 md:text-base"
                            to={gallery.instagramButtonUrl}
                        >
                            {gallery.instagramButtonLabel} <span className="ml-2 text-lg">›</span>
                        </SmartLink>
                    </div>
                </div>
            </section>

            <NewsCta className="bg-white px-6 py-16 md:px-12 md:py-20" />
        </main>
    )
}

export default IgGalerryComp
