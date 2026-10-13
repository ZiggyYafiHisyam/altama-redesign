import { useSectionDraft } from "../lib/useDraft"
import { TextAreaField, TextField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

// Two small sections on one page, because they are two halves of the same journey:
// the contact form and the thank-you page it lands on.
const ContactEditor = () => {
    const contact = useSectionDraft("contactPage")
    const thanks = useSectionDraft("thanksPage")

    const isDirty = contact.isDirty || thanks.isDirty
    const isSaving = contact.isSaving || thanks.isSaving

    const saveBoth = async () => {
        if (contact.isDirty) await contact.save()
        if (thanks.isDirty) await thanks.save()
    }

    const revertBoth = () => {
        if (contact.isDirty) contact.revert()
        if (thanks.isDirty) thanks.revert()
    }

    return (
        <>
            <PageHeader
                title="Contact & Thanks"
                description="The /contact-us page and the /terimakasih confirmation it redirects to. Phone, email and address live under Identity & contact."
                previewPath="/contact-us"
            />

            <div className="flex flex-col gap-6">
                <Card title="Contact page">
                    <Grid>
                        <TextField
                            label="Heading — before"
                            value={contact.get("titleBefore")}
                            onChange={(value) => contact.update("titleBefore", value)}
                        />
                        <TextField
                            label="Heading — highlight"
                            hint="Shown in yellow."
                            value={contact.get("titleHighlight")}
                            onChange={(value) => contact.update("titleHighlight", value)}
                        />
                    </Grid>
                    <TextAreaField
                        label="Subtitle"
                        rows={2}
                        value={contact.get("subtitle")}
                        onChange={(value) => contact.update("subtitle", value)}
                    />
                    <Grid>
                        <TextField
                            label="Mascot card — title"
                            value={contact.get("cardTitle")}
                            onChange={(value) => contact.update("cardTitle", value)}
                        />
                        <TextField
                            label="Mascot card — text"
                            value={contact.get("cardText")}
                            onChange={(value) => contact.update("cardText", value)}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            label="Submit button"
                            value={contact.get("submitLabel")}
                            onChange={(value) => contact.update("submitLabel", value)}
                        />
                        <TextField
                            label="Submit button while sending"
                            value={contact.get("submittingLabel")}
                            onChange={(value) => contact.update("submittingLabel", value)}
                        />
                    </Grid>
                </Card>

                <Card title="Thank-you page" description="Shown after either contact form is submitted.">
                    <Grid>
                        <TextField
                            label="Heading"
                            value={thanks.get("title")}
                            onChange={(value) => thanks.update("title", value)}
                        />
                        <TextField
                            label="Bold first line"
                            value={thanks.get("headline")}
                            onChange={(value) => thanks.update("headline", value)}
                        />
                    </Grid>
                    <TextAreaField
                        label="Message"
                        rows={2}
                        hint="A new line here becomes a line break."
                        value={thanks.get("description")}
                        onChange={(value) => thanks.update("description", value)}
                    />
                    <Grid>
                        <TextField
                            label="Button label"
                            value={thanks.get("buttonLabel")}
                            onChange={(value) => thanks.update("buttonLabel", value)}
                        />
                        <TextField
                            label="Button link"
                            value={thanks.get("buttonPath")}
                            onChange={(value) => thanks.update("buttonPath", value)}
                        />
                    </Grid>
                </Card>
            </div>

            <SaveBar
                isDirty={isDirty}
                isSaving={isSaving}
                onSave={saveBoth}
                onRevert={revertBoth}
                onReset={() => {
                    if (window.confirm("Reset both pages to the original content?")) {
                        contact.resetToDefaults()
                        thanks.resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default ContactEditor
