import { RouterProvider } from "react-router-dom"
import router from "./routes/Route"
import ContentProvider from "./lib/ContentProvider"
import AdminAuthProvider from "./admin/AdminAuthProvider"

// Both providers sit above the router: the content one because every public page
// reads from it, and the admin auth one because the admin routes and the login
// screen both need it.
function App() {
    return (
        <ContentProvider>
            <AdminAuthProvider>
                <RouterProvider router={router} />
            </AdminAuthProvider>
        </ContentProvider>
    )
}

export default App
