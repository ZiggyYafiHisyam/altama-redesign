import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import ImageField from "../components/ImageField"
import { StringListField, TextAreaField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

// Everything that appears on more than one page: logos, the mascot, the brand
// chips, the contact details and the social links.
const IdentityEditor = () => {
    const site = useSectionDraft("site")
    const cta = useSectionDraft("cta")
    const { content } = useContent()

    const isDirty = site.isDirty || cta.isDirty
    const isSaving = site.isSaving || cta.isSaving

    const saveBoth = async () => {
        if (site.isDirty) await site.save()
        if (cta.isDirty) await cta.save()
    }

    const revertBoth = () => {
        if (site.isDirty) site.revert()
        if (cta.isDirty) cta.revert()
    }

    return (
        <>
            <PageHeader
                title="Identity & contact"
                description="Changing anything here changes it everywhere on the site at once."
                previewPath="/"
            />

            <div className="flex flex-col gap-6">
                <Card title="Names">
                    <Grid>
                        <TextField
                            label="Full company name"
                            value={site.get("companyName")}
                            onChange={(value) => site.update("companyName", value)}
                        />
                        <TextField
                            label="Short name"
                            hint="Used in tight spots, like the admin's own title."
                            value={site.get("shortName")}
                            onChange={(value) => site.update("shortName", value)}
                        />
                    </Grid>
                    <TextField
                        label="Hashtag"
                        hint="The pill on the hero sections."
                        value={site.get("hashtag")}
                        onChange={(value) => site.update("hashtag", value)}
                    />
                    <StringListField
                        label="Brand chips"
                        hint="The small labels above the headings on the Awards, Board and Life at Altama heroes."
                        addLabel="Add chip"
                        value={site.get("brandChips")}
                        onChange={(value) => site.update("brandChips", value)}
                    />
                </Card>

                <Card title="Logos & mascot">
                    <Grid>
                        <ImageField
                            label="Navbar logo"
                            value={site.get("navLogo")}
                            onChange={(value) => site.update("navLogo", value)}
                        />
                        <ImageField
                            label="Footer logo"
                            value={site.get("footerLogo")}
                            onChange={(value) => site.update("footerLogo", value)}
                        />
                    </Grid>
                    <Grid>
                        <ImageField
                            label="Brand logo strip"
                            hint="The Tekiro / Rexco / Ryu lockup on the home and vision heroes."
                            value={site.get("brandLogos")}
                            onChange={(value) => site.update("brandLogos", value)}
                        />
                        <ImageField
                            label="Mascot"
                            hint="Alva, floating bottom-right on the home page and on the contact card."
                            aspect="aspect-square"
                            value={site.get("mascot")}
                            onChange={(value) => site.update("mascot", value)}
                        />
                    </Grid>
                    <TextField
                        label="Mascot name"
                        hint="Used in the image's alt text and its link label."
                        value={site.get("mascotAlt")}
                        onChange={(value) => site.update("mascotAlt", value)}
                    />
                </Card>

                <Card
                    title="Contact details"
                    description="Shown on the contact page, and the address drives the map on the home page."
                >
                    <Grid columns={3}>
                        <TextField
                            label="Phone"
                            value={site.get("contact.phone")}
                            onChange={(value) => site.update("contact.phone", value)}
                        />
                        <TextField
                            label="Email"
                            value={site.get("contact.email")}
                            onChange={(value) => site.update("contact.email", value)}
                        />
                        <TextField
                            label="Short location"
                            hint="e.g. Jakarta, Indonesia."
                            value={site.get("contact.shortAddress")}
                            onChange={(value) => site.update("contact.shortAddress", value)}
                        />
                    </Grid>
                    <TextAreaField
                        label="Full address"
                        rows={3}
                        hint="Shown over the map. A new line here becomes a line break."
                        value={site.get("contact.address")}
                        onChange={(value) => site.update("contact.address", value)}
                    />
                    <TextField
                        label="Map search text"
                        hint="What the embedded Google map searches for. Keep it short and unambiguous."
                        value={site.get("contact.mapQuery")}
                        onChange={(value) => site.update("contact.mapQuery", value)}
                    />
                </Card>

                <Card
                    title="“Insights, Innovation, and Progress” panel"
                    description="The call-to-action that closes the careers, gallery and contact pages."
                >
                    <TextField
                        label="Heading"
                        value={cta.get("title")}
                        onChange={(value) => cta.update("title", value)}
                    />
                    <TextAreaField
                        label="Description"
                        rows={2}
                        value={cta.get("description")}
                        onChange={(value) => cta.update("description", value)}
                    />
                    <Grid>
                        <TextField
                            label="Button label"
                            value={cta.get("buttonLabel")}
                            onChange={(value) => cta.update("buttonLabel", value)}
                        />
                        <TextField
                            label="Button link"
                            value={cta.get("buttonPath")}
                            onChange={(value) => cta.update("buttonPath", value)}
                        />
                    </Grid>
                </Card>

                <CollectionEditor
                    collection="site.socials"
                    items={content.site.socials}
                    title="Social links"
                    description="The row of icons in the footer, in this order."
                    itemLabel="link"
                    newItem={{ label: "New network", url: "#", icon: "" }}
                    renderSummary={(item) => `${item.label} — ${item.url}`}
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <Grid>
                                <TextField
                                    label="Network"
                                    hint="Used as the link's accessible label."
                                    value={item.label}
                                    onChange={(value) => updateItem("label", value)}
                                />
                                <TextField
                                    label="URL"
                                    hint="A full URL. Leave it as # until you have one."
                                    value={item.url}
                                    onChange={(value) => updateItem("url", value)}
                                />
                            </Grid>
                            <ImageField
                                label="Icon"
                                aspect="aspect-square"
                                value={item.icon}
                                onChange={(value) => updateItem("icon", value)}
                            />
                        </>
                    )}
                </CollectionEditor>
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={saveBoth}
                onRevert={revertBoth}
                onReset={() => {
                    if (window.confirm("Reset the site identity and the shared call-to-action?")) {
                        site.resetToDefaults()
                        cta.resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default IdentityEditor
