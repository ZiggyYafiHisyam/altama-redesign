import Button from "../../ui/Button"
import image from "../../assets/company/image.png"
import companyOverview from "../../assets/company/companyOverview.svg"
import category from "../../assets/company/category.svg"
import { useNavigate } from "react-router-dom"

const CompanyPreview =()=>{
    const navigate = useNavigate();


    return <div className="mx-auto flex w-full max-w-420 flex-col items-center gap-10 px-6 py-16 md:px-12 lg:flex-row lg:justify-center lg:gap-20 lg:px-20 lg:py-24 xl:gap-45 xl:px-28.75">
        <img className="w-full max-w-120" src={image} alt="" />
        <div className="flex w-full max-w-208.25 flex-col gap-6">
            <img src={companyOverview} alt="Company Overview" className="h-auto w-full max-w-80" />
            <h1 className="font-header text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.93] tracking-[-0.04em]">
                <span className="text-primary">PT Altama Surya Anugerah</span> adalah distributor resmi merek Tekiro, RYU, dan Rexco di Indonesia.
            </h1>
            <p className="text-base leading-[1.35] text-grey md:text-2xl">Kami menghadirkan perkakas, mesin, dan chemical berkualitas tinggi yang kokoh, inovatif, dan terpercaya. Dengan jaringan distribusi luas, kami menjadi mitra bagi para profesional maupun individu dalam mendukung berbagai kebutuhan.</p>
            <img src={category} alt="Tekiro, Ryu, dan Rexco" className="h-auto w-full max-w-140" />
            <Button className="mt-2 w-full max-w-51 md:mt-7" onClick={()=>{navigate('/visi-misi')}} >Read More</Button>
        </div>

    </div>
}

export default CompanyPreview