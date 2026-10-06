import ourBrand from "../../assets/brand/ourBrand.png"
import award from "../../assets/brand/award.png"
import Button from "../../ui/Button"
import { useNavigate } from "react-router-dom"


const Brand = ()=>{

    const navigate = useNavigate();

    return <div className="mx-auto mt-16 w-full max-w-420 px-6 md:px-12 lg:mt-24 lg:px-20 xl:px-28.75">
        <img src={ourBrand} alt="Our brands" className="mx-auto h-auto w-full max-w-350"/>
        <div className="mt-16 flex flex-col items-center justify-center gap-12 lg:mt-40 lg:flex-row lg:items-center lg:gap-16 xl:mt-56.75">
            <div className="flex w-full max-w-200 flex-col gap-6 lg:gap-8">
                <h1 className="font-header text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95]">DIGITAL<span className="text-primary"> POPULER BRAND</span> AWARD 2023</h1>
                <p className="text-base leading-[1.35] text-grey md:text-2xl">Tahun ini kembali PT.Altama Surya Anugerah mengawinkan Digital Populer Brand Award 2023 untuk brand Tekiro kategori Handtools dan Ryu kategori Powertools.</p>
                <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-full rounded-xl border border-border bg-primary/32 px-4 py-3 sm:max-w-63.5">
                    <h2 className="text-darkBlue text-4xl font-bold">7</h2>
                    <p className="text-darkBlue text-base">Penghargaan yang diterima brand Tekiro</p>
                </div>
                <div className="w-full rounded-xl border border-border bg-primary/32 px-4 py-3 sm:max-w-63.5">
                    <h2 className="text-darkBlue text-4xl font-bold">3</h2>
                    <p className="text-darkBlue text-base">Penghargaan yang diterima Ryu berturut-turut</p>
                </div>
                </div>
                <Button onClick={()=>{navigate('/award')}}>Read More</Button>
            </div>
            <img className="h-auto w-full max-w-160" src={award} alt="Digital Popular Brand Award" />
        </div>
    </div>
}

export default Brand