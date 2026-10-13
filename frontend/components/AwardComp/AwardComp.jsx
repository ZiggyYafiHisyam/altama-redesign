import PageHero from "../PageHero"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

// Two card looks, picked by each award's `variant` in the content document.
const VARIANTS = {
	primary: {
		className: "text-white",
		style: { background: "linear-gradient(135deg, #353185 0%, #605BC3 100%)" },
	},
	muted: {
		className: "bg-[#E4E4E4] text-primary",
		style: undefined,
	},
}

const AwardComp = () => {
	const awards = useSection("awards")

	return (
		<main>
			<PageHero hero={awards.hero} />

			<section className="min-h-175 bg-white px-6 py-15 lg:min-h-267.5 lg:px-28.5 lg:py-15">
				<div className="mx-auto grid max-w-423.5 gap-6 lg:grid-cols-2">
					{awards.items.map((award) => {
						const variant = VARIANTS[award.variant] ?? VARIANTS.muted

						return (
							<article
								key={award.id}
								className={`flex min-h-121.5 flex-col rounded-4xl px-7.5 py-12 lg:min-h-121.5 lg:px-14.25 ${variant.className}`}
								style={variant.style}
							>
								{resolveImage(award.icon) && (
									<img
										className="h-15 w-15 bg-amber-300 rounded-full p-2"
										src={resolveImage(award.icon)}
										alt=""
									/>
								)}
								<h2 className="mt-7 max-w-170 font-header text-[clamp(2rem,2.9vw,3.5rem)] font-medium leading-[0.93] tracking-[-0.04em]">
									{award.title}
								</h2>
								<p className="mt-auto max-w-159 font-inter text-[clamp(1rem,1.25vw,1.5rem)] leading-tight tracking-[-0.04em]">
									{award.description}
								</p>
							</article>
						)
					})}
				</div>
			</section>
		</main>
	)
}

export default AwardComp
