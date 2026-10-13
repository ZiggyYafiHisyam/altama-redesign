import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import HeroFields from "../components/HeroFields"
import ImageField from "../components/ImageField"
import { SelectField, TextAreaField, TextField } from "../components/Fields"
import { PageHeader, SaveBar } from "../components/Page"

const VARIANTS = [
    { value: "primary", label: "Purple gradient (white text)" },
    { value: "muted", label: "Grey card (purple text)" },
]

const AwardsEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("awards")
    const { content } = useContent()

    return (
        <>
            <PageHeader
                title="Awards & Certifications"
                description="The /award page. Each award is a large card; two side by side fill the row."
                previewPath="/award"
            />

            <div className="flex flex-col gap-6">
                <HeroFields get={get} update={update} />

                <CollectionEditor
                    collection="awards.items"
                    items={content.awards.items}
                    title="Awards and certifications"
                    itemLabel="award"
                    newItem={{ title: "New award", description: "", icon: "", variant: "muted" }}
                    renderSummary={(item) => item.title}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <TextField
                                label="Title"
                                value={item.title}
                                onChange={(value) => updateItem("title", value)}
                            />
                            <TextAreaField
                                label="Description"
                                value={item.description}
                                onChange={(value) => updateItem("description", value)}
                            />
                            <ImageField
                                label="Icon"
                                hint="Shown small in a yellow circle, so a simple glyph works best."
                                aspect="aspect-square"
                                value={item.icon}
                                onChange={(value) => updateItem("icon", value)}
                            />
                            <SelectField
                                label="Card style"
                                value={item.variant}
                                options={VARIANTS}
                                onChange={(value) => updateItem("variant", value)}
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
                    if (window.confirm("Reset the Awards page to the original content?")) resetToDefaults()
                }}
            />
        </>
    )
}

export default AwardsEditor
