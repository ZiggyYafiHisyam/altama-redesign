import { createContext, useContext } from "react"
import { defaultContent } from "../../shared/defaultContent.js"

// The context and its hooks live apart from the provider component so that a file
// never exports both a component and a hook -- which is what keeps Fast Refresh
// working (see eslint's react-refresh rule). The provider is in ContentProvider.jsx.

export const ContentContext = createContext({
    content: defaultContent,
    isLoading: false,
    error: null,
    refresh: () => {},
})

// The whole document, plus the loading/error state. Most components want
// useSection instead.
export function useContent() {
    return useContext(ContentContext)
}

// useSection("home") -> the home section, falling back to the bundled default for
// that section if the stored document somehow lacks it.
export function useSection(name) {
    const { content } = useContext(ContentContext)
    return content?.[name] ?? defaultContent[name]
}
