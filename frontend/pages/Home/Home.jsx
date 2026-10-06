import CompanyPreview from "../../components/CompanyPreview"
import Footer from "../../components/Footer"
import Hero from "../../components/Hero"
import Navbar from "../../components/Navbar"
import carasip from "../../assets/motion/carasip.gif"
import Brand from "../../components/Brand/Brand"
import Grow from "../../components/Grow"
import yellowMotion from '../../assets/motion/yellowMotion.gif';
import Location from "../../components/Location"


const Home =()=>{
    return<>
        <Navbar />
        <Hero />
        <div id="profile">
            <CompanyPreview />
        </div>
        <div id="media-center" className="aspect-1921/421 w-full overflow-hidden">
            <img src={carasip} alt="" className="block w-full"/>
        </div>
        <div id="brand">
            <Brand />
        </div>
        
         <div className="w-full mt-46 overflow-hidden">
            <img
                src={yellowMotion}
                alt="Grow banner"
                className="block w-full aspect-1920/65 object-cover object-center"
            />
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