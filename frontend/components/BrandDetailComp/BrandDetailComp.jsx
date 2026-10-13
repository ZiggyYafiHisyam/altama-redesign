import { Link } from "react-router-dom"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

// Product tiles fall back to empty placeholders, the same way the gallery pages
// do, so a brand reads as finished before its product shots are uploaded.
const PLACEHOLDER_COUNT = 8

const BrandDetailComp = ({ brand }) => {
    const brands = useSection("brands")
    const otherBrands = brands.items.filter((item) => item.slug !== brand.slug)

    const products = brand.products?.length
        ? brand.products
        : Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => ({ id: `placeholder-${index}` }))

    return (
        <main>
            <section
                className="relative overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-16 md:pt-40"
                style={{
                    background: "linear-gradient(180deg, #353185 0%, #3F3A91 100%)",
                }}
            >
                <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[88px_88px]" />
                </div>

                <div className="relative mx-auto max-w-350">
                    <nav className="mb-8 font-inter text-sm text-white/70 md:text-base" aria-label="Breadcrumb">
                        <Link className="underline decoration-white/40 underline-offset-4 hover:opacity-70" to="/#brand">
                            Brand
                        </Link>
                        <span className="mx-2" aria-hidden="true">
                            /
                        </span>
                        <span className="text-white">{brand.name}</span>
                    </nav>

                    <header className="max-w-200 text-white">
                        <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 font-inter text-sm font-semibold uppercase tracking-wide md:text-base">
                            {brand.category}
                        </span>
                        <h1 className="mt-6 font-header text-5xl font-semibold tracking-[-0.04em] md:text-[80px] md:leading-[0.95]">
                            {brand.name}
                        </h1>
                        <p className="mt-4 font-header text-xl text-[#F4C41C] md:text-3xl">{brand.tagline}</p>
                        <p className="mt-6 font-inter text-base leading-[1.45] text-white/80 md:text-xl">
                            {brand.description}
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Link
                                className="inline-flex h-13 items-center justify-center rounded-full bg-white px-8 font-inter text-base font-semibold text-primary transition-transform hover:scale-105"
                                to="/contact-us"
                            >
                                {brands.contactButtonLabel}
                            </Link>
                            <Link
                                className="inline-flex h-13 items-center justify-center rounded-full border-2 border-white/50 px-8 font-inter text-base font-semibold text-white transition-colors hover:bg-white/10"
                                to="/award"
                            >
                                {brands.awardButtonLabel}
                            </Link>
                        </div>
                    </header>

                    <div className="mt-14 grid gap-4 sm:grid-cols-3 md:gap-6">
                        {(brand.highlights ?? []).map((highlight) => (
                            <div
                                key={highlight.id}
                                className="rounded-xl border border-white/20 bg-white/10 px-5 py-4"
                            >
                                <h2 className="font-header text-4xl font-bold text-white">{highlight.value}</h2>
                                <p className="mt-1 font-inter text-base text-white/75">{highlight.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-16 md:px-12 md:py-20">
                <div className="mx-auto max-w-350">
                    <h2 className="font-header text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-primary md:text-[56px]">
                        {brands.productsTitlePrefix} {brand.name}
                    </h2>
                    <p className="mt-3 max-w-150 font-inter text-base leading-[1.3] text-grey md:text-xl">
                        Jelajahi rangkaian produk {brand.name} untuk kebutuhan teknik, otomotif, dan industri Anda.
                    </p>

                    <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5 lg:gap-6">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="aspect-square overflow-hidden rounded-3xl border border-abu bg-abu/60"
                                aria-label={product.name || `${brand.name} product placeholder ${index + 1}`}
                            >
                                {resolveImage(product.image) && (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={resolveImage(product.image)}
                                        alt={product.name || ""}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 pb-20 md:px-12">
                <div className="mx-auto max-w-350 rounded-3xl border border-[#ACA9DF] px-6 py-12 text-center md:py-16">
                    <h2 className="font-header text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-primary md:text-[56px]">
                        {brands.otherBrandsTitle}
                    </h2>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        {otherBrands.map((item) => (
                            <Link
                                key={item.id}
                                className="inline-flex h-15.25 w-full max-w-63.5 items-center justify-center rounded-full bg-primary font-inter text-base font-semibold text-white transition-transform hover:scale-105"
                                to={`/brand/${item.slug}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default BrandDetailComp
