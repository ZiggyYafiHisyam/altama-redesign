import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import ImageField from "../components/ImageField"
import { NumberField, TextAreaField, TextField } from "../components/Fields"
import { Card, Grid, HIGHLIGHT_HINT, PageHeader, SaveBar } from "../components/Page"

const HomeEditor = () => {
    const { draft, get, update, isDirty, isSaving, save, revert, resetToDefaults } =
        useSectionDraft("home")
    const { content } = useContent()

    return (
        <>
            <PageHeader
                title="Home page"
                description="The first thing a visitor sees: the hero, the company intro, the award block, the careers teaser and the location form."
                previewPath="/"
            />

            <div className="flex flex-col gap-6">
                <Card
                    title="Hero"
                    description="The full-screen banner at the top of the page."
                >
                    <ImageField
                        label="Background image"
                        hint="Shown behind a purple gradient, so a darker photo works best."
                        value={get("hero.backgroundImage")}
                        onChange={(value) => update("hero.backgroundImage", value)}
                    />
                    <TextField
                        label="Badge"
                        hint="The pill above the headline."
                        value={get("hero.badge")}
                        onChange={(value) => update("hero.badge", value)}
                    />
                    <Grid columns={3}>
                        <TextField
                            label="Headline — before"
                            value={get("hero.titleBefore")}
                            onChange={(value) => update("hero.titleBefore", value)}
                        />
                        <TextField
                            label="Headline — highlight"
                            hint="Shown on a yellow block."
                            value={get("hero.titleHighlight")}
                            onChange={(value) => update("hero.titleHighlight", value)}
                        />
                        <TextAreaField
                            label="Headline — after"
                            rows={2}
                            hint="A new line here becomes a line break."
                            value={get("hero.titleAfter")}
                            onChange={(value) => update("hero.titleAfter", value)}
                        />
                    </Grid>
                    <TextAreaField
                        label="Subtitle"
                        rows={2}
                        hint="One line per line typed."
                        value={get("hero.subtitle")}
                        onChange={(value) => update("hero.subtitle", value)}
                    />
                    <HeroPreview hero={draft.hero} />
                </Card>

                <Card
                    title="Company intro"
                    description="The two-column block under the hero, with the Read More button."
                >
                    <Grid>
                        <ImageField
                            label="Photo (left)"
                            value={get("companyPreview.sideImage")}
                            onChange={(value) => update("companyPreview.sideImage", value)}
                        />
                        <ImageField
                            label="“Company Overview” heading artwork"
                            value={get("companyPreview.headingImage")}
                            onChange={(value) => update("companyPreview.headingImage", value)}
                        />
                    </Grid>
                    <TextField
                        label="Title — highlighted company name"
                        hint="Shown in purple."
                        value={get("companyPreview.titleHighlight")}
                        onChange={(value) => update("companyPreview.titleHighlight", value)}
                    />
                    <TextAreaField
                        label="Title — rest"
                        rows={2}
                        value={get("companyPreview.titleRest")}
                        onChange={(value) => update("companyPreview.titleRest", value)}
                    />
                    <TextAreaField
                        label="Description"
                        value={get("companyPreview.description")}
                        onChange={(value) => update("companyPreview.description", value)}
                    />
                    <ImageField
                        label="Brand category artwork"
                        value={get("companyPreview.categoryImage")}
                        onChange={(value) => update("companyPreview.categoryImage", value)}
                    />
                    <Grid>
                        <TextField
                            label="Button label"
                            value={get("companyPreview.buttonLabel")}
                            onChange={(value) => update("companyPreview.buttonLabel", value)}
                        />
                        <TextField
                            label="Button link"
                            hint="A path on this site, e.g. /visi-misi."
                            value={get("companyPreview.buttonPath")}
                            onChange={(value) => update("companyPreview.buttonPath", value)}
                        />
                    </Grid>
                </Card>

                <Card
                    title="Animated banners"
                    description="The two full-width strips: one between the intro and the brands, one above the careers block. GIFs are fine here."
                >
                    <Grid>
                        <ImageField
                            label="Media centre banner"
                            value={get("mediaBanner.image")}
                            onChange={(value) => update("mediaBanner.image", value)}
                        />
                        <ImageField
                            label="Careers banner"
                            value={get("growBanner.image")}
                            onChange={(value) => update("growBanner.image", value)}
                        />
                    </Grid>
                </Card>

                <Card title="Brands & award" description="The “Our brands” artwork and the award write-up beside it.">
                    <Grid>
                        <ImageField
                            label="“Our brands” artwork"
                            value={get("brand.headingImage")}
                            onChange={(value) => update("brand.headingImage", value)}
                        />
                        <ImageField
                            label="Award photo"
                            value={get("brand.image")}
                            onChange={(value) => update("brand.image", value)}
                        />
                    </Grid>
                    <Grid columns={3}>
                        <TextField
                            label="Title — before"
                            value={get("brand.titleBefore")}
                            onChange={(value) => update("brand.titleBefore", value)}
                        />
                        <TextField
                            label="Title — highlight"
                            hint={HIGHLIGHT_HINT}
                            value={get("brand.titleHighlight")}
                            onChange={(value) => update("brand.titleHighlight", value)}
                        />
                        <TextField
                            label="Title — after"
                            value={get("brand.titleAfter")}
                            onChange={(value) => update("brand.titleAfter", value)}
                        />
                    </Grid>
                    <TextAreaField
                        label="Description"
                        value={get("brand.description")}
                        onChange={(value) => update("brand.description", value)}
                    />
                    <Grid>
                        <TextField
                            label="Button label"
                            value={get("brand.buttonLabel")}
                            onChange={(value) => update("brand.buttonLabel", value)}
                        />
                        <TextField
                            label="Button link"
                            value={get("brand.buttonPath")}
                            onChange={(value) => update("brand.buttonPath", value)}
                        />
                    </Grid>
                </Card>

                <Card
                    title="Careers teaser"
                    description="The purple block with the job search. The openings themselves live under Careers; this only controls how many of them appear here."
                >
                    <Grid columns={3}>
                        <TextField
                            label="Title — before"
                            value={get("careers.titleBefore")}
                            onChange={(value) => update("careers.titleBefore", value)}
                        />
                        <TextField
                            label="Title — highlight"
                            value={get("careers.titleHighlight")}
                            onChange={(value) => update("careers.titleHighlight", value)}
                        />
                        <NumberField
                            label="How many openings to show"
                            min={1}
                            max={24}
                            value={get("careers.jobLimit")}
                            onChange={(value) => update("careers.jobLimit", value)}
                        />
                    </Grid>
                    <Grid columns={3}>
                        <TextField
                            label="Search placeholder"
                            value={get("careers.searchPlaceholder")}
                            onChange={(value) => update("careers.searchPlaceholder", value)}
                        />
                        <TextField
                            label="Apply button label"
                            value={get("careers.buttonLabel")}
                            onChange={(value) => update("careers.buttonLabel", value)}
                        />
                        <TextField
                            label="Apply button link"
                            value={get("careers.buttonPath")}
                            onChange={(value) => update("careers.buttonPath", value)}
                        />
                    </Grid>
                    <TextField
                        label="Fraud warning — heading"
                        value={get("careers.warningTitle")}
                        onChange={(value) => update("careers.warningTitle", value)}
                    />
                    <TextAreaField
                        label="Fraud warning — text"
                        value={get("careers.warningText")}
                        onChange={(value) => update("careers.warningText", value)}
                    />
                </Card>

                <Card
                    title="Location & short contact form"
                    description="The map comes from the address under Identity & contact. These are the form's own labels."
                >
                    <Grid>
                        <TextField
                            label="Title — before"
                            value={get("location.titleBefore")}
                            onChange={(value) => update("location.titleBefore", value)}
                        />
                        <TextField
                            label="Title — highlight"
                            value={get("location.titleHighlight")}
                            onChange={(value) => update("location.titleHighlight", value)}
                        />
                    </Grid>
                    <Grid columns={3}>
                        <TextField
                            label="Name label"
                            value={get("location.nameLabel")}
                            onChange={(value) => update("location.nameLabel", value)}
                        />
                        <TextField
                            label="Email label"
                            value={get("location.emailLabel")}
                            onChange={(value) => update("location.emailLabel", value)}
                        />
                        <TextField
                            label="Message label"
                            value={get("location.messageLabel")}
                            onChange={(value) => update("location.messageLabel", value)}
                        />
                    </Grid>
                    <Grid columns={3}>
                        <TextField
                            label="Name placeholder"
                            value={get("location.namePlaceholder")}
                            onChange={(value) => update("location.namePlaceholder", value)}
                        />
                        <TextField
                            label="Email placeholder"
                            value={get("location.emailPlaceholder")}
                            onChange={(value) => update("location.emailPlaceholder", value)}
                        />
                        <TextField
                            label="Message placeholder"
                            value={get("location.messagePlaceholder")}
                            onChange={(value) => update("location.messagePlaceholder", value)}
                        />
                    </Grid>
                    <TextField
                        label="Submit button label"
                        value={get("location.buttonLabel")}
                        onChange={(value) => update("location.buttonLabel", value)}
                    />
                </Card>

                {/* Stats are a list, so they get the generic CRUD editor and save
                    per row rather than with the rest of the page. */}
                <CollectionEditor
                    collection="home.brand.stats"
                    items={content.home.brand.stats}
                    title="Award stats"
                    description="The small cards under the award description on the home page."
                    itemLabel="stat"
                    newItem={{ value: "0", label: "New stat" }}
                    renderSummary={(item) => `${item.value} — ${item.label}`}
                >
                    {({ item, update: updateItem }) => (
                        <Grid>
                            <TextField
                                label="Number"
                                value={item.value}
                                onChange={(value) => updateItem("value", value)}
                            />
                            <TextField
                                label="Label"
                                value={item.label}
                                onChange={(value) => updateItem("label", value)}
                            />
                        </Grid>
                    )}
                </CollectionEditor>
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={save}
                onRevert={revert}
                onReset={() => {
                    if (window.confirm("Reset the whole home page to the original content?")) {
                        resetToDefaults()
                    }
                }}
            />
        </>
    )
}

// A rough render of the hero headline so the three title fields are not guesswork.
function HeroPreview({ hero }) {
    return (
        <div
            className="overflow-hidden rounded-2xl bg-cover bg-center p-6"
            style={{ background: "linear-gradient(110deg, #353185, #605BC3)" }}
        >
            <p className="font-inter text-[10px] font-bold uppercase tracking-widest text-white/50">
                Preview
            </p>
            <p className="mt-3 inline-flex rounded-full border border-white/40 px-3 py-1 font-inter text-xs text-white">
                {hero.badge}
            </p>
            <p className="mt-3 font-header text-3xl font-semibold leading-[0.95] text-white">
                {hero.titleBefore}
                {hero.titleBefore && <br />}
                {hero.titleHighlight && (
                    <span className="rounded bg-[#F4C41C] px-1.5 text-[#15133c]">{hero.titleHighlight}</span>
                )}
                {hero.titleAfter?.split("\n").map((line, index) => (
                    <span key={index}>
                        {index > 0 && <br />}
                        {line}
                    </span>
                ))}
            </p>
            <p className="mt-3 whitespace-pre-line font-inter text-sm text-white/70">{hero.subtitle}</p>
        </div>
    )
}

export default HomeEditor
