import { useNavigate } from "react-router-dom"
import Button from "../../ui/Button"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"
import { HeroTitle } from "../../lib/text"

const Brand = () => {
    const navigate = useNavigate()
    const { brand } = useSection("home")

    return <div className="mx-auto mt-16 w-full max-w-420 px-6 md:px-12 lg:mt-24 lg:px-20 xl:px-28.75">
        {resolveImage(brand.headingImage) && (
            <img
                src={resolveImage(brand.headingImage)}
                alt="Our brands"
                className="mx-auto h-auto w-full max-w-350"
            />
        )}
        <div className="mt-16 flex flex-col items-center justify-center gap-12 lg:mt-40 lg:flex-row lg:items-center lg:gap-16 xl:mt-56.75">
            <div className="flex w-full max-w-200 flex-col gap-6 lg:gap-8">
                <h1 className="font-header text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95]">
                    <HeroTitle
                        before={brand.titleBefore}
                        highlight={brand.titleHighlight}
                        after={brand.titleAfter}
                        highlightClassName="text-primary"
                    />
                </h1>
                <p className="text-base leading-[1.35] text-grey md:text-2xl">{brand.description}</p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    {brand.stats.map((stat) => (
                        <div
                            key={stat.id}
                            className="w-full rounded-xl border border-border bg-primary/32 px-4 py-3 sm:max-w-63.5"
                        >
                            <h2 className="text-darkBlue text-4xl font-bold">{stat.value}</h2>
                            <p className="text-darkBlue text-base">{stat.label}</p>
                        </div>
                    ))}
                </div>
                <Button onClick={() => { navigate(brand.buttonPath) }}>{brand.buttonLabel}</Button>
            </div>
            {resolveImage(brand.image) && (
                <img
                    className="h-auto w-full max-w-160"
                    src={resolveImage(brand.image)}
                    alt="Digital Popular Brand Award"
                />
            )}
        </div>
    </div>
}

export default Brand
