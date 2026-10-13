import GalleryHeader from "../GalleryHeader"
import NewsCta from "../NewsCta"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

// The mosaic's shape. Each letter is a slot an image claims through its `area`
// field, and the matching mobile layout lives in style/globals.css
// (.web-gallery-grid). Admin-side, the area is a dropdown over these letters.
const GRID_TEMPLATE_AREAS = `
    "a b b c"
    "a d e c"
    "f g e c"
`

const WebGalleryComp = () => {
    const gallery = useSection("gallery")

    return (
        <main>
            <section
                className="relative overflow-hidden bg-primary px-6 pb-12 pt-32 md:px-12 md:pb-16 md:pt-40"
                style={{ background: "linear-gradient(180deg, #353185 0%, #3F3A91 100%)" }}
            >
                <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[88px_88px]" />
                </div>

                <div className="relative mx-auto max-w-350">
                    <GalleryHeader active="web" />

                    <div
                        className="web-gallery-grid mx-auto mt-12 grid max-w-270 grid-cols-4 gap-4 md:mt-14 md:gap-5"
                        style={{
                            gridTemplateAreas: GRID_TEMPLATE_AREAS,
                            gridTemplateRows: "repeat(3, 180px)",
                        }}
                    >
                        {gallery.web.map((item, index) => (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-3xl bg-white/10"
                                style={{ gridArea: item.area }}
                            >
                                {resolveImage(item.image) && (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={resolveImage(item.image)}
                                        alt={item.caption || `Altama web gallery ${index + 1}`}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <NewsCta className="bg-white px-6 py-16 md:px-12 md:py-20" />
        </main>
    )
}

export default WebGalleryComp
