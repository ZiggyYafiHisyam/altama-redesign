import boardHero from "../../assets/board/boardHero.png"
import categoryOscar from "../../assets/board/categoryOscar.png"
import categoryStephanus from "../../assets/board/categoryStephanus.png"
import oscar from "../../assets/board/oscar.png"
import stephanus from "../../assets/board/stephanus.png"


const boardMembers = [
	{
		name: "Oscar Andrew Sutjadi",
		role: "Director, PT Altama Surya Anugerah",
		image: oscar,
		categories: categoryOscar,
		description: (
			<>
				<p>
					Oscar Andrew Sutjadi adalah Director PT Altama Surya Anugerah yang
					berperan dalam mengarahkan strategi bisnis dan pengembangan perusahaan
					sebagai distributor nasional peralatan teknik, otomotif, dan industri.
				</p>
				<p className="mt-6">
					Ia berfokus pada penguatan jaringan distribusi, pengembangan merek
					Tekiro, RYU, dan Rexco, serta memastikan pertumbuhan perusahaan berjalan
					secara berkelanjutan dengan tetap mengedepankan kualitas dan
					profesionalisme.
				</p>
			</>
		),
	},
	{
		name: "Stephanus Ferdinand Santoso",
		role: "Vice Director, PT Altama Surya Anugerah",
		image: stephanus,
		categories: categoryStephanus,
		description: (
			<>
				<p>
					Stephanus Ferdinand Santoso menjabat sebagai Vice Director PT Altama
					Surya Anugerah dengan tanggung jawab utama pada pengelolaan operasional
					dan peningkatan efektivitas organisasi.
				</p>
				<p className="mt-6">
					Dengan latar belakang teknik dan manajemen, ia berperan dalam menjaga
					standar mutu, mengoptimalkan proses kerja, serta mendukung pertumbuhan
					perusahaan melalui sistem yang efisien dan berkelanjutan.
				</p>
			</>
		),
	},
]

const BoardComp = ()=>{
    return 	<main>
				<section
					className="relative flex h-[clamp(520px,56.25vw,1080px)] min-h-162.5 items-center overflow-hidden bg-cover bg-center"
					style={{ backgroundImage: `url(${boardHero})` }}
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
							Board of <span className="rounded-md bg-[#F4C41C] px-2">Directors</span>
						</h1>
						<p className="mt-7 font-inter text-[clamp(1rem,1.3vw,2rem)] text-white/85">
							Leadership driving Altama&apos;s growth and excellence
						</p>
						<span className="mt-8 inline-flex rounded-full border border-white/40 px-4 py-2 font-inter text-sm text-white lg:text-lg">
							#AltamaGueBanget
						</span>
					</div>
				</section>

				{boardMembers.map((member, index) => (
					<section
						key={member.name}
						className={index === 0 ? "bg-white" : "bg-[#F5F5F9]"}
					>
						<div
							className={`mx-auto flex max-w-351 flex-col items-center gap-10 px-8 py-20 lg:flex-row lg:gap-16 lg:px-0 lg:py-36 ${
								index === 1 ? "lg:flex-row-reverse" : ""
							}`}
						>
							<img
								className="w-full max-w-137 rounded-4xl object-cover lg:shrink-0"
								src={member.image}
								alt={member.name}
							/>
							<div className="max-w-199 flex-1">
								<h2 className="font-header text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-[0.93] tracking-[-0.04em] text-primary">
									{member.name}
								</h2>
								<p className="mt-4 font-inter text-lg text-[#121212] lg:text-2xl">
									{member.role}
								</p>
								<div className="mt-12 font-inter text-lg leading-tight tracking-[-0.04em] text-grey lg:text-2xl">
									{member.description}
								</div>
								<img
									className="mt-8 max-w-full"
									src={member.categories}
									alt=""
								/>
							</div>
						</div>
					</section>
				))}
			</main>
}

export default BoardComp