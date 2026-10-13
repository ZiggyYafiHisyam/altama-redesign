import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import HeroFields from "../components/HeroFields"
import ImageField from "../components/ImageField"
import { NumberField, TextAreaField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

const LifeAtEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("lifeAt")
    const { content } = useContent()

    return (
        <>
            <PageHeader
                title="Life at Altama"
                description="The /life-at page: the recruitment hero and the testimonial carousel."
                previewPath="/life-at"
            />

            <div className="flex flex-col gap-6">
                <HeroFields get={get} update={update} />

                <Card title="Testimonials heading">
                    <Grid>
                        <TextField
                            label="Eyebrow"
                            hint="The small purple line above the heading."
                            value={get("testimonialsEyebrow")}
                            onChange={(value) => update("testimonialsEyebrow", value)}
                        />
                        <TextField
                            label="Heading"
                            value={get("testimonialsTitle")}
                            onChange={(value) => update("testimonialsTitle", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="lifeAt.testimonials"
                    items={content.lifeAt.testimonials}
                    title="Testimonials"
                    description="A horizontal carousel visitors drag through, in this order."
                    itemLabel="testimonial"
                    newItem={{ name: "New partner", role: "", quote: "", avatar: "", rating: 5 }}
                    renderSummary={(item) => `${item.name} — ${item.role}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <TextAreaField
                                label="Quote"
                                value={item.quote}
                                onChange={(value) => updateItem("quote", value)}
                            />
                            <Grid columns={3}>
                                <TextField
                                    label="Name"
                                    value={item.name}
                                    onChange={(value) => updateItem("name", value)}
                                />
                                <TextField
                                    label="Role or company"
                                    value={item.role}
                                    onChange={(value) => updateItem("role", value)}
                                />
                                <NumberField
                                    label="Stars"
                                    hint="0 to 5."
                                    min={0}
                                    max={5}
                                    value={item.rating}
                                    onChange={(value) => updateItem("rating", value)}
                                />
                            </Grid>
                            <ImageField
                                label="Photo"
                                aspect="aspect-square"
                                value={item.avatar}
                                onChange={(value) => updateItem("avatar", value)}
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
                    if (window.confirm("Reset the Life at Altama page to the original content?")) {
                        resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default LifeAtEditor
