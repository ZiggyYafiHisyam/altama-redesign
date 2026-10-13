import { useParams } from "react-router-dom"
import BrandDetailComp from "../../components/BrandDetailComp"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import { useContent, useSection } from "../../lib/content"

// One page for every /brand/:slug. Brands are content now, so a brand added in
// the admin gets its page immediately -- there is no route to add.
const BrandDetail = () => {
    const { slug } = useParams()
    const brands = useSection("brands")
    const { isLoading } = useContent()

    const brand = brands.items.find((item) => item.slug === slug)

    return <>
        <Navbar />
        {brand ? (
            <BrandDetailComp brand={brand} />
        ) : (
            <main className="mx-auto flex min-h-[60vh] max-w-250 flex-col items-center justify-center px-6 pt-24 text-center">
                {/* While the first content fetch is in flight the brand list is
                    only the bundled default, so say nothing rather than claim a
                    brand that is about to arrive does not exist. */}
                {isLoading ? null : (
                    <>
                        <h1 className="font-header text-4xl font-semibold text-primary md:text-6xl">
                            Brand tidak ditemukan
                        </h1>
                        <p className="mt-4 font-inter text-lg text-grey">
                            Brand yang Anda cari sudah tidak tersedia.
                        </p>
                    </>
                )}
            </main>
        )}
        <Footer />
    </>
}

export default BrandDetail
