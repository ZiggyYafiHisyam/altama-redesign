import PageHero from "../PageHero"
import { resolveImage } from "../../lib/assets"
import { useSection } from "../../lib/content"

const BoardComp = () => {
	const board = useSection("board")

	return (
		<main>
			<PageHero hero={board.hero} />

			{board.members.map((member, index) => (
				<section
					key={member.id}
					// Members alternate background and image side, so the page reads
					// as a column of portraits rather than a list.
					className={index % 2 === 0 ? "bg-white" : "bg-[#F5F5F9]"}
				>
					<div
						className={`mx-auto flex max-w-351 flex-col items-center gap-10 px-8 py-20 lg:flex-row lg:gap-16 lg:px-0 lg:py-36 ${
							index % 2 === 1 ? "lg:flex-row-reverse" : ""
						}`}
					>
						{resolveImage(member.image) && (
							<img
								className="w-full max-w-137 rounded-4xl object-cover lg:shrink-0"
								src={resolveImage(member.image)}
								alt={member.name}
							/>
						)}
						<div className="max-w-199 flex-1">
							<h2 className="font-header text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-[0.93] tracking-[-0.04em] text-primary">
								{member.name}
							</h2>
							<p className="mt-4 font-inter text-lg text-[#121212] lg:text-2xl">
								{member.role}
							</p>
							<div className="mt-12 font-inter text-lg leading-tight tracking-[-0.04em] text-grey lg:text-2xl">
								{(member.paragraphs ?? []).map((paragraph, paragraphIndex) => (
									<p key={paragraphIndex} className={paragraphIndex > 0 ? "mt-6" : ""}>
										{paragraph}
									</p>
								))}
							</div>
							{resolveImage(member.categoryImage) && (
								<img
									className="mt-8 max-w-full"
									src={resolveImage(member.categoryImage)}
									alt=""
								/>
							)}
						</div>
					</div>
				</section>
			))}
		</main>
	)
}

export default BoardComp
