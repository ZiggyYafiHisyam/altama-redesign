import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import sentIcon from "../../assets/icon/terkirim.svg"

const Terimakasih = () => {
    return (
        <div className="min-h-screen bg-[#605BC3]">
            <Navbar />
            <main
                className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24"
                style={{
                    background: "linear-gradient(180deg, #605BC3 0%, #353185 100%)",
                }}
            >
                <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
                    <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-size-[88px_88px]" />
                    <div className="absolute left-[-10%] top-44 h-42 w-105 rounded-3xl border border-white/25" />
                    <div className="absolute right-[-8%] top-44 h-42 w-105 rounded-3xl border border-white/25" />
                </div>

                <section className="relative z-10 flex max-w-150 flex-col items-center text-center">
                    <img className="h-32 w-auto" src={sentIcon} alt="Pesan berhasil terkirim" />
                    <h1 className="mt-8 font-header text-5xl font-semibold tracking-[-0.04em] text-[#F4C41C] md:text-7xl">
                        Terima Kasih
                    </h1>
                    <p className="mt-6 font-inter text-xl leading-[1.2] text-white md:text-2xl">
                        <strong>Sudah mengirimkan ceritamu!</strong>
                        <br />
                        Kami akan segera tindak lanjuti cerita dan
                        <br className="hidden md:block" />
                        pengalamanmu segera.
                    </p>
                    <Link
                        className="mt-10 inline-flex h-15 items-center justify-center rounded-full border-4 border-[#ACA9DF] bg-white px-8 font-header text-xl font-semibold text-primary transition-transform hover:scale-105"
                        to="/contact-us"
                    >
                        Back to Contact <span className="ml-4 text-2xl">›</span>
                    </Link>
                </section>
            </main>
        </div>
    )
}

export default Terimakasih