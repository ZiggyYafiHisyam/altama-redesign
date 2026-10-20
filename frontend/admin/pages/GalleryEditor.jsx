import { defaultContent } from "../../../shared/defaultContent.js"
import ImageTile, { TileButton } from "../components/ImageTile"
import { Card, PageHeader, SaveBar } from "../components/Page"
import { useImageDraft } from "../lib/useImageDraft"

// The gallery is edited in place: both grids are drawn the way the site draws
// them, and a picture is swapped by clicking the picture. That is the whole point
// of this page -- the tiles are already there, so adding and deleting is the rare
// case and replacing is the common one.
//
// Everything is one draft of the `gallery` section, saved in a single PATCH, which
// is why adding, deleting and reordering happen locally and need a Save. A section
// PATCH takes arrays wholesale (see backend/src/services/contentStore.js), so the
// saved list is exactly what is on screen.
const GALLERY_SECTIONS = ["gallery"]

// The mosaic's shape, mirroring GRID_TEMPLATE_AREAS in WebGalleryComp. Each letter
// is a slot an image claims through its `area`, so the editor can lay the slots out
// rather than asking which letter an image belongs in.
const MOSAIC_AREAS = `
    "a b b c"
    "a d e c"
    "f g e c"
`

const SLOTS = ["a", "b", "c", "d", "e", "f", "g"]

function newId(prefix) {
    const suffix =
        typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID().slice(0, 8)
            : Math.random().toString(36).slice(2, 10)
    return `${prefix}-${suffix}`
}

const GalleryEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, restore } = useImageDraft(GALLERY_SECTIONS)

    const web = get("gallery.web") ?? []
    const instagram = get("gallery.instagram") ?? []

    // A slot holds at most one image. Any further image claiming the same slot
    // would stack on top of it on the live site, so those are surfaced separately
    // rather than hidden behind the one the mosaic shows.
    const bySlot = Object.fromEntries(SLOTS.map((area) => [area, web.find((item) => item.area === area)]))
    const extras = web.filter((item) => bySlot[item.area] !== item)
    const emptySlots = SLOTS.filter((area) => !bySlot[area]?.image)

    const setWebImage = (area, value) => {
        const existing = bySlot[area]
        if (existing) {
            update(
                "gallery.web",
                web.map((item) => (item === existing ? { ...item, image: value } : item)),
            )
            return
        }
        // No tile claims this slot yet: the first image dropped on it creates one.
        update("gallery.web", [...web, { id: newId("wg"), image: value, area, caption: "" }])
    }

    const removeWebItem = (target) => {
        update("gallery.web", web.filter((item) => item !== target))
    }

    const setInstagramImage = (index, value) => {
        update(
            "gallery.instagram",
            instagram.map((item, itemIndex) => (itemIndex === index ? { ...item, image: value } : item)),
        )
    }

    const addInstagramTile = () => {
        update("gallery.instagram", [
            ...instagram,
            { id: newId("ig"), image: "", caption: "", link: "" },
        ])
    }

    const removeInstagramTile = (index) => {
        update("gallery.instagram", instagram.filter((_, itemIndex) => itemIndex !== index))
    }

    const moveInstagramTile = (index, direction) => {
        const target = index + direction
        if (target < 0 || target >= instagram.length) return
        const next = [...instagram]
        ;[next[index], next[target]] = [next[target], next[index]]
        update("gallery.instagram", next)
    }

    return (
        <>
            <PageHeader
                title="Gallery images"
                description="Both grids are shown the way the site lays them out. Click a tile to replace its picture — upload a file, drop one on it, or pick from the library — then save."
                previewPath="/web-gallery"
            />

            <div className="flex flex-col gap-6">
                <Card
                    title="Photo mosaic — /web-gallery"
                    description="The seven slots of the mosaic, in the shape the page renders them. A slot with no picture shows as a gap on the site."
                >
                    <div
                        className="grid grid-cols-4 gap-3"
                        style={{ gridTemplateAreas: MOSAIC_AREAS, gridTemplateRows: "repeat(3, 150px)" }}
                    >
                        {SLOTS.map((area) => (
                            <ImageTile
                                key={area}
                                style={{ gridArea: area }}
                                className="h-full"
                                label={`Slot ${area.toUpperCase()}`}
                                emptyHint="Empty slot — upload or drop a photo here"
                                value={bySlot[area]?.image ?? ""}
                                onChange={(value) => setWebImage(area, value)}
                            />
                        ))}
                    </div>

                    {emptySlots.length > 0 && (
                        <p className="font-inter text-xs text-slate-500">
                            {emptySlots.length === 1
                                ? `Slot ${emptySlots[0].toUpperCase()} is empty`
                                : `Slots ${emptySlots.join(", ").toUpperCase()} are empty`}{" "}
                            and will show a gap on the page.
                        </p>
                    )}

                    {extras.length > 0 && (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <p className="mb-3 font-inter text-sm text-amber-800">
                                {extras.length === 1 ? "One image claims" : `${extras.length} images claim`} a
                                slot that is already taken, so {extras.length === 1 ? "it sits" : "they sit"}{" "}
                                underneath the mosaic above. Delete or re-slot{" "}
                                {extras.length === 1 ? "it" : "them"}.
                            </p>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {extras.map((item) => (
                                    <ImageTile
                                        key={item.id}
                                        className="aspect-4/3"
                                        label={`Slot ${String(item.area ?? "?").toUpperCase()}`}
                                        value={item.image}
                                        onChange={(value) =>
                                            update(
                                                "gallery.web",
                                                web.map((entry) =>
                                                    entry === item ? { ...entry, image: value } : entry,
                                                ),
                                            )
                                        }
                                    >
                                        <TileButton
                                            title="Delete this image"
                                            onClick={() => removeWebItem(item)}
                                        >
                                            Delete
                                        </TileButton>
                                    </ImageTile>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                <Card
                    title="Instagram grid — /gallery"
                    description="Tiles in the order the page shows them. Replace a picture in place, or add a tile when you need another one."
                >
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {instagram.map((post, index) => (
                            <ImageTile
                                key={post.id ?? index}
                                className="aspect-405/629"
                                label={`${index + 1}`}
                                emptyHint="Empty tile — shows as a placeholder"
                                value={post.image}
                                onChange={(value) => setInstagramImage(index, value)}
                            >
                                <TileButton
                                    title="Move earlier"
                                    onClick={() => moveInstagramTile(index, -1)}
                                    disabled={index === 0}
                                >
                                    ←
                                </TileButton>
                                <TileButton
                                    title="Move later"
                                    onClick={() => moveInstagramTile(index, 1)}
                                    disabled={index === instagram.length - 1}
                                >
                                    →
                                </TileButton>
                                <TileButton title="Delete this tile" onClick={() => removeInstagramTile(index)}>
                                    Delete
                                </TileButton>
                            </ImageTile>
                        ))}

                        <button
                            type="button"
                            className="flex aspect-405/629 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 font-inter text-sm font-semibold text-slate-500 transition-colors hover:border-primary hover:text-primary"
                            onClick={addInstagramTile}
                        >
                            <span className="text-2xl leading-none">+</span>
                            Add tile
                        </button>
                    </div>
                </Card>
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={save}
                onRevert={revert}
                onReset={() => {
                    if (
                        window.confirm(
                            "Put both galleries back to the images the site shipped with? Nothing is saved until you press Save.",
                        )
                    ) {
                        restore((draft) => {
                            draft.gallery.web = JSON.parse(JSON.stringify(defaultContent.gallery.web))
                            draft.gallery.instagram = JSON.parse(
                                JSON.stringify(defaultContent.gallery.instagram),
                            )
                        }, "Original gallery images restored in the editor. Save to publish them.")
                    }
                }}
                resetLabel="Restore original images"
            />
        </>
    )
}

export default GalleryEditor
