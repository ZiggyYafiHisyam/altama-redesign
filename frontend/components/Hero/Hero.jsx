import hero from "../../assets/hero/hero.png"
import { Link } from "react-router-dom"
import lineVertical from "../../assets/hero/lineVertikal.svg"
import logoBrand from "../../assets/hero/logoBrand.png"
import alva from "../../assets/hero/ALVA.png"

const Hero = ()=>{
    return <section
        className="relative h-[clamp(620px,56.25vw,1080px)] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
    >
        <div
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary to-primary/20"
            aria-hidden="true"
        />
        <img
            className="pointer-events-none absolute bottom-0 left-27.25 hidden md:block"
            src={lineVertical}
            alt=""
            aria-hidden="true"
        />
        <div className="relative z-10 px-6 pt-40 md:px-16 md:pt-56 lg:px-27.25 lg:pt-72.25">
            <div className="flex w-fit items-center justify-center rounded-[65px] border border-border bg-primary px-5 py-2">
                <span className="text-2xl text-white">#AltamaGueBanget</span>
            </div>
            <h1 className="mt-8 max-w-186.5 font-header text-[clamp(2.8rem,5.7vw,5.125rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white">
                THE POWER OF
                <br />
                <span className="rounded-md bg-[#F4C41C] px-2">INNOVATION</span> FOR A
                <br />
                STRONGER NATION.
            </h1>
            <p className="mt-6 max-w-167.5 font-inter text-[clamp(1rem,2.2vw,2rem)] font-normal leading-tight tracking-[-0.04em] text-abu">
                Your partner in progress, empowering every
                <br className="hidden md:block" />
                step toward Indonesia’s success.
            </p>
        </div>
        <img
            className="absolute bottom-8 left-6 z-10 w-40 md:bottom-14 md:left-16 md:w-auto lg:left-29.5"
            src={logoBrand}
            alt="Tekiro, Rexco, and Ryu"
        />
        <Link
            className="alva-breathe fixed bottom-3 right-3 z-10 block focus-visible:outline-3 focus-visible:outline-white focus-visible:outline-offset-4 md:bottom-5 md:right-8 lg:right-20"
            to="/contact-us"
            aria-label="Contact Us with Alva"
        >
            <img className="block h-32 w-24 object-contain md:h-71.5 md:w-54" src={alva} alt="Alva" />
        </Link>
    </section>
}

export default Hero