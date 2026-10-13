import ImageField from "../components/ImageField"
import ObjectListField from "../components/ObjectListField"
import CollectionEditor from "../components/CollectionEditor"
import { SelectField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"
import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import { useToast } from "../lib/toast"

// Which artwork the desktop navbar draws for a menu. These four are the ones the
// design has images for; a menu with any other key falls back to plain text.
const MENU_KEYS = [
    { value: "profile", label: "Profile (plain dropdown)" },
    { value: "brand", label: "Brand (shaped panel)" },
    { value: "media", label: "Media Center (plain dropdown)" },
    { value: "career", label: "Career (shaped panel)" },
    { value: "custom", label: "No artwork — plain text" },
]

const NavigationEditor = () => {
    const navigation = useSectionDraft("navigation")
    const footer = useSectionDraft("footer")
    const { content } = useContent()
    const toast = useToast()

    const isDirty = navigation.isDirty || footer.isDirty
    const isSaving = navigation.isSaving || footer.isSaving

    const saveBoth = async () => {
        if (navigation.isDirty) await navigation.save()
        if (footer.isDirty) await footer.save()
    }

    const revertBoth = () => {
        if (navigation.isDirty) navigation.revert()
        if (footer.isDirty) footer.revert()
    }

    // The footer deliberately mirrors the navbar's site map, so there is a one
    // click way to bring it back in line after editing the menus. It stays a
    // choice rather than automatic, because the footer also carries links the
    // navbar does not (Contact Us).
    const copyMenusToFooter = () => {
        const columns = content.navigation.menus.map((menu) => ({
            id: `fc-${menu.key}`,
            title: menu.label,
            links: menu.items.map((item) => ({ id: item.id, label: item.label, path: item.path })),
        }))
        footer.update("columns", columns)
        toast.info("Footer columns copied from the menus. Review them, then save.")
    }

    return (
        <>
            <PageHeader
                title="Menus & footer"
                description="The navbar dropdowns and the footer's link columns. Both appear on every page."
                previewPath="/"
            />

            <div className="flex flex-col gap-6">
                <Card title="Navbar">
                    <TextField
                        label="Contact link label"
                        hint="The last item in the navbar."
                        value={navigation.get("contactLabel")}
                        onChange={(value) => navigation.update("contactLabel", value)}
                    />
                </Card>

                <CollectionEditor
                    collection="navigation.menus"
                    items={content.navigation.menus}
                    title="Navbar menus"
                    description="Top-level items, left to right. Each one links to a section of the home page and opens a dropdown."
                    itemLabel="menu"
                    newItem={{ key: "custom", label: "New menu", path: "/", items: [] }}
                    renderSummary={(item) => `${item.label} (${item.items?.length ?? 0} links)`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <Grid columns={3}>
                                <TextField
                                    label="Label"
                                    hint="Shown on mobile; desktop uses the artwork below."
                                    value={item.label}
                                    onChange={(value) => updateItem("label", value)}
                                />
                                <TextField
                                    label="Links to"
                                    hint="e.g. /#profile to scroll to that home-page section."
                                    value={item.path}
                                    onChange={(value) => updateItem("path", value)}
                                />
                                <SelectField
                                    label="Desktop artwork"
                                    value={item.key}
                                    options={MENU_KEYS}
                                    onChange={(value) => updateItem("key", value)}
                                />
                            </Grid>
                            <ObjectListField
                                label="Dropdown links"
                                hint="Leave empty to make this a plain link with no dropdown."
                                itemLabel="link"
                                addLabel="Add link"
                                value={item.items}
                                onChange={(value) => updateItem("items", value)}
                                newItem={{ label: "New link", path: "/" }}
                                renderSummary={(link) => `${link.label} → ${link.path}`}
                            >
                                {({ item: link, update: updateLink }) => (
                                    <Grid>
                                        <TextField
                                            label="Label"
                                            value={link.label}
                                            onChange={(value) => updateLink("label", value)}
                                        />
                                        <TextField
                                            label="Path"
                                            value={link.path}
                                            onChange={(value) => updateLink("path", value)}
                                        />
                                    </Grid>
                                )}
                            </ObjectListField>
                        </>
                    )}
                </CollectionEditor>

                <Card title="Footer artwork">
                    <Grid>
                        <ImageField
                            label="“Innovation” wordmark"
                            value={footer.get("innovationImage")}
                            onChange={(value) => footer.update("innovationImage", value)}
                        />
                        <ImageField
                            label="Copyright line"
                            hint="An image, so the year is baked in — replace it each year."
                            value={footer.get("copyrightImage")}
                            onChange={(value) => footer.update("copyrightImage", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="footer.columns"
                    items={content.footer.columns}
                    title="Footer columns"
                    description="Four columns fit the layout cleanly."
                    itemLabel="column"
                    newItem={{ title: "New column", links: [] }}
                    renderSummary={(item) => `${item.title} (${item.links?.length ?? 0} links)`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <TextField
                                label="Column heading"
                                value={item.title}
                                onChange={(value) => updateItem("title", value)}
                            />
                            <ObjectListField
                                label="Links"
                                itemLabel="link"
                                addLabel="Add link"
                                value={item.links}
                                onChange={(value) => updateItem("links", value)}
                                newItem={{ label: "New link", path: "/" }}
                                renderSummary={(link) => `${link.label} → ${link.path}`}
                            >
                                {({ item: link, update: updateLink }) => (
                                    <Grid>
                                        <TextField
                                            label="Label"
                                            value={link.label}
                                            onChange={(value) => updateLink("label", value)}
                                        />
                                        <TextField
                                            label="Path"
                                            value={link.path}
                                            onChange={(value) => updateLink("path", value)}
                                        />
                                    </Grid>
                                )}
                            </ObjectListField>
                        </>
                    )}
                </CollectionEditor>

                <Card
                    title="Keep them in step"
                    description="The footer is meant to mirror the navbar's site map. This rewrites the footer columns from the menus above — review the result before saving, since it drops any footer-only links."
                >
                    <button
                        type="button"
                        className="self-start rounded-xl border border-slate-200 px-4 py-2 font-inter text-sm font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
                        onClick={copyMenusToFooter}
                    >
                        Copy menus into footer columns
                    </button>
                </Card>
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={saveBoth}
                onRevert={revertBoth}
                onReset={() => {
                    if (window.confirm("Reset the menus and the footer to the original content?")) {
                        navigation.resetToDefaults()
                        footer.resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default NavigationEditor
