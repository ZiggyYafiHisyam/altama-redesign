import Brand from "../../components/Brand/Brand"
import CompanyPreview from "../../components/CompanyPreview"
import Footer from "../../components/Footer"
import Grow from "../../components/Grow"
import Hero from "../../components/Hero"
import Location from "../../components/Location"
import Navbar from "../../components/Navbar"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

const Home = () => {
    const { mediaBanner, growBanner } = useSection("home")

    return <>
        <Navbar />
        <Hero />
        <div id="profile">
            <CompanyPreview />
        </div>
        <div id="media-center" className="aspect-1921/421 w-full overflow-hidden">
            {resolveImage(mediaBanner.image) && (
                <img src={resolveImage(mediaBanner.image)} alt={mediaBanner.alt} className="block w-full" />
            )}
        </div>
        <div id="brand">
            <Brand />
        </div>

        <div className="w-full mt-46 overflow-hidden">
            {resolveImage(growBanner.image) && (
                <img
                    src={resolveImage(growBanner.image)}
                    alt={growBanner.alt}
                    className="block w-full aspect-1920/65 object-cover object-center"
                />
            )}
        </div>
        <div id="career">
            <Grow />
        </div>
        <div id="contact-us">
            <Location />
        </div>
        <Footer />
    </>
}

export default Home
