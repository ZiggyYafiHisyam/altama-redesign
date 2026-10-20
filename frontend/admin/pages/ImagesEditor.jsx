import { useMemo } from "react"
import { Navigate, useParams } from "react-router-dom"
import ImageField from "../components/ImageField"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"
import { IMAGE_GROUPS, sectionsOf } from "../lib/imageFields"
import { restoreGroupImages, useImageDraft } from "../lib/useImageDraft"

// One page of the site at a time: the sidebar's "Site images" menu lists every
// page that has images, and this renders whichever one is open. The groups and
// their fields come from lib/imageFields.js, so this page has no knowledge of the
// site's structure -- adding an image to the registry adds it here, and adding a
// group adds an entry to the menu.
const ImagesEditor = () => {
    const { groupId } = useParams()
    const group = IMAGE_GROUPS.find((candidate) => candidate.id === groupId)

    // /admin/images on its own, or an id that no longer exists, opens the first
    // page rather than showing an empty editor.
    if (!group) return <Navigate to={`/admin/images/${IMAGE_GROUPS[0].id}`} replace />

    return <GroupEditor key={group.id} group={group} />
}

// Keyed on the group above, so switching pages mounts a fresh draft of only that
// page's sections instead of carrying the previous one's over.
function GroupEditor({ group }) {
    const sections = useMemo(() => sectionsOf(group), [group])
    const { get, update, isDirty, isSaving, save, revert, restore } = useImageDraft(sections)

    return (
        <>
            <PageHeader
                title={group.title}
                description={
                    group.description ??
                    "Swap any picture on this page. Upload a new file, pick one from the library, or reuse an image the site shipped with — then save."
                }
                previewPath={group.previewPath}
            />

            <div className="flex flex-col gap-6">
                {group.fields?.length > 0 && (
                    <Card>
                        <Grid>
                            {group.fields.map((field) => (
                                <ImageField
                                    key={field.path}
                                    label={field.label}
                                    hint={field.hint}
                                    aspect={field.aspect}
                                    value={get(field.path)}
                                    onChange={(value) => update(field.path, value)}
                                />
                            ))}
                        </Grid>
                    </Card>
                )}

                {group.lists?.map((list) => (
                    <Card
                        key={`${list.path}.${list.imageKey}`}
                        title={list.title}
                        description={list.description}
                    >
                        <ListImages
                            list={list}
                            items={get(list.path) ?? []}
                            get={get}
                            update={update}
                        />
                    </Card>
                ))}
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={save}
                onRevert={revert}
                onReset={() => {
                    if (
                        window.confirm(
                            `Put every image on ${group.title} back to the one the site shipped with? Nothing is saved until you press Save.`,
                        )
                    ) {
                        restore(
                            restoreGroupImages(group),
                            "Original images restored in the editor. Save to publish them.",
                        )
                    }
                }}
                resetLabel="Restore original images"
            />
        </>
    )
}

// One image per item in a content list -- a board member's portrait, an article's
// cover. The items are labelled by their own content so a row is recognisable, but
// only the image is editable; adding or removing an item is a content change.
function ListImages({ list, items, get, update }) {
    if (items.length === 0) {
        return <p className="font-inter text-sm text-slate-400">This list is empty.</p>
    }

    return (
        <Grid>
            {items.map((item, index) => {
                const path = `${list.path}.${index}.${list.imageKey}`
                return (
                    <ImageField
                        key={item.id ?? index}
                        label={item[list.labelKey] || `Item ${index + 1}`}
                        aspect={list.aspect}
                        value={get(path)}
                        onChange={(value) => update(path, value)}
                    />
                )
            })}
        </Grid>
    )
}

export default ImagesEditor
