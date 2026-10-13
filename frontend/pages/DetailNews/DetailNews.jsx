import { useParams } from "react-router-dom"
import DetailNewsComp from "../../components/DetailNewsComp"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"
import { useSection } from "../../lib/content"

// Serves both /detail-news (the featured article) and /news/:slug (a specific
// one), so articles added in the admin get their own URL without a route change.
const DetailNews = () => {
    const { slug } = useParams()
    const news = useSection("news")

    const article = slug
        ? news.articles.find((item) => item.slug === slug)
        : news.articles.find((item) => item.featured) ?? news.articles[0]

    return <>
        <Navbar />
        {article ? (
            <DetailNewsComp article={article} />
        ) : (
            // An unknown slug, or an empty article list. Better a short, honest
            // page than a blank one or a redirect that loses the URL.
            <main className="mx-auto flex min-h-[60vh] max-w-250 flex-col items-center justify-center px-6 pt-24 text-center">
                <h1 className="font-header text-4xl font-semibold text-primary md:text-6xl">
                    Berita tidak ditemukan
                </h1>
                <p className="mt-4 font-inter text-lg text-grey">
                    Artikel yang Anda cari sudah tidak tersedia.
                </p>
            </main>
        )}
        <Footer />
    </>
}

export default DetailNews
