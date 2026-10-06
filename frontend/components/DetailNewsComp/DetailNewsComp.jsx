import newsHero from "../../assets/news/newsSatu.png"
import latestNewsImage from "../../assets/news/newsDua.png"
import latestNewsImageTwo from "../../assets/news/newsTiga.png"

const articleSections = [
    {
        title: "Digital Popular Brand Award 2023",
        paragraphs: [
            "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools dan RYU kategori Power tools. Penghargaan ini menjadi bukti atas kepercayaan konsumen terhadap kualitas dan konsistensi produk yang dihadirkan.",
        ],
    },
    {
        title: "Pengakuan atas Kualitas dan Kepercayaan",
        paragraphs: [
            "Penghargaan yang diterima merupakan bentuk apresiasi terhadap kekuatan brand Tekiro dan RYU di pasar nasional. Produk-produk Altama dinilai memiliki kualitas yang terjaga serta relevan dengan kebutuhan profesional maupun pengguna rumahan.",
        ],
    },
    {
        title: "Komitmen Altama ke Depan",
        paragraphs: [
            "Altama Surya Anugerah terus berkomitmen menghadirkan produk berkualitas tinggi serta memperluas jaringan distribusi di Indonesia. Penghargaan ini menjadi motivasi untuk terus berinovasi dan memberikan layanan terbaik bagi pelanggan.",
            "Penghargaan yang diterima merupakan bentuk apresiasi terhadap kekuatan brand Tekiro dan RYU di pasar nasional. Produk-produk Altama dinilai memiliki kualitas yang terjaga serta relevan dengan kebutuhan profesional maupun pengguna rumahan.",
        ],
    },
    {
        title: "Digital Popular Brand Award 2023",
        paragraphs: [
            "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools dan RYU kategori Power tools. Penghargaan ini menjadi bukti atas kepercayaan konsumen terhadap kualitas dan konsistensi produk yang dihadirkan.",
        ],
    },
]

const latestNews = [
    {
        image: latestNewsImage,
        title: "Event Tekiro, Rexco, RYU di PRJ 2023",
        description: "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools...",
    },
    {
        image: latestNewsImageTwo,
        title: "Tekiro Mechanic Competition 2023",
        description: "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools...",
    },
]

const DetailNewsComp = () => {
    return (
        <main className="bg-white px-4 pb-16 pt-24 sm:px-6 md:px-12 md:pb-20 lg:px-20">
            <div className="mx-auto max-w-420">
                <img
                    className="block h-auto w-full rounded-3xl"
                    src={newsHero}
                    alt="Altama menerima penghargaan Digital Popular Brand Award 2023"
                />

                <div className="mt-8 grid items-start gap-10 md:mt-10 md:gap-14 lg:grid-cols-[minmax(0,1fr)_35.5rem] lg:gap-20">
                    <article>
                        <h1 className="font-header text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#121212]">
                            DIGITAL POPULAR BRAND AWARD 2023
                        </h1>
                        <p className="mt-6 max-w-250 font-inter text-lg leading-tight text-grey md:text-2xl">
                            PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro dan RYU sebagai bukti kepercayaan konsumen.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            {["12 Januari 2024", "Award", "Tekiro, RYU, Brand Recognition"].map((tag) => (
                                <span key={tag} className="rounded-lg bg-[#F0F0F8] px-3 py-2 font-inter text-sm text-primary md:text-base">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-10 space-y-7">
                            {articleSections.map((section, index) => (
                                <section key={`${section.title}-${index}`}>
                                    <h2 className="font-header text-xl font-semibold leading-none text-primary md:text-2xl">
                                        {section.title}
                                    </h2>
                                    <div className="mt-3 space-y-3 font-inter text-base leading-tight text-[#121212] md:text-lg">
                                        {section.paragraphs.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </article>

                    <aside>
                        <h2 className="font-header text-2xl font-semibold leading-none text-[#121212] md:text-3xl">
                            Latest News
                        </h2>
                        <div className="mt-7 space-y-7">
                            {latestNews.map((news) => (
                                <article key={news.title} className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(18,18,18,0.08)]">
                                    <img className="block h-auto w-full" src={news.image} alt={news.title} />
                                    <div className="px-5 pb-6 pt-4">
                                        <h3 className="font-header text-xl font-semibold leading-none text-primary md:text-2xl">
                                            {news.title}
                                        </h3>
                                        <p className="mt-3 font-inter text-base leading-[1.2] text-grey md:text-lg">
                                            {news.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default DetailNewsComp