import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import ImageField from "../components/ImageField"
import ObjectListField from "../components/ObjectListField"
import { TextAreaField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

function slugify(value) {
    return String(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

const BrandsEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("brands")
    const { content } = useContent()
    const brands = content.brands.items

    return (
        <>
            <PageHeader
                title="Brands"
                description="Every brand here gets its own page at /brand/<slug>, and they link to each other automatically. Adding a brand needs nothing else."
                previewPath={`/brand/${brands[0]?.slug ?? ""}`}
            />

            <div className="flex flex-col gap-6">
                <Card title="Shared labels" description="Used on every brand page.">
                    <Grid>
                        <TextField
                            label="Products heading prefix"
                            hint="Followed by the brand's name, e.g. “Produk Tekiro”."
                            value={get("productsTitlePrefix")}
                            onChange={(value) => update("productsTitlePrefix", value)}
                        />
                        <TextField
                            label="“Other brands” heading"
                            value={get("otherBrandsTitle")}
                            onChange={(value) => update("otherBrandsTitle", value)}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            label="Contact button label"
                            value={get("contactButtonLabel")}
                            onChange={(value) => update("contactButtonLabel", value)}
                        />
                        <TextField
                            label="Awards button label"
                            value={get("awardButtonLabel")}
                            onChange={(value) => update("awardButtonLabel", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="brands.items"
                    items={brands}
                    title="Brands"
                    description="Deleting a brand removes its page and its links from the other brands."
                    itemLabel="brand"
                    newItem={{
                        slug: "",
                        name: "New brand",
                        category: "",
                        tagline: "",
                        description: "",
                        highlights: [],
                        products: [],
                    }}
                    renderSummary={(item) => `${item.name} — ${item.category}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <Grid>
                                <TextField
                                    label="Name"
                                    value={item.name}
                                    onChange={(value) => {
                                        updateItem("name", value)
                                        if (!item.slug) updateItem("slug", slugify(value))
                                    }}
                                />
                                <TextField
                                    label="URL slug"
                                    hint={`The page will be at /brand/${item.slug || "…"}`}
                                    value={item.slug}
                                    onChange={(value) => updateItem("slug", slugify(value))}
                                />
                            </Grid>
                            <Grid>
                                <TextField
                                    label="Category"
                                    hint="The small pill above the name, e.g. Hand Tools."
                                    value={item.category}
                                    onChange={(value) => updateItem("category", value)}
                                />
                                <TextField
                                    label="Tagline"
                                    hint="The yellow line under the name."
                                    value={item.tagline}
                                    onChange={(value) => updateItem("tagline", value)}
                                />
                            </Grid>
                            <TextAreaField
                                label="Description"
                                value={item.description}
                                onChange={(value) => updateItem("description", value)}
                            />

                            <ObjectListField
                                label="Highlight stats"
                                hint="The three small cards under the description. Saved with the brand."
                                itemLabel="stat"
                                addLabel="Add stat"
                                value={item.highlights}
                                onChange={(value) => updateItem("highlights", value)}
                                newItem={{ value: "", label: "" }}
                                renderSummary={(highlight) => `${highlight.value} — ${highlight.label}`}
                            >
                                {({ item: highlight, update: updateHighlight }) => (
                                    <Grid>
                                        <TextField
                                            label="Number"
                                            value={highlight.value}
                                            onChange={(value) => updateHighlight("value", value)}
                                        />
                                        <TextField
                                            label="Label"
                                            value={highlight.label}
                                            onChange={(value) => updateHighlight("label", value)}
                                        />
                                    </Grid>
                                )}
                            </ObjectListField>

                            <ObjectListField
                                label="Product images"
                                hint="Leave this empty to keep the eight placeholder tiles the page ships with."
                                itemLabel="product"
                                addLabel="Add product"
                                value={item.products}
                                onChange={(value) => updateItem("products", value)}
                                newItem={{ name: "", image: "" }}
                                renderSummary={(product, index) => product.name || `Product ${index + 1}`}
                            >
                                {({ item: product, update: updateProduct }) => (
                                    <>
                                        <TextField
                                            label="Product name"
                                            value={product.name}
                                            onChange={(value) => updateProduct("name", value)}
                                        />
                                        <ImageField
                                            label="Photo"
                                            aspect="aspect-square"
                                            value={product.image}
                                            onChange={(value) => updateProduct("image", value)}
                                        />
                                    </>
                                )}
                            </ObjectListField>
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
                    if (window.confirm("Reset every brand to the original content?")) resetToDefaults()
                }}
            />
        </>
    )
}

export default BrandsEditor
