import { Navigate } from "react-router-dom"
import BrandDetailComp from "../../components/BrandDetailComp"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import { getBrandBySlug } from "../../lib/brands"

// One page shared by /brand/tekiro, /brand/rexco and /brand/ryu; the route
// passes the slug in. An unknown slug can only happen if a route and
// lib/brands.js disagree, so fall back to the home page's Brand section.
const BrandDetail = ({ slug }) => {
    const brand = getBrandBySlug(slug)

    if (!brand) return <Navigate to="/#brand" replace />

    return <>
        <Navbar />
        <BrandDetailComp brand={brand} />
        <Footer />
    </>
}

export default BrandDetail
