import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import HeroFields from "../components/HeroFields"
import ImageField from "../components/ImageField"
import { StringListField, TextField } from "../components/Fields"
import { Grid, PageHeader, SaveBar } from "../components/Page"

const BoardEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("board")
    const { content } = useContent()

    return (
        <>
            <PageHeader
                title="Board of Directors"
                description="The /board page. Members alternate left and right down the page automatically, in the order listed here."
                previewPath="/board"
            />

            <div className="flex flex-col gap-6">
                <HeroFields get={get} update={update} />

                <CollectionEditor
                    collection="board.members"
                    items={content.board.members}
                    title="Members"
                    itemLabel="member"
                    newItem={{ name: "New member", role: "", image: "", categoryImage: "", paragraphs: [""] }}
                    renderSummary={(item) => `${item.name} — ${item.role}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <Grid>
                                <TextField
                                    label="Name"
                                    value={item.name}
                                    onChange={(value) => updateItem("name", value)}
                                />
                                <TextField
                                    label="Role"
                                    value={item.role}
                                    onChange={(value) => updateItem("role", value)}
                                />
                            </Grid>
                            <Grid>
                                <ImageField
                                    label="Portrait"
                                    aspect="aspect-square"
                                    value={item.image}
                                    onChange={(value) => updateItem("image", value)}
                                />
                                <ImageField
                                    label="Responsibilities artwork"
                                    hint="The strip of labels under the biography."
                                    value={item.categoryImage}
                                    onChange={(value) => updateItem("categoryImage", value)}
                                />
                            </Grid>
                            <StringListField
                                label="Biography"
                                hint="One entry per paragraph."
                                multiline
                                addLabel="Add paragraph"
                                value={item.paragraphs}
                                onChange={(value) => updateItem("paragraphs", value)}
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
                    if (window.confirm("Reset the Board page to the original content?")) resetToDefaults()
                }}
            />
        </>
    )
}

export default BoardEditor
