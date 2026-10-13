import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import HeroFields from "../components/HeroFields"
import { TextAreaField, TextField, ToggleField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

const VisiMisiEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("visiMisi")
    const { content } = useContent()
    const visiMisi = content.visiMisi

    return (
        <>
            <PageHeader
                title="Vision & Mission"
                description="The /visi-misi page: the vision statement, the mission points, the core values and the milestone timeline."
                previewPath="/visi-misi"
            />

            <div className="flex flex-col gap-6">
                <HeroFields get={get} update={update} />

                <Card title="Vision" description="The statement at the top of the page.">
                    <Grid>
                        <TextField
                            label="“Vision” label"
                            hint="The word beside the marker. Indonesian on the live site: VISI."
                            value={get("visionLabel")}
                            onChange={(value) => update("visionLabel", value)}
                        />
                        <TextField
                            label="“Mission” label"
                            value={get("missionLabel")}
                            onChange={(value) => update("missionLabel", value)}
                        />
                    </Grid>
                    <TextAreaField
                        label="Vision statement"
                        rows={4}
                        value={get("vision")}
                        onChange={(value) => update("vision", value)}
                    />
                </Card>

                <CollectionEditor
                    collection="visiMisi.missions"
                    items={visiMisi.missions}
                    title="Mission points"
                    description="The two-column list of commitments beside the vision."
                    itemLabel="point"
                    newItem={{ text: "New mission point" }}
                    renderSummary={(item) => item.text}
                >
                    {({ item, update: updateItem }) => (
                        <TextAreaField
                            label="Text"
                            rows={2}
                            value={item.text}
                            onChange={(value) => updateItem("text", value)}
                        />
                    )}
                </CollectionEditor>

                <Card title="Core values heading">
                    <Grid>
                        <TextField
                            label="Heading — before"
                            value={get("coreValueTitleBefore")}
                            onChange={(value) => update("coreValueTitleBefore", value)}
                        />
                        <TextField
                            label="Heading — highlight"
                            value={get("coreValueTitleHighlight")}
                            onChange={(value) => update("coreValueTitleHighlight", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="visiMisi.coreValues"
                    items={visiMisi.coreValues}
                    title="Core values"
                    description="Four cards work best on the grid. One card can be highlighted in purple."
                    itemLabel="value"
                    newItem={{ title: "New value", subtitle: "", active: false }}
                    renderSummary={(item) => `${item.title}${item.active ? "  ·  highlighted" : ""}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <Grid>
                                <TextField
                                    label="Title"
                                    value={item.title}
                                    onChange={(value) => updateItem("title", value)}
                                />
                                <TextField
                                    label="Subtitle"
                                    value={item.subtitle}
                                    onChange={(value) => updateItem("subtitle", value)}
                                />
                            </Grid>
                            <ToggleField
                                label="Highlight this card"
                                hint="Draws it as the filled purple card. Usually only one is."
                                value={item.active}
                                onChange={(value) => updateItem("active", value)}
                            />
                        </>
                    )}
                </CollectionEditor>

                <Card title="Milestone timeline">
                    <TextField
                        label="Heading"
                        value={get("milestoneTitle")}
                        onChange={(value) => update("milestoneTitle", value)}
                    />
                </Card>

                <CollectionEditor
                    collection="visiMisi.milestones"
                    items={visiMisi.milestones}
                    title="Milestones"
                    description="The draggable timeline. The first one is drawn as the highlighted card, so keep them in order."
                    itemLabel="milestone"
                    newItem={{ year: "2026", description: "What happened." }}
                    renderSummary={(item) => `${item.year} — ${item.description}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <TextField
                                label="Year"
                                value={item.year}
                                onChange={(value) => updateItem("year", value)}
                            />
                            <TextAreaField
                                label="Description"
                                rows={2}
                                value={item.description}
                                onChange={(value) => updateItem("description", value)}
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
                    if (window.confirm("Reset the whole Vision & Mission page to the original content?")) {
                        resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default VisiMisiEditor
