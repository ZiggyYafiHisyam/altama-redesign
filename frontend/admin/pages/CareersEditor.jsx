import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import { TextAreaField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

const CareersEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("careers")
    const { content } = useContent()

    return (
        <>
            <PageHeader
                title="Careers"
                description="One list of openings, shown in full on /grow-with and as a teaser on the home page. Visitors can search it."
                previewPath="/grow-with"
            />

            <div className="flex flex-col gap-6">
                <Card title="Page heading">
                    <Grid columns={3}>
                        <TextField
                            label="Heading — before"
                            value={get("hero.titleBefore")}
                            onChange={(value) => update("hero.titleBefore", value)}
                        />
                        <TextField
                            label="Heading — highlight"
                            hint="Shown in yellow."
                            value={get("hero.titleHighlight")}
                            onChange={(value) => update("hero.titleHighlight", value)}
                        />
                        <TextField
                            label="Heading — after"
                            value={get("hero.titleAfter")}
                            onChange={(value) => update("hero.titleAfter", value)}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            label="Search placeholder"
                            value={get("hero.searchPlaceholder")}
                            onChange={(value) => update("hero.searchPlaceholder", value)}
                        />
                        <TextField
                            label="Apply button label"
                            hint="Used on every card on this page."
                            value={get("applyLabel")}
                            onChange={(value) => update("applyLabel", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="careers.jobs"
                    items={content.careers.jobs}
                    title="Open positions"
                    description="Delete one to close the vacancy. The home page shows the first few — set how many under Home."
                    itemLabel="position"
                    startOpen
                    newItem={{ title: "New position", description: "", applyPath: "/contact-us" }}
                    renderSummary={(item) => item.title}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <TextField
                                label="Job title"
                                value={item.title}
                                onChange={(value) => updateItem("title", value)}
                            />
                            <TextAreaField
                                label="Short description"
                                rows={2}
                                value={item.description}
                                onChange={(value) => updateItem("description", value)}
                            />
                            <TextField
                                label="Apply link"
                                hint="A path on this site (/contact-us) or a full URL to an external job board."
                                value={item.applyPath}
                                onChange={(value) => updateItem("applyPath", value)}
                            />
                        </>
                    )}
                </CollectionEditor>
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={save}
                onRevert={revert}
                onReset={() => {
                    if (window.confirm("Reset the Careers page, including the job list, to the original content?")) {
                        resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default CareersEditor
