import { Navigate } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import HomeEditor from "./pages/HomeEditor"
import VisiMisiEditor from "./pages/VisiMisiEditor"
import AwardsEditor from "./pages/AwardsEditor"
import BoardEditor from "./pages/BoardEditor"
import LifeAtEditor from "./pages/LifeAtEditor"
import CareersEditor from "./pages/CareersEditor"
import GalleryEditor from "./pages/GalleryEditor"
import NewsEditor from "./pages/NewsEditor"
import BrandsEditor from "./pages/BrandsEditor"
import ContactEditor from "./pages/ContactEditor"
import IdentityEditor from "./pages/IdentityEditor"
import NavigationEditor from "./pages/NavigationEditor"
import Media from "./pages/Media"
import Inbox from "./pages/Inbox"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"

// Spread into the site's router (see routes/Route.jsx). /admin/login sits outside
// the layout because it is the one admin page you can reach without a session;
// everything under /admin goes through AdminLayout, which redirects there.
const adminRoutes = [
    {
        path: "/admin/login",
        element: <Login />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: "home", element: <HomeEditor /> },
            { path: "visi-misi", element: <VisiMisiEditor /> },
            { path: "awards", element: <AwardsEditor /> },
            { path: "board", element: <BoardEditor /> },
            { path: "life-at", element: <LifeAtEditor /> },
            { path: "careers", element: <CareersEditor /> },
            { path: "gallery", element: <GalleryEditor /> },
            { path: "news", element: <NewsEditor /> },
            { path: "brands", element: <BrandsEditor /> },
            { path: "contact", element: <ContactEditor /> },
            { path: "identity", element: <IdentityEditor /> },
            { path: "navigation", element: <NavigationEditor /> },
            { path: "media", element: <Media /> },
            { path: "inbox", element: <Inbox /> },
            { path: "analytics", element: <Analytics /> },
            { path: "settings", element: <Settings /> },
            // An unknown admin path lands on the dashboard rather than bouncing
            // out to the public site.
            { path: "*", element: <Navigate to="/admin" replace /> },
        ],
    },
]

export default adminRoutes
