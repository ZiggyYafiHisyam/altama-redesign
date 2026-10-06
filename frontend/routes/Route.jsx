import { createBrowserRouter } from "react-router-dom"
import { logPageView } from "../lib/api"
import Home from "../pages/Home"
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

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/visi-misi',
        element: <VisiMisi />,
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
    {
        path: '/detail-news',
        element: <DetailNews />,
    },
])

// Logs every page the visitor opens, including the very first one on load and
// every client-side navigation afterward (this is a single-page app, so only
// the first load ever reaches the backend on its own -- everything else needs
// to be reported explicitly like this).
let lastLoggedPath = null

function reportPageView(pathname, search) {
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