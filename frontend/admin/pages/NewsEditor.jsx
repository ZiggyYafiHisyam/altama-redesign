import { useContent } from "../../lib/content"
import { useSectionDraft } from "../lib/useDraft"
import CollectionEditor from "../components/CollectionEditor"
import ImageField from "../components/ImageField"
import ObjectListField from "../components/ObjectListField"
import { StringListField, TextAreaField, TextField, ToggleField } from "../components/Fields"
import { Card, Grid, PageHeader, SaveBar } from "../components/Page"

// Turns a title into a URL-safe slug, so writing an article does not mean
// hand-building its address.
function slugify(title) {
    return String(title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

const NewsEditor = () => {
    const { get, update, isDirty, isSaving, save, revert, resetToDefaults } = useSectionDraft("news")
    const { content } = useContent()
    const articles = content.news.articles
    const featuredCount = articles.filter((article) => article.featured).length

    return (
        <>
            <PageHeader
                title="News"
                description="Each article gets its own page at /news/<slug>, and the featured one is what /detail-news opens with. The others appear in the “Latest News” rail."
                previewPath="/detail-news"
            />

            <div className="flex flex-col gap-6">
                <Card title="Rail heading">
                    <TextField
                        label="“Latest News” heading"
                        value={get("latestTitle")}
                        onChange={(value) => update("latestTitle", value)}
                    />
                </Card>

                {featuredCount === 0 && articles.length > 0 && (
                    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-inter text-sm text-amber-800">
                        No article is featured, so /detail-news falls back to the first one in this list.
                    </p>
                )}
                {featuredCount > 1 && (
                    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-inter text-sm text-amber-800">
                        {featuredCount} articles are featured. /detail-news shows whichever comes first here.
                    </p>
                )}

                <CollectionEditor
                    collection="news.articles"
                    items={articles}
                    title="Articles"
                    itemLabel="article"
                    newItem={{
                        slug: "",
                        title: "New article",
                        excerpt: "",
                        heroImage: "",
                        featured: false,
                        tags: [],
                        sections: [],
                    }}
                    renderSummary={(item) =>
                        `${item.title}${item.featured ? "  ·  featured" : ""}`
                    }
                >
                    {({ item, update: updateItem }) => (
                        <>
                            <TextField
                                label="Title"
                                value={item.title}
                                onChange={(value) => {
                                    updateItem("title", value)
                                    // Fill the slug in while it is still untouched, and
                                    // leave it alone once it has been set, so published
                                    // URLs do not change under a retitle.
                                    if (!item.slug) updateItem("slug", slugify(value))
                                }}
                            />
                            <Grid>
                                <TextField
                                    label="URL slug"
                                    hint={`The page will be at /news/${item.slug || "…"}`}
                                    value={item.slug}
                                    onChange={(value) => updateItem("slug", slugify(value))}
                                />
                                <ToggleField
                                    label="Feature this article"
                                    hint="The featured article is what /detail-news opens with."
                                    value={item.featured}
                                    onChange={(value) => updateItem("featured", value)}
                                />
                            </Grid>
                            <TextAreaField
                                label="Excerpt"
                                rows={3}
                                hint="The standfirst under the title, and the summary in the Latest News rail."
                                value={item.excerpt}
                                onChange={(value) => updateItem("excerpt", value)}
                            />
                            <ImageField
                                label="Header image"
                                value={item.heroImage}
                                onChange={(value) => updateItem("heroImage", value)}
                            />
                            <StringListField
                                label="Tags"
                                hint="Shown as grey pills. The date is usually the first one."
                                addLabel="Add tag"
                                value={item.tags}
                                onChange={(value) => updateItem("tags", value)}
                            />
                            <ObjectListField
                                label="Body"
                                hint="The article is a series of titled sections. Saved with the article."
                                itemLabel="section"
                                addLabel="Add section"
                                value={item.sections}
                                onChange={(value) => updateItem("sections", value)}
                                newItem={{ title: "New section", paragraphs: [""] }}
                                renderSummary={(section) => section.title}
                            >
                                {({ item: section, update: updateSection }) => (
                                    <>
                                        <TextField
                                            label="Section heading"
                                            value={section.title}
                                            onChange={(value) => updateSection("title", value)}
                                        />
                                        <StringListField
                                            label="Paragraphs"
                                            multiline
                                            addLabel="Add paragraph"
                                            value={section.paragraphs}
                                            onChange={(value) => updateSection("paragraphs", value)}
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
                    if (window.confirm("Reset News, including every article, to the original content?")) {
                        resetToDefaults()
                    }
                }}
            />
        </>
    )
}

export default NewsEditor
