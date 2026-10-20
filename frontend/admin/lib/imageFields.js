// Every image the public site renders, declared once.
//
// The admin only edits images -- all the site's copy lives in
// shared/defaultContent.js and is changed in code -- so this file is the whole
// map of what the admin can touch. pages/ImagesEditor.jsx renders it and
// lib/useImageDraft.js saves it; neither knows anything about the site's shape
// beyond what is here.
//
// A `path` is a dotted path into the content document, starting with the section
// (which is what gets PATCHed). A `list` is a path to an array of items that each
// carry one image: the items themselves are not editable here, only their image,
// because adding or removing one is a content change, not an image change. The
// exception is the gallery, which is nothing but images -- see pages/GalleryEditor.
//
// Aspect ratios are only the shape of the preview thumbnail, chosen to match how
// the site uses the image, so a wrong crop is obvious before saving.

export const IMAGE_GROUPS = [
    {
        id: "branding",
        title: "Logos & mascot",
        description: "Shown on every page: the navbar, the home hero and the footer.",
        previewPath: "/",
        fields: [
            { path: "site.navLogo", label: "Navbar logo", aspect: "aspect-square" },
            { path: "site.footerLogo", label: "Footer logo", aspect: "aspect-square" },
            {
                path: "site.brandLogos",
                label: "Brand logo strip",
                hint: "The Tekiro / Rexco / RYU row beneath the home hero.",
            },
            { path: "site.mascot", label: "Mascot (Alva)", aspect: "aspect-square" },
        ],
        lists: [
            {
                path: "site.socials",
                imageKey: "icon",
                labelKey: "label",
                title: "Social icons",
                description: "One per link in the footer. Square SVGs look best.",
                aspect: "aspect-square",
            },
        ],
    },
    {
        id: "home",
        title: "Home page",
        description: "The hero, the company intro, the two animated strips and the award block.",
        previewPath: "/",
        fields: [
            { path: "home.hero.backgroundImage", label: "Hero background" },
            { path: "home.companyPreview.sideImage", label: "Company intro photo" },
            {
                path: "home.companyPreview.headingImage",
                label: "“Company Overview” heading artwork",
            },
            { path: "home.companyPreview.categoryImage", label: "Product category artwork" },
            {
                path: "home.mediaBanner.image",
                label: "Media banner strip",
                hint: "The full-width animation above the Brand section.",
            },
            {
                path: "home.growBanner.image",
                label: "Careers banner strip",
                hint: "The full-width animation above the Career section.",
            },
            { path: "home.brand.headingImage", label: "“Our Brand” heading artwork" },
            { path: "home.brand.image", label: "Award block photo" },
        ],
    },
    {
        id: "visiMisi",
        title: "Vision & Mission",
        previewPath: "/visi-misi",
        fields: [{ path: "visiMisi.hero.backgroundImage", label: "Hero background" }],
    },
    {
        id: "awards",
        title: "Awards & Certifications",
        previewPath: "/award",
        fields: [{ path: "awards.hero.backgroundImage", label: "Hero background" }],
        lists: [
            {
                path: "awards.items",
                imageKey: "icon",
                labelKey: "title",
                title: "Award icons",
                aspect: "aspect-square",
            },
        ],
    },
    {
        id: "board",
        title: "Board of Directors",
        previewPath: "/board",
        fields: [{ path: "board.hero.backgroundImage", label: "Hero background" }],
        lists: [
            {
                path: "board.members",
                imageKey: "image",
                labelKey: "name",
                title: "Portraits",
                aspect: "aspect-[3/4]",
            },
            {
                path: "board.members",
                imageKey: "categoryImage",
                labelKey: "name",
                title: "Name artwork",
                description: "The lettering shown beside each portrait.",
            },
        ],
    },
    {
        id: "lifeAt",
        title: "Life at Altama",
        previewPath: "/life-at",
        fields: [{ path: "lifeAt.hero.backgroundImage", label: "Hero background" }],
        lists: [
            {
                path: "lifeAt.testimonials",
                imageKey: "avatar",
                labelKey: "name",
                title: "Testimonial photos",
                aspect: "aspect-square",
            },
        ],
    },
    {
        id: "news",
        title: "News",
        description: "The cover image of each article, on /detail-news and the article's own page.",
        previewPath: "/detail-news",
        lists: [
            {
                path: "news.articles",
                imageKey: "heroImage",
                labelKey: "title",
                title: "Article covers",
            },
        ],
    },
    {
        id: "footer",
        title: "Footer",
        previewPath: "/",
        fields: [
            { path: "footer.innovationImage", label: "“Innovation” lettering" },
            { path: "footer.copyrightImage", label: "Copyright line" },
        ],
    },
]

// The gallery is edited on its own page (pages/GalleryEditor.jsx): its images are
// a list you add to and delete from, drawn in the grid the site lays them out in,
// so a registry of fixed slots does not describe it.

const sectionOf = (path) => path.split(".")[0]

// The content sections one group touches -- what the editor has to PATCH when
// only that page is on screen.
export const sectionsOf = (group) => [
    ...new Set([
        ...(group.fields ?? []).map((field) => sectionOf(field.path)),
        ...(group.lists ?? []).map((list) => sectionOf(list.path)),
    ]),
]

// Which sections the editor has to PATCH. Derived rather than listed, so adding a
// field above is the only edit needed.
export const IMAGE_SECTIONS = [...new Set(IMAGE_GROUPS.flatMap(sectionsOf))]
