
import awardHero from "../../assets/brand/award.png"
import awardIcon from "../../assets/icon/award.svg"
import singalIcon from "../../assets/icon/singal.svg"

const awards = [
	{
		title: "AWARD RECOGNITION",
		description:
			"Penghargaan ini menegaskan posisi Altama sebagai distributor nasional dengan kekuatan merek yang terpercaya di Indonesia.",
		icon: awardIcon,
		className: "text-white",
		style: {
			background: "linear-gradient(135deg, #353185 0%, #605BC3 100%)",
		},
	},
	{
		title: "INTERNATIONAL STANDARD: - ISO 9001:2015 (QUALITY POLICY)",
		description:
			"Sertifikasi ini memastikan seluruh proses bisnis Altama memenuhi standar mutu internasional dan berorientasi pada kepuasan pelanggan.",
		icon: singalIcon,
		className: "bg-[#E4E4E4] text-primary",
	},
]
const AwardComp = ()=>{
    return 			<main>
				<section
					className="relative flex h-[clamp(520px,56.25vw,1080px)] min-h-162.5 items-center overflow-hidden bg-cover bg-center"
					style={{ backgroundImage: `url(${awardHero})` }}
				>
					<div
						className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary to-primary/20"
						aria-hidden="true"
					/>
					<div className="relative z-10 w-full px-8 pt-20 lg:px-28.75 lg:pt-40">
						<div className="flex flex-wrap gap-3">
							{["TEKIRO", "REXCO", "RYU"].map((brand) => (
								<span
									key={brand}
									className="rounded-md bg-[#605BC3]/80 px-3 py-2 font-header text-xl font-bold text-white lg:text-2xl"
								>
									{brand}
								</span>
							))}
						</div>
						<h1 className="mt-8 font-header text-[clamp(3rem,5.7vw,6.5rem)] font-medium leading-[0.93] tracking-[-0.04em] text-white">
							Awards &amp; <span className="rounded-md bg-[#F4C41C] px-2">Certifications</span>
						</h1>
						<p className="mt-7 font-inter text-[clamp(1rem,1.3vw,2rem)] text-white/85">
							Leadership driving Altama&apos;s growth and excellence
						</p>
						<span className="mt-8 inline-flex rounded-full border border-white/40 px-4 py-2 font-inter text-sm text-white lg:text-lg">
							#AltamaGueBanget
						</span>
					</div>
				</section>

				<section className="min-h-175 bg-white px-6 py-15 lg:min-h-267.5 lg:px-28.5 lg:py-15">
					<div className="mx-auto grid max-w-423.5 gap-6 lg:grid-cols-2">
						{awards.map((award) => (
							<article
								key={award.title}
								className={`flex min-h-121.5 flex-col rounded-4xl px-7.5 py-12 lg:min-h-121.5 lg:px-14.25 ${award.className}`}
								style={award.style}
							>
								<img className="h-15 w-15 bg-amber-300 rounded-full p-2" src={award.icon} alt="" />
								<h2 className="mt-7 max-w-170 font-header text-[clamp(2rem,2.9vw,3.5rem)] font-medium leading-[0.93] tracking-[-0.04em]">
									{award.title}
								</h2>
								<p className="mt-auto max-w-159 font-inter text-[clamp(1rem,1.25vw,1.5rem)] leading-tight tracking-[-0.04em]">
									{award.description}
								</p>
							</article>
						))}
					</div>
				</section>
			</main>
}

export default AwardComp