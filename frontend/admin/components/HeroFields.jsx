import ImageField from "./ImageField"
import { TextAreaField, TextField } from "./Fields"
import { Card, Grid, HIGHLIGHT_HINT } from "./Page"

// The hero block repeats on five pages with the same five fields, so it gets one
// editor. `get`/`update` are the section draft's accessors and `prefix` is where
// the hero sits inside that section (always "hero" today).
export default function HeroFields({ get, update, prefix = "hero", title = "Page hero", description }) {
    const path = (field) => `${prefix}.${field}`

    return (
        <Card title={title} description={description}>
            <ImageField
                label="Background image"
                hint="A purple gradient sits on top, so mid-to-dark photos read best."
                value={get(path("backgroundImage"))}
                onChange={(value) => update(path("backgroundImage"), value)}
            />
            <Grid columns={3}>
                <TextField
                    label="Heading — before"
                    value={get(path("titleBefore"))}
                    onChange={(value) => update(path("titleBefore"), value)}
                />
                <TextField
                    label="Heading — highlight"
                    hint={HIGHLIGHT_HINT}
                    value={get(path("titleHighlight"))}
                    onChange={(value) => update(path("titleHighlight"), value)}
                />
                <TextAreaField
                    label="Heading — after"
                    rows={2}
                    value={get(path("titleAfter"))}
                    onChange={(value) => update(path("titleAfter"), value)}
                />
            </Grid>
            <TextAreaField
                label="Subtitle"
                rows={2}
                hint="A new line here becomes a line break on the page."
                value={get(path("subtitle"))}
                onChange={(value) => update(path("subtitle"), value)}
            />
            <TextField
                label="Hashtag pill"
                hint="Leave empty to hide it."
                value={get(path("badge"))}
                onChange={(value) => update(path("badge"), value)}
            />
        </Card>
    )
}
