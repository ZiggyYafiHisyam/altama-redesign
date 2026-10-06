
import logoBrand from "../../assets/hero/logoBrand.png"
import heroVisi from "../../assets/hero/heroVisi.png"

const HeroVisiMisi =()=>{
    return <section
            className="relative h-[clamp(620px,56.25vw,1080px)] overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url(${heroVisi})` }}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary to-primary/20"
                aria-hidden="true"
            />
            <div className="relative z-10 px-6 pt-40 md:px-16 md:pt-56 lg:px-27.25 lg:pt-80">
                <img
                className="absolute left-6 top-28 z-10 w-40 md:left-16 md:top-40 md:w-auto lg:left-29.5 lg:top-58"
                src={logoBrand}
                alt="Tekiro, Rexco, and Ryu"
            />
            
                <h1 className="mt-8 max-w-186.5 font-header text-[clamp(2.6rem,5.7vw,5.125rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white">
                    Our Vision, Mission & 
                    <br />
                    <span className="rounded-md bg-[#F4C41C] px-2 py-1">Company Values</span>
                </h1>
                <p className="mt-6 max-w-167.5 font-inter text-[clamp(1rem,2.2vw,2rem)] font-normal leading-tight tracking-[-0.04em] text-abu">
                    Fondasi yang membentuk Altama Surya Anugerah 
                    <br className="hidden md:block" />
                    sdalam berkarya dan berkembang.
                </p>
                <div className="flex w-fit items-center justify-center rounded-[65px] border border-border bg-primary px-5 py-2 mt-10">
                    <span className="text-base text-white md:text-2xl">#AltamaGueBanget</span>
                </div>
            </div>
           
        </section>
}

export default HeroVisiMisi