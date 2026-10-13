import { useNavigate } from "react-router-dom"
import Button from "../../ui/Button"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

const CompanyPreview = () => {
    const navigate = useNavigate()
    const { companyPreview } = useSection("home")

    return <div className="mx-auto flex w-full max-w-420 flex-col items-center gap-10 px-6 py-16 md:px-12 lg:flex-row lg:justify-center lg:gap-20 lg:px-20 lg:py-24 xl:gap-45 xl:px-28.75">
        {resolveImage(companyPreview.sideImage) && (
            <img className="w-full max-w-120" src={resolveImage(companyPreview.sideImage)} alt="" />
        )}
        <div className="flex w-full max-w-208.25 flex-col gap-6">
            {resolveImage(companyPreview.headingImage) && (
                <img
                    src={resolveImage(companyPreview.headingImage)}
                    alt="Company Overview"
                    className="h-auto w-full max-w-80"
                />
            )}
            <h1 className="font-header text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.93] tracking-[-0.04em]">
                <span className="text-primary">{companyPreview.titleHighlight}</span>
                {companyPreview.titleRest}
            </h1>
            <p className="text-base leading-[1.35] text-grey md:text-2xl">{companyPreview.description}</p>
            {resolveImage(companyPreview.categoryImage) && (
                <img
                    src={resolveImage(companyPreview.categoryImage)}
                    alt=""
                    className="h-auto w-full max-w-140"
                />
            )}
            <Button
                className="mt-2 w-full max-w-51 md:mt-7"
                onClick={() => { navigate(companyPreview.buttonPath) }}
            >
                {companyPreview.buttonLabel}
            </Button>
        </div>
    </div>
}

export default CompanyPreview
