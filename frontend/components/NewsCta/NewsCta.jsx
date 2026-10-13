import { useSection } from "../../lib/content"
import SmartLink from "../../ui/SmartLink"

// The "Insights, Innovation, and Progress" panel that closes the careers,
// gallery, brand and contact pages. One component so the four pages cannot drift
// apart, and one `cta` section in the content document to edit them all at once.
const NewsCta = ({ className = "bg-white px-6 py-18 md:px-12 md:py-22" }) => {
    const cta = useSection("cta")

    return (
        <section className={`relative overflow-hidden ${className}`}>
            <div className="mx-auto flex min-h-67.5 max-w-265 flex-col items-center justify-center rounded-3xl border border-[#ACA9DF] px-6 text-center">
                <h2 className="font-header text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-primary md:text-[56px]">
                    {cta.title}
                </h2>
                <p className="mt-4 max-w-121.75 font-inter text-base leading-[1.3] text-grey md:text-xl">
                    {cta.description}
                </p>
                <SmartLink
                    className="mt-8 inline-flex h-15.25 w-53 items-center justify-center rounded-full bg-primary font-inter text-base font-semibold text-white transition-transform hover:scale-105"
                    to={cta.buttonPath}
                >
                    {cta.buttonLabel}
                </SmartLink>
            </div>
        </section>
    )
}

export default NewsCta
