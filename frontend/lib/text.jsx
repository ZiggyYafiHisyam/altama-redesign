import { Fragment } from "react"

// Content text is stored as plain strings, and a newline in one means a line
// break on the page. That keeps the admin's textareas honest -- what you type is
// what renders -- without letting HTML into the content document.
//
// `breakClassName` is for the breaks the design only wants on wider screens,
// e.g. <br className="hidden md:block" />.
export function Multiline({ text, breakClassName = "" }) {
    const lines = String(text ?? "").split("\n")

    return lines.map((line, index) => (
        <Fragment key={index}>
            {index > 0 && <br className={breakClassName} />}
            {line}
        </Fragment>
    ))
}

// The site's headings are all "plain text, highlighted phrase, more plain text",
// where the highlight is either a yellow block or yellow type. Any of the three
// parts may be empty and is then dropped entirely, so a heading with no `after`
// never renders a stray line break.
//
// `breakBeforeHighlight` is the one layout choice the content cannot express: the
// two big page heroes put the highlight on its own line, while every other
// heading flows inline.
export function HeroTitle({
    before,
    highlight,
    after,
    highlightClassName,
    breakBeforeHighlight = false,
}) {
    return (
        <>
            {before ? <Multiline text={before} /> : null}
            {before && breakBeforeHighlight ? <br /> : null}
            {highlight ? <span className={highlightClassName}>{highlight}</span> : null}
            {after ? <Multiline text={after} /> : null}
        </>
    )
}
