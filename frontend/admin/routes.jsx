import { Navigate } from "react-router-dom"
import AdminLayout from "./AdminLayout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ImagesEditor from "./pages/ImagesEditor"
import GalleryEditor from "./pages/GalleryEditor"
import Media from "./pages/Media"
import Inbox from "./pages/Inbox"
import Analytics from "./pages/Analytics"
import Settings from "./pages/Settings"

// Spread into the site's router (see routes/Route.jsx). /admin/login sits outside
// the layout because it is the one admin page you can reach without a session;
// everything under /admin goes through AdminLayout, which redirects there.
//
// The admin edits images and nothing else -- the site's copy lives in
// shared/defaultContent.js -- so there is one editor per kind of image: the fixed
// slots on each page (images), and the two galleries, which are lists you add to
// and delete from.
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
            // The images editor shows one page of the site at a time, picked in the
            // sidebar's "Site images" menu; /admin/images with no page opens the first.
            { path: "images", element: <ImagesEditor /> },
            { path: "images/:groupId", element: <ImagesEditor /> },
            { path: "gallery", element: <GalleryEditor /> },
            { path: "media", element: <Media /> },
            { path: "inbox", element: <Inbox /> },
            { path: "analytics", element: <Analytics /> },
            { path: "settings", element: <Settings /> },
            // An unknown admin path lands on the dashboard rather than bouncing
            // out to the public site. This also covers the per-page editors an
            // older build linked to (/admin/home, /admin/news, …).
            { path: "*", element: <Navigate to="/admin" replace /> },
        ],
    },
]

export default adminRoutes
