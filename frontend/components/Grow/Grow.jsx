import Button from '../../ui/Button/Button'

const jobs = [
    {
        title: 'Modern Market Coordinator Staff',
        description: 'Bertanggung jawab mengembangkan relasi modern market',
    },
    {
        title: 'Modern Market Coordinator Staff',
        description: 'Mengelola penjualan dan displai produk di jaringan modern',
    },
    {
        title: 'Mechanic Staff',
        description: 'Melakukan perawatan, pembersihan, serta perbaikan alat',
    },
    {
        title: 'Distribution Supervisor',
        description: 'Mengawasi proses distribusi, mengelola tim logistik',
    },
]

const Grow = () => {
    return (
        <section
            className="relative w-full overflow-hidden px-6 py-8 md:px-12"
            style={{
                background: 'linear-gradient(180deg, #353185 0%, #4B45A1 100%)',
            }}
        >
            <div className="absolute inset-0 opacity-25" aria-hidden="true">
                <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[88px_88px]" />
            </div>

            <div className="relative mx-auto max-w-350">
                <h2 className="text-center font-header text-[clamp(2rem,4.2vw,4.25rem)] font-bold leading-none tracking-[-0.04em] text-white">
                    GROW WITH US <span className="text-[#F4C41C]">AT ALTAMA!</span>
                </h2>

                <div className="mx-auto mt-8 flex w-full max-w-245 items-center overflow-hidden rounded-full border border-white/40 bg-white/95 shadow-[0_0_0_2px_rgba(255,255,255,0.08)]">
                    <input
                        type="text"
                        placeholder="Search job position..."
                        className="h-15.5 w-full border-0 bg-transparent px-4 text-base text-[#5B5B5B] placeholder:text-[#6d6d6d] focus:outline-none md:px-6 md:text-[24px]"
                    />
                    <button
                        type="button"
                        className="mr-3 flex h-11.5 w-11.5 items-center justify-center rounded-full bg-primary text-[22px] font-bold text-white shadow-sm"
                        aria-label="Search"
                    >
                        ⌕
                    </button>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="rounded-[28px] bg-[#F3F3F3] p-6 shadow-[0_4px_0_rgba(22,22,22,0.08)]"
                        >
                            <h3 className="font-header text-[clamp(1.4rem,2.2vw,2rem)] font-bold leading-[1.2] tracking-[-0.03em] text-[#2B2B2B]">
                                {job.title}
                            </h3>

                            <p className="mt-4 text-base leading-[1.55] text-[#474747] md:text-[20px]">
                                {job.description}
                            </p>

                            <div className="mt-7">
                                <Button className="h-10 w-40 rounded-[999px] text-[14px] font-bold md:h-13 md:w-55 md:text-[20px]">
                                    Apply Now
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pb-8 text-center">
                    <h3 className="font-header text-[40px] font-bold tracking-[-0.04em] text-[#F4C41C] md:text-[56px]">
                        HATI-HATI PENIPUAN
                    </h3>
                    <p className="mx-auto mt-4 max-w-225 text-[18px] leading-[1.55] text-white/90 md:text-[24px]">
                        PT Altama Surya Anugerah tidak pernah meminta biaya dalam proses rekrutmen maupun transaksi. Pastikan Anda hanya berkomunikasi melalui kontak resmi kami
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Grow