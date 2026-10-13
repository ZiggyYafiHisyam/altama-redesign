import { Link } from "react-router-dom"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

// Renders one article plus the "Latest News" rail. The page picks which article
// (see pages/DetailNews), so adding one in the admin is enough to publish it.
const DetailNewsComp = ({ article }) => {
    const news = useSection("news")

    // Everything except the one on screen, newest entries first in list order.
    const others = news.articles.filter((item) => item.id !== article.id)

    return (
        <main className="bg-white px-4 pb-16 pt-24 sm:px-6 md:px-12 md:pb-20 lg:px-20">
            <div className="mx-auto max-w-420">
                {resolveImage(article.heroImage) && (
                    <img
                        className="block h-auto w-full rounded-3xl"
                        src={resolveImage(article.heroImage)}
                        alt={article.title}
                    />
                )}

                <div className="mt-8 grid items-start gap-10 md:mt-10 md:gap-14 lg:grid-cols-[minmax(0,1fr)_35.5rem] lg:gap-20">
                    <article>
                        <h1 className="font-header text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#121212]">
                            {article.title}
                        </h1>
                        <p className="mt-6 max-w-250 font-inter text-lg leading-tight text-grey md:text-2xl">
                            {article.excerpt}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            {(article.tags ?? []).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-lg bg-[#F0F0F8] px-3 py-2 font-inter text-sm text-primary md:text-base"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-10 space-y-7">
                            {(article.sections ?? []).map((section) => (
                                <section key={section.id}>
                                    <h2 className="font-header text-xl font-semibold leading-none text-primary md:text-2xl">
                                        {section.title}
                                    </h2>
                                    <div className="mt-3 space-y-3 font-inter text-base leading-tight text-[#121212] md:text-lg">
                                        {(section.paragraphs ?? []).map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </article>

                    <aside>
                        <h2 className="font-header text-2xl font-semibold leading-none text-[#121212] md:text-3xl">
                            {news.latestTitle}
                        </h2>
                        <div className="mt-7 space-y-7">
                            {others.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/news/${item.slug}`}
                                    className="block overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(18,18,18,0.08)] transition-transform hover:scale-[1.01]"
                                >
                                    {resolveImage(item.heroImage) && (
                                        <img
                                            className="block h-auto w-full"
                                            src={resolveImage(item.heroImage)}
                                            alt={item.title}
                                        />
                                    )}
                                    <div className="px-5 pb-6 pt-4">
                                        <h3 className="font-header text-xl font-semibold leading-none text-primary md:text-2xl">
                                            {item.title}
                                        </h3>
                                        <p className="mt-3 font-inter text-base leading-[1.2] text-grey md:text-lg">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default DetailNewsComp
