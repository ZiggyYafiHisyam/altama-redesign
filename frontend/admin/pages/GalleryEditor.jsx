import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import ImageField from "../components/ImageField"
import { SelectField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

// The mosaic on /web-gallery is a fixed CSS grid; an image picks which slot it
// fills. Two images in the same slot would stack on top of each other, which the
// warning below the list points out.
const AREAS = [
    { value: "a", label: "a — tall, top left" },
    { value: "b", label: "b — wide, top middle" },
    { value: "c", label: "c — tall, right column" },
    { value: "d", label: "d — small, centre" },
    { value: "e", label: "e — tall, centre right" },
    { value: "f", label: "f — small, bottom left" },
    { value: "g", label: "g — small, bottom middle" },
]

const GalleryEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("gallery")
    const { content } = useContent()
    const gallery = content.gallery

    const usedAreas = gallery.web.reduce((counts, item) => {
        counts[item.area] = (counts[item.area] ?? 0) + 1
        return counts
    }, {})
    const duplicateAreas = Object.entries(usedAreas)
        .filter(([, count]) => count > 1)
        .map(([area]) => area)
    const missingAreas = AREAS.map((area) => area.value).filter((area) => !usedAreas[area])

    return (
        <>
            <PageHeader
                title="Gallery"
                description="Two pages share this content: /gallery (the Instagram grid) and /web-gallery (the photo mosaic)."
                previewPath="/web-gallery"
            />

            <div className="flex flex-col gap-6">
                <Card title="Shared heading" description="Shown at the top of both gallery pages.">
                    <Grid>
                        <TextField
                            label="Heading — before"
                            value={get("titleBefore")}
                            onChange={(value) => update("titleBefore", value)}
                        />
                        <TextField
                            label="Heading — highlight"
                            hint="Shown in yellow."
                            value={get("titleHighlight")}
                            onChange={(value) => update("titleHighlight", value)}
                        />
                    </Grid>
                    <TextField
                        label="Subtitle"
                        value={get("subtitle")}
                        onChange={(value) => update("subtitle", value)}
                    />
                    <Grid>
                        <TextField
                            label="Instagram tab label"
                            value={get("instagramTabLabel")}
                            onChange={(value) => update("instagramTabLabel", value)}
                        />
                        <TextField
                            label="Web tab label"
                            value={get("webTabLabel")}
                            onChange={(value) => update("webTabLabel", value)}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            label="Instagram button label"
                            value={get("instagramButtonLabel")}
                            onChange={(value) => update("instagramButtonLabel", value)}
                        />
                        <TextField
                            label="Instagram button link"
                            hint="Paste the full profile URL to send visitors to Instagram."
                            value={get("instagramButtonUrl")}
                            onChange={(value) => update("instagramButtonUrl", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="gallery.instagram"
                    items={gallery.instagram}
                    title="Instagram grid"
                    description="Tiles on /gallery, in this order. A tile with no image shows as a translucent placeholder."
                    itemLabel="post"
                    newItem={{ image: "", caption: "", link: "" }}
                    renderSummary={(item, index) => item.caption || item.link || `Tile ${index + 1}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <ImageField
                                label="Image"
                                aspect="aspect-[405/629]"
                                value={item.image}
                                onChange={(value) => updateItem("image", value)}
                            />
                            <Grid>
                                <TextField
                                    label="Caption"
                                    hint="Used as the image's alt text."
                                    value={item.caption}
                                    onChange={(value) => updateItem("caption", value)}
                                />
                                <TextField
                                    label="Links to"
                                    hint="Optional. A full URL, e.g. the post on Instagram."
                                    value={item.link}
                                    onChange={(value) => updateItem("link", value)}
                                />
                            </Grid>
                        </>
                    )}
                </CollectionEditor>

                <CollectionEditor
                    collection="gallery.web"
                    items={gallery.web}
                    title="Photo mosaic"
                    description="The /web-gallery layout has seven fixed slots. Give each image the slot it should fill."
                    itemLabel="image"
                    newItem={{ image: "", area: "a", caption: "" }}
                    renderSummary={(item) => `${item.area.toUpperCase()} — ${item.caption || "untitled"}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <ImageField
                                label="Image"
                                value={item.image}
                                onChange={(value) => updateItem("image", value)}
                            />
                            <Grid>
                                <SelectField
                                    label="Slot"
                                    value={item.area}
                                    options={AREAS}
                                    onChange={(value) => updateItem("area", value)}
                                />
                                <TextField
                                    label="Caption"
                                    hint="Used as the image's alt text."
                                    value={item.caption}
                                    onChange={(value) => updateItem("caption", value)}
                                />
                            </Grid>
                        </>
                    )}
                </CollectionEditor>

                {(duplicateAreas.length > 0 || missingAreas.length > 0) && (
                    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-inter text-sm text-amber-800">
                        {duplicateAreas.length > 0 && (
                            <>
                                Slots {duplicateAreas.join(", ").toUpperCase()} have more than one image, so
                                they will overlap.{" "}
                            </>
                        )}
                        {missingAreas.length > 0 && (
                            <>Slots {missingAreas.join(", ").toUpperCase()} are empty and will show a gap.</>
                        )}
                    </p>
                )}
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={save}
                onRevert={revert}
                onReset={() => {
                    if (window.confirm("Reset both gallery pages to the original content?")) resetToDefaults()
                }}
            />
        </>
    )
}

export default GalleryEditor
