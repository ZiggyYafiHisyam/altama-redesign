import { Link } from "react-router-dom"

// Link targets come from the content document now, so any of them may be edited
// into an external URL. A react-router <Link> cannot leave the app, so anything
// that is not an in-app path falls back to a plain anchor (opened in a new tab,
// which is what you want for a social profile or a partner site).
function isExternal(to) {
    return typeof to === "string" && /^(https?:|mailto:|tel:)/i.test(to)
}

const SmartLink = ({ to, children, ...rest }) => {
    if (!to) return <span {...rest}>{children}</span>

    if (isExternal(to)) {
        return (
            <a href={to} target="_blank" rel="noreferrer noopener" {...rest}>
                {children}
            </a>
        )
    }

    return (
        <Link to={to} {...rest}>
            {children}
        </Link>
    )
}

export default SmartLink
