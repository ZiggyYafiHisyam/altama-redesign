import Button from '../../ui/Button/Button'

const Location = () => {
    return (
        <section className="w-full bg-[#f3f3f3] px-6 py-16 sm:px-8 md:px-12 md:py-24 lg:px-20 xl:px-64.5">
            <div className="mx-auto max-w-300">
                <h2 className="text-center font-header text-[42px] font-bold leading-none tracking-[-0.04em] md:text-[56px] ">
                    OUR <span className='text-primary'>LOCATION</span> 
                </h2>

                <div className="mt-8 flex flex-col gap-8 xl:flex-row">
                    <div className="relative w-full overflow-hidden rounded-[18px] border-[3px] border-[#0a5cd8] bg-[#dfeaf7] shadow-[0_0_0_1px_rgba(7,83,200,0.15)] xl:max-w-190">
                        <iframe
                            title="Altama Location Map"
                            src="https://www.google.com/maps?q=Jl.%20Bandung%20Utara%2085A%20No.%208-9%20RT.3%2FRW.16%20Penjaringan%20Jakarta%20Utara&output=embed"
                            className="h-72 w-full border-0 sm:h-88 md:h-105"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-white/80 px-4 py-3 backdrop-blur-sm">
                            <p className="text-[15px] font-medium leading-relaxed text-[#1d1d1d]">
                                Jl. Bandung Utara 85A No. 8-9, RT.3/RW.16, <br />
                                Penjaringan, Kecamatan Penjaringan, Jakarta, Daerah <br />
                                Khusus Ibukota Jakarta 14440
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full flex-col justify-end xl:max-w-105">
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-[18px] font-medium text-[#2c2c2c]">Your Name</span>
                                    <input
                                        type="text"
                                        placeholder="Your Your Name"
                                        className="h-15 w-full rounded-3xl border-0 bg-[#e9e9e9] px-4 text-[18px] text-[#444] placeholder:text-[#7a7a7a] focus:outline-none"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-[18px] font-medium text-[#2c2c2c]">Email Address</span>
                                    <input
                                        type="email"
                                        placeholder="Your Email Address"
                                        className="h-15 w-full rounded-3xl border-0 bg-[#e9e9e9] px-4 text-[18px] text-[#444] placeholder:text-[#7a7a7a] focus:outline-none"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-[18px] font-medium text-[#2c2c2c]">Message</span>
                                <textarea
                                    placeholder="Write Something..."
                                    rows="5"
                                    className="w-full resize-none rounded-3xl border-0 bg-[#e9e9e9] px-4 py-4 text-[18px] text-[#444] placeholder:text-[#7a7a7a] focus:outline-none"
                                />
                            </label>
                        </div>

                        <div className="mt-6">
                            <Button className="h-15! w-full! rounded-[26px]! bg-primary! text-[22px]! font-bold! shadow-none!">
                                Send Message
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Location