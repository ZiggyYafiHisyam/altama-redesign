import { useCallback, useEffect, useMemo, useState } from "react"
import { defaultContent } from "../../shared/defaultContent.js"
import { fetchContent } from "./api"
import { ContentContext } from "./content"

// Supplies every public page (and the admin) with the site's content.
//
// It starts from the bundled defaults and swaps in whatever the API returns, so
// the site renders complete content on the very first paint, never flashes empty
// sections, and still renders if the backend is unreachable.
export function ContentProvider({ children }) {
    const [content, setContent] = useState(defaultContent)
    // Starts true because the first fetch is kicked off on mount. Refreshes after
    // that do not flip it back on: the admin refreshes after every save, and a
    // spinner there would be noise, not information.
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Written as a promise chain rather than async/await so that every setState
    // happens inside a callback, after the request resolves -- never synchronously
    // in the effect below, which would cost an extra render on every mount.
    const refresh = useCallback(
        () =>
            fetchContent()
                .then((body) => {
                    if (body?.data) {
                        setContent(body.data)
                        setError(null)
                    }
                })
                .catch((fetchError) => {
                    // Keep whatever is already on screen (the defaults, or the last
                    // good fetch) and record why the refresh failed.
                    setError(fetchError.message)
                })
                .finally(() => setIsLoading(false)),
        [],
    )

    useEffect(() => {
        refresh()
    }, [refresh])

    const value = useMemo(
        () => ({ content, isLoading, error, refresh }),
        [content, isLoading, error, refresh],
    )

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export default ContentProvider
