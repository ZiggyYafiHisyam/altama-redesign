import { Link } from "react-router-dom"
import one from "../../assets/webGallery/satu.png"
import two from "../../assets/webGallery/dua.png"
import three from "../../assets/webGallery/tiga.png"
import four from "../../assets/webGallery/empat.png"
import five from "../../assets/webGallery/lima.png"
import six from "../../assets/webGallery/enam.png"
import seven from "../../assets/webGallery/tujuh.png"

const galleryImages = [
    { image: one, area: "a" },   // Press Conference
    { image: two, area: "b" },   // Challenge Your Skills
    { image: three, area: "d" }, // Lean Office Gathering
    { image: four, area: "f" },  // Motor / tenda
    { image: five, area: "g" },  // Jabat tangan
    { image: six, area: "e" },   // Speaker
    { image: seven, area: "c" }, // Tangan meraih rak
]

const WebGalleryComp = () => {
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
                    <header className="text-center text-white">
                        <h1 className="font-header text-4xl font-semibold tracking-[-0.04em] md:text-[56px]">
                            Moments from <span className="text-[#F4C41C]">Altama</span>
                        </h1>
                        <p className="mt-3 font-inter text-base text-white/75 md:text-xl">
                            Dokumentasi kegiatan, budaya kerja, dan perjalanan Altama.
                        </p>
                        <div className="mx-auto mt-8 flex w-fit rounded-full border-4 border-[#ACA9DF] bg-abu p-0.5">
                            <Link
                                className="h-11 rounded-full px-7 py-3 font-inter text-sm font-semibold text-grey transition-colors hover:bg-white md:text-base"
                                to="/gallery"
                            >
                                Instagram Gallery
                            </Link>
                            <Link
                                className="h-11 rounded-full bg-primary px-7 py-3 font-inter text-sm font-semibold text-white md:text-base"
                                to="/web-gallery"
                            >
                                Web Gallery
                            </Link>
                        </div>
                    </header>

                    {/* Grid dengan named areas: tidak akan ada celah kosong */}
                    <div
                        className="web-gallery-grid mx-auto mt-12 grid max-w-270 grid-cols-4 gap-4 md:mt-14 md:gap-5"
                        style={{
                            gridTemplateAreas: `
                                "a b b c"
                                "a d e c"
                                "f g e c"
                            `,
                            gridTemplateRows: "repeat(3, 180px)",
                        }}
                    >
                        {galleryImages.map(({ image, area }, index) => (
                            <div
                                key={image}
                                className="overflow-hidden rounded-3xl"
                                style={{ gridArea: area }}
                            >
                                <img
                                    className="h-full w-full object-cover"
                                    src={image}
                                    alt={`Altama web gallery ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-white px-6 py-16 md:px-12 md:py-20">
                <div className="mx-auto flex min-h-67.5 max-w-265 flex-col items-center justify-center rounded-3xl border border-[#ACA9DF] px-6 text-center">
                    <h2 className="font-header text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-primary md:text-[56px]">
                        Insights, Innovation, and Progress
                    </h2>
                    <p className="mt-4 max-w-121.75 font-inter text-base leading-[1.3] text-grey md:text-xl">
                        Temukan solusi terbaik untuk kebutuhan teknik, otomotif, dan industri Anda.
                    </p>
                    <Link className="mt-8 inline-flex h-15.25 w-53 items-center justify-center rounded-full bg-primary font-inter text-base font-semibold text-white" to="/detail-news">
                        Explore News
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default WebGalleryComp