import { createBrowserRouter, Navigate } from "react-router-dom"
import { logPageView } from "../lib/api"
import Home from "../pages/Home"
import BrandDetail from "../pages/BrandDetail"
import VisiMisi from "../pages/VisiMisi"
import Award from "../pages/Award"
import Board from "../pages/Board"
import LifeAt from "../pages/LifeAt"
import GrowWith from "../pages/GrowWith"
import ContactUs from "../pages/ContactUs"
import Terimakasih from "../pages/Terimakasih"
import IgGalerry from "../pages/IgGalerry"
import WebGallery from "../pages/WebGallery"
import DetailNews from "../pages/DetailNews"
import adminRoutes from "../admin/routes"

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/visi-misi',
        element: <VisiMisi />,
    },
    // Brands are content (see the `brands` section of the content document), so
    // one dynamic route covers however many the admin defines; an unknown slug
    // renders the page's own "not found" state.
    {
        path: '/brand/:slug',
        element: <BrandDetail />,
    },
    {
        path: '/award',
        element: <Award />,
    },
    {
        path: '/board',
        element: <Board />,
    },
    {
        path: '/life-at',
        element: <LifeAt />,
    },
    {
        path: '/grow-with',
        element: <GrowWith />,
    },
    {
        path: '/contact-us',
        element: <ContactUs />,
    },
    {
        path: '/terimakasih',
        element: <Terimakasih />,
    },
    {
        path: '/gallery',
        element: <IgGalerry />,
    },
    {
        path: '/web-gallery',
        element: <WebGallery />,
    },
    // /detail-news opens whichever article is flagged `featured`; /news/:slug
    // opens a specific one. Both render the same page.
    {
        path: '/detail-news',
        element: <DetailNews />,
    },
    {
        path: '/news/:slug',
        element: <DetailNews />,
    },
    ...adminRoutes,
    // Anything unrecognised goes home instead of rendering a blank screen.
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
])

// Logs every page the visitor opens, including the very first one on load and
// every client-side navigation afterward (this is a single-page app, so only
// the first load ever reaches the backend on its own -- everything else needs
// to be reported explicitly like this).
let lastLoggedPath = null

function reportPageView(pathname, search) {
    // The admin panel is staff using the CMS, not visitors reading the site, so
    // it stays out of the analytics the admin itself reports on.
    if (pathname.startsWith("/admin")) return

    const fullPath = `${pathname}${search}`
    if (fullPath === lastLoggedPath) return
    lastLoggedPath = fullPath
    logPageView(fullPath, document.referrer || null).catch(() => {
        // Logging is best-effort and should never block navigation.
    })
}

reportPageView(router.state.location.pathname, router.state.location.search)
router.subscribe((state) => {
    reportPageView(state.location.pathname, state.location.search)
})

export default router
