import Button from "../../ui/Button/Button"
import { useNavigate } from "react-router-dom"

const jobs = [
    {
        title: "Modern Market Coordinator Staff",
        description: "Bertanggung jawab mengembangkan relasi modern market",
    },
    {
        title: "Modern Market Coordinator Staff",
        description: "Mengelola penjualan dan display produk di jaringan modern",
    },
    {
        title: "Modern Market Coordinator Staff",
        description: "Bertanggung jawab mengembangkan relasi modern market",
    },
    {
        title: "Mechanic Staff",
        description: "Melakukan perawatan, pembersihan, serta perbaikan alat",
    },
    {
        title: "Distribution Supervisor",
        description: "Mengawasi proses distribusi, mengelola tim logistik",
    },
    {
        title: "Distribution Supervisor",
        description: "Mengawasi proses distribusi, mengelola tim logistik",
    },
]

const GrowWithComp = () => {
    const navigate = useNavigate()

    return (
        <main>
            <section
            className="relative overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-18 md:pt-43"
                style={{
                    background: "linear-gradient(180deg, #353185 0%, #4B45A1 100%)",
                }}
            >
                <div className="absolute inset-0 opacity-25" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[88px_88px]" />
                </div>

                <div className="relative mx-auto max-w-350">
                    <h1 className="text-center font-header text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none tracking-[-0.04em] text-white">
                        GROW WITH US <span className="text-[#F4C41C]">AT ALTAMA!</span>
                    </h1>

                    <div className="mx-auto mt-7 flex h-13.5 w-full max-w-196.25 items-center rounded-full border border-white/40 bg-white px-4">
                        <input
                            type="search"
                            placeholder="Search job position..."
                            className="min-w-0 flex-1 bg-transparent font-inter text-sm text-grey outline-none placeholder:text-[#999] md:text-base"
                            aria-label="Search job position"
                        />
                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                            aria-label="Search"
                        >
                            ⌕
                        </button>
                    </div>

                    <div className="mx-auto mt-10 grid max-w-350 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job, index) => (
                            <article
                                key={`${job.title}-${index}`}
                                className="flex min-h-45 flex-col rounded-3xl bg-[#F8F8F8] p-5 shadow-[0_4px_0_rgba(22,22,22,0.08)] md:min-h-50 md:p-6"
                            >
                                <h2 className="font-header text-xl font-semibold leading-tight text-[#121212]">
                                    {job.title}
                                </h2>
                                <p className="mt-2 font-inter text-sm leading-[1.35] text-grey">
                                    {job.description}
                                </p>
                                <Button className="mt-auto h-10 w-36 text-sm font-semibold md:h-12 md:w-40 md:text-base">
                                    Apply Now
                                </Button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-white px-6 py-18 md:px-12 md:py-22">
                <div className="mx-auto flex min-h-67.5 max-w-265 flex-col items-center justify-center rounded-3xl border border-[#ACA9DF] px-6 text-center">
                    <h2 className="font-header text-[34px] font-medium leading-[1.1] tracking-[-0.04em] text-primary md:text-[56px]">
                        Insights, Innovation, and Progress
                    </h2>
                    <p className="mt-4 max-w-121.75 font-inter text-base leading-[1.3] text-grey md:text-xl">
                        Temukan solusi terbaik untuk kebutuhan teknik, otomotif, dan industri Anda.
                    </p>
                    <Button
                        className="mt-8 h-15.25 w-53 text-base font-semibold"
                        onClick={() => navigate("/detail-news")}
                    >
                        Explore News
                    </Button>
                </div>
            </section>
        </main>
    )
}

export default GrowWithComp