// The entire editable content of the public site, in one place.
//
// This module is imported by BOTH sides of the app, so it must stay plain,
// dependency-free JavaScript:
//   - the backend (backend/src/services/contentStore.js) seeds and repairs the
//     stored content document from it, and
//   - the frontend (frontend/lib/content.jsx) falls back to it whenever the API
//     cannot be reached, so the site still renders fully offline.
//
// IMAGES. Every image is a string, and three forms are understood (see
// frontend/lib/assets.js, which resolves them):
//   "asset:hero/hero.png"  a file bundled in frontend/assets -- the shipped default
//   "/api/media/<id>"      an image uploaded through the admin media library
//   "https://..."          any external URL
// Node never resolves these, it only stores them, which is why they are keys
// and not Vite imports.
//
// IDS. Every item in an editable list carries a stable `id`. The admin CRUD
// endpoints address items by it, so ids must never be reused or renumbered.

export const CONTENT_VERSION = 1

export const defaultContent = {
    version: CONTENT_VERSION,

    // Shown across every page: logos, the mascot, brand chips, contact details.
    site: {
        companyName: "PT Altama Surya Anugerah",
        shortName: "Altama",
        hashtag: "#AltamaGueBanget",
        navLogo: "asset:navbar/Logo.svg",
        footerLogo: "asset:footer/LogoAltama.svg",
        brandLogos: "asset:hero/logoBrand.png",
        mascot: "asset:hero/ALVA.png",
        mascotAlt: "Alva",
        brandChips: ["TEKIRO", "REXCO", "RYU"],
        contact: {
            phone: "+62 xxx xxxx xxxx",
            email: "info@altama.co.id",
            shortAddress: "Jakarta, Indonesia",
            address:
                "Jl. Bandung Utara 85A No. 8-9, RT.3/RW.16,\nPenjaringan, Kecamatan Penjaringan, Jakarta, Daerah\nKhusus Ibukota Jakarta 14440",
            mapQuery:
                "Jl. Bandung Utara 85A No. 8-9 RT.3/RW.16 Penjaringan Jakarta Utara",
        },
        socials: [
            { id: "soc-wa", label: "WhatsApp", url: "#", icon: "asset:footer/wa.svg" },
            { id: "soc-fb", label: "Facebook", url: "#", icon: "asset:footer/fb.svg" },
            { id: "soc-yt", label: "YouTube", url: "#", icon: "asset:footer/yt.svg" },
            { id: "soc-li", label: "LinkedIn", url: "#", icon: "asset:footer/linkend.svg" },
            { id: "soc-ig", label: "Instagram", url: "#", icon: "asset:footer/ig.svg" },
        ],
    },

    // The "Insights, Innovation, and Progress" panel reused at the bottom of the
    // careers, gallery and contact pages.
    cta: {
        title: "Insights, Innovation, and Progress",
        description:
            "Temukan solusi terbaik untuk kebutuhan teknik, otomotif, dan industri Anda.",
        buttonLabel: "Explore News",
        buttonPath: "/detail-news",
    },

    home: {
        hero: {
            badge: "#AltamaGueBanget",
            titleBefore: "THE POWER OF",
            titleHighlight: "INNOVATION",
            titleAfter: " FOR A\nSTRONGER NATION.",
            subtitle:
                "Your partner in progress, empowering every\nstep toward Indonesia’s success.",
            backgroundImage: "asset:hero/hero.png",
        },
        companyPreview: {
            sideImage: "asset:company/image.png",
            headingImage: "asset:company/companyOverview.svg",
            titleHighlight: "PT Altama Surya Anugerah",
            titleRest:
                " adalah distributor resmi merek Tekiro, RYU, dan Rexco di Indonesia.",
            description:
                "Kami menghadirkan perkakas, mesin, dan chemical berkualitas tinggi yang kokoh, inovatif, dan terpercaya. Dengan jaringan distribusi luas, kami menjadi mitra bagi para profesional maupun individu dalam mendukung berbagai kebutuhan.",
            categoryImage: "asset:company/category.svg",
            buttonLabel: "Read More",
            buttonPath: "/visi-misi",
        },
        // The full-width animated strips above the Brand and Career sections.
        mediaBanner: { image: "asset:motion/carasip.gif", alt: "" },
        growBanner: { image: "asset:motion/yellowMotion.gif", alt: "Grow banner" },
        brand: {
            headingImage: "asset:brand/ourBrand.png",
            titleBefore: "DIGITAL",
            titleHighlight: " POPULER BRAND",
            titleAfter: " AWARD 2023",
            description:
                "Tahun ini kembali PT.Altama Surya Anugerah mengawinkan Digital Populer Brand Award 2023 untuk brand Tekiro kategori Handtools dan Ryu kategori Powertools.",
            stats: [
                { id: "stat-tekiro", value: "7", label: "Penghargaan yang diterima brand Tekiro" },
                { id: "stat-ryu", value: "3", label: "Penghargaan yang diterima Ryu berturut-turut" },
            ],
            buttonLabel: "Read More",
            buttonPath: "/award",
            image: "asset:brand/award.png",
        },
        careers: {
            titleBefore: "GROW WITH US ",
            titleHighlight: "AT ALTAMA!",
            searchPlaceholder: "Search job position...",
            // How many of careers.jobs to show on the home page.
            jobLimit: 4,
            buttonLabel: "Apply Now",
            buttonPath: "/grow-with",
            warningTitle: "HATI-HATI PENIPUAN",
            warningText:
                "PT Altama Surya Anugerah tidak pernah meminta biaya dalam proses rekrutmen maupun transaksi. Pastikan Anda hanya berkomunikasi melalui kontak resmi kami",
        },
        location: {
            titleBefore: "OUR ",
            titleHighlight: "LOCATION",
            nameLabel: "Your Name",
            namePlaceholder: "Your Your Name",
            emailLabel: "Email Address",
            emailPlaceholder: "Your Email Address",
            messageLabel: "Message",
            messagePlaceholder: "Write Something...",
            buttonLabel: "Send Message",
        },
    },

    visiMisi: {
        hero: {
            titleBefore: "Our Vision, Mission &",
            titleHighlight: "Company Values",
            titleAfter: "",
            subtitle:
                "Fondasi yang membentuk Altama Surya Anugerah\nsdalam berkarya dan berkembang.",
            badge: "#AltamaGueBanget",
            backgroundImage: "asset:hero/heroVisi.png",
        },
        visionLabel: "VISI",
        missionLabel: "MISI",
        vision:
            "Menjadi distributor terpercaya di Indonesia untuk peralatan teknik, otomotif, dan industri, dengan produk berkualitas tinggi yang mendukung profesional, pelaku usaha, hingga pengguna rumahan.",
        missions: [
            { id: "mis-1", text: "Menghadirkan produk berkualitas tinggi dengan standar internasional." },
            { id: "mis-2", text: "Mendukung kebutuhan masyarakat, profesional, dan industri." },
            { id: "mis-3", text: "Memperluas jaringan distribusi agar produk mudah dijangkau di seluruh Indonesia." },
            { id: "mis-4", text: "Terus meningkatkan inovasi dan ekspansi sesuai perkembangan pasar." },
        ],
        coreValueTitleBefore: "CORE ",
        coreValueTitleHighlight: "VALUE",
        coreValues: [
            { id: "cv-integrity", title: "Integrity", subtitle: "Konsisten dan dapat dipercaya.", active: false },
            { id: "cv-innovation", title: "Innovation", subtitle: "Selalu menghadirkan solusi lebih baik.", active: true },
            { id: "cv-collaboration", title: "Collaboration", subtitle: "Bekerja sama untuk tujuan yang sama.", active: false },
            { id: "cv-customer", title: "Customer Focus", subtitle: "Mengutamakan kepuasan dan kebutuhan pelanggan.", active: false },
        ],
        coreValueTitle: "CORE VALUE",
        milestoneTitle: "MILESTONE",
        milestones: [
            { id: "ms-2011", year: "2011", description: "Altama berdiri di Jakarta, memulai perjalanan sebagai distributor teknik." },
            { id: "ms-2015", year: "2015", description: "Perluasan jaringan distribusi ke lebih banyak kota besar." },
            { id: "ms-2018", year: "2018", description: "Penambahan produk baru: Tekiro Handtools, RYU Power Tools, Rexco Chemicals." },
            { id: "ms-2021", year: "2021", description: "Pertumbuhan bisnis dan penguatan jaringan distribusi nasional." },
            { id: "ms-2024", year: "2024", description: "Terus berkembang menghadirkan solusi terbaik untuk Indonesia." },
        ],
    },

    awards: {
        hero: {
            titleBefore: "Awards &",
            titleHighlight: "Certifications",
            titleAfter: "",
            subtitle: "Leadership driving Altama's growth and excellence",
            badge: "#AltamaGueBanget",
            backgroundImage: "asset:brand/award.png",
        },
        items: [
            {
                id: "aw-recognition",
                title: "AWARD RECOGNITION",
                description:
                    "Penghargaan ini menegaskan posisi Altama sebagai distributor nasional dengan kekuatan merek yang terpercaya di Indonesia.",
                icon: "asset:icon/award.svg",
                // "primary" = white text on the purple gradient, "muted" = grey card.
                variant: "primary",
            },
            {
                id: "aw-iso",
                title: "INTERNATIONAL STANDARD: - ISO 9001:2015 (QUALITY POLICY)",
                description:
                    "Sertifikasi ini memastikan seluruh proses bisnis Altama memenuhi standar mutu internasional dan berorientasi pada kepuasan pelanggan.",
                icon: "asset:icon/singal.svg",
                variant: "muted",
            },
        ],
    },

    board: {
        hero: {
            titleBefore: "Board of",
            titleHighlight: "Directors",
            titleAfter: "",
            subtitle: "Leadership driving Altama's growth and excellence",
            badge: "#AltamaGueBanget",
            backgroundImage: "asset:board/boardHero.png",
        },
        members: [
            {
                id: "bm-oscar",
                name: "Oscar Andrew Sutjadi",
                role: "Director, PT Altama Surya Anugerah",
                image: "asset:board/oscar.png",
                categoryImage: "asset:board/categoryOscar.png",
                paragraphs: [
                    "Oscar Andrew Sutjadi adalah Director PT Altama Surya Anugerah yang berperan dalam mengarahkan strategi bisnis dan pengembangan perusahaan sebagai distributor nasional peralatan teknik, otomotif, dan industri.",
                    "Ia berfokus pada penguatan jaringan distribusi, pengembangan merek Tekiro, RYU, dan Rexco, serta memastikan pertumbuhan perusahaan berjalan secara berkelanjutan dengan tetap mengedepankan kualitas dan profesionalisme.",
                ],
            },
            {
                id: "bm-stephanus",
                name: "Stephanus Ferdinand Santoso",
                role: "Vice Director, PT Altama Surya Anugerah",
                image: "asset:board/stephanus.png",
                categoryImage: "asset:board/categoryStephanus.png",
                paragraphs: [
                    "Stephanus Ferdinand Santoso menjabat sebagai Vice Director PT Altama Surya Anugerah dengan tanggung jawab utama pada pengelolaan operasional dan peningkatan efektivitas organisasi.",
                    "Dengan latar belakang teknik dan manajemen, ia berperan dalam menjaga standar mutu, mengoptimalkan proses kerja, serta mendukung pertumbuhan perusahaan melalui sistem yang efisien dan berkelanjutan.",
                ],
            },
        ],
    },

    lifeAt: {
        hero: {
            titleBefore: "",
            titleHighlight: "JOIN US HERE!",
            titleAfter: "\nGROW TOGETHER",
            subtitle:
                "Your partner in progress, empowering every\nstep toward Indonesia's success.",
            badge: "#AltamaGueBanget",
            backgroundImage: "asset:LifeAt/heroLifeAt.png",
        },
        testimonialsEyebrow: "Testimonials",
        testimonialsTitle: "What our partners say about Altama",
        testimonials: [
            {
                id: "ts-1",
                name: "Marvin McKinney",
                role: "Louis Vuitton",
                quote: "Altama selalu konsisten menyediakan produk berkualitas dengan distribusi yang tepat waktu.",
                avatar: "asset:LifeAt/VideoTestimoni.png",
                rating: 5,
            },
            {
                id: "ts-2",
                name: "Andi Pratama",
                role: "Procurement Manager - Retail Partner",
                quote: "Timnya profesional dan mudah diajak bekerja sama.",
                avatar: "asset:LifeAt/VideoTestimoni.png",
                rating: 5,
            },
            {
                id: "ts-3",
                name: "Marvin McKinney",
                role: "Louis Vuitton",
                quote: "Produk Tekiro dan RYU dapat diandalkan untuk kebutuhan pekerjaan.",
                avatar: "asset:LifeAt/VideoTestimoni.png",
                rating: 5,
            },
            {
                id: "ts-4",
                name: "Sarah Williams",
                role: "Business Partner",
                quote: "Pelayanan dan kualitas produk Altama membantu bisnis kami berkembang.",
                avatar: "asset:LifeAt/VideoTestimoni.png",
                rating: 5,
            },
            {
                id: "ts-5",
                name: "Dimas Saputra",
                role: "Retail Partner",
                quote: "Kolaborasi yang baik dengan dukungan distribusi yang terpercaya.",
                avatar: "asset:LifeAt/VideoTestimoni.png",
                rating: 5,
            },
        ],
    },

    careers: {
        hero: {
            titleBefore: "GROW WITH US ",
            titleHighlight: "AT ALTAMA!",
            titleAfter: "",
            searchPlaceholder: "Search job position...",
        },
        applyLabel: "Apply Now",
        // One list, shown in full on /grow-with and as the first `home.careers.jobLimit`
        // entries on the home page -- so the order here is also the home page's
        // selection. It starts in the order the home page used to hardcode.
        jobs: [
            { id: "job-1", title: "Modern Market Coordinator Staff", description: "Bertanggung jawab mengembangkan relasi modern market", applyPath: "/contact-us" },
            { id: "job-2", title: "Modern Market Coordinator Staff", description: "Mengelola penjualan dan display produk di jaringan modern", applyPath: "/contact-us" },
            { id: "job-3", title: "Mechanic Staff", description: "Melakukan perawatan, pembersihan, serta perbaikan alat", applyPath: "/contact-us" },
            { id: "job-4", title: "Distribution Supervisor", description: "Mengawasi proses distribusi, mengelola tim logistik", applyPath: "/contact-us" },
            { id: "job-5", title: "Modern Market Coordinator Staff", description: "Bertanggung jawab mengembangkan relasi modern market", applyPath: "/contact-us" },
            { id: "job-6", title: "Distribution Supervisor", description: "Mengawasi proses distribusi, mengelola tim logistik", applyPath: "/contact-us" },
        ],
        newsCtaTitle: "Insights, Innovation, and Progress",
    },

    gallery: {
        titleBefore: "Moments from ",
        titleHighlight: "Altama",
        subtitle: "Dokumentasi kegiatan, budaya kerja, dan perjalanan Altama.",
        instagramTabLabel: "Instagram Gallery",
        webTabLabel: "Web Gallery",
        instagramButtonLabel: "See Our Instagram",
        instagramButtonUrl: "/detail-news",
        // Empty `image` renders the translucent placeholder tile the page ships with.
        instagram: [
            { id: "ig-1", image: "", caption: "", link: "" },
            { id: "ig-2", image: "", caption: "", link: "" },
            { id: "ig-3", image: "", caption: "", link: "" },
            { id: "ig-4", image: "", caption: "", link: "" },
            { id: "ig-5", image: "", caption: "", link: "" },
            { id: "ig-6", image: "", caption: "", link: "" },
            { id: "ig-7", image: "", caption: "", link: "" },
            { id: "ig-8", image: "", caption: "", link: "" },
        ],
        // `area` is the CSS grid-area letter (a-g) in the mosaic layout; see
        // WebGalleryComp and the .web-gallery-grid rule in style/globals.css.
        web: [
            { id: "wg-a", image: "asset:webGallery/satu.png", area: "a", caption: "Press Conference" },
            { id: "wg-b", image: "asset:webGallery/dua.png", area: "b", caption: "Challenge Your Skills" },
            { id: "wg-d", image: "asset:webGallery/tiga.png", area: "d", caption: "Lean Office Gathering" },
            { id: "wg-f", image: "asset:webGallery/empat.png", area: "f", caption: "Motor" },
            { id: "wg-g", image: "asset:webGallery/lima.png", area: "g", caption: "Jabat tangan" },
            { id: "wg-e", image: "asset:webGallery/enam.png", area: "e", caption: "Speaker" },
            { id: "wg-c", image: "asset:webGallery/tujuh.png", area: "c", caption: "Tangan meraih rak" },
        ],
    },

    news: {
        latestTitle: "Latest News",
        articles: [
            {
                id: "news-dpba-2023",
                slug: "digital-popular-brand-award-2023",
                title: "DIGITAL POPULAR BRAND AWARD 2023",
                excerpt:
                    "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro dan RYU sebagai bukti kepercayaan konsumen.",
                heroImage: "asset:news/newsSatu.png",
                // The first `featured` article is the one /detail-news opens with.
                featured: true,
                tags: ["12 Januari 2024", "Award", "Tekiro, RYU, Brand Recognition"],
                sections: [
                    {
                        id: "sec-1",
                        title: "Digital Popular Brand Award 2023",
                        paragraphs: [
                            "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools dan RYU kategori Power tools. Penghargaan ini menjadi bukti atas kepercayaan konsumen terhadap kualitas dan konsistensi produk yang dihadirkan.",
                        ],
                    },
                    {
                        id: "sec-2",
                        title: "Pengakuan atas Kualitas dan Kepercayaan",
                        paragraphs: [
                            "Penghargaan yang diterima merupakan bentuk apresiasi terhadap kekuatan brand Tekiro dan RYU di pasar nasional. Produk-produk Altama dinilai memiliki kualitas yang terjaga serta relevan dengan kebutuhan profesional maupun pengguna rumahan.",
                        ],
                    },
                    {
                        id: "sec-3",
                        title: "Komitmen Altama ke Depan",
                        paragraphs: [
                            "Altama Surya Anugerah terus berkomitmen menghadirkan produk berkualitas tinggi serta memperluas jaringan distribusi di Indonesia. Penghargaan ini menjadi motivasi untuk terus berinovasi dan memberikan layanan terbaik bagi pelanggan.",
                            "Penghargaan yang diterima merupakan bentuk apresiasi terhadap kekuatan brand Tekiro dan RYU di pasar nasional. Produk-produk Altama dinilai memiliki kualitas yang terjaga serta relevan dengan kebutuhan profesional maupun pengguna rumahan.",
                        ],
                    },
                    {
                        id: "sec-4",
                        title: "Digital Popular Brand Award 2023",
                        paragraphs: [
                            "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools dan RYU kategori Power tools. Penghargaan ini menjadi bukti atas kepercayaan konsumen terhadap kualitas dan konsistensi produk yang dihadirkan.",
                        ],
                    },
                ],
            },
            {
                id: "news-prj-2023",
                slug: "event-prj-2023",
                title: "Event Tekiro, Rexco, RYU di PRJ 2023",
                excerpt:
                    "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools...",
                heroImage: "asset:news/newsDua.png",
                featured: false,
                tags: ["Event"],
                sections: [],
            },
            {
                id: "news-mechanic-2023",
                slug: "tekiro-mechanic-competition-2023",
                title: "Tekiro Mechanic Competition 2023",
                excerpt:
                    "PT Altama Surya Anugerah kembali meraih Digital Popular Brand Award 2023 untuk brand Tekiro kategori Handtools...",
                heroImage: "asset:news/newsTiga.png",
                featured: false,
                tags: ["Event"],
                sections: [],
            },
        ],
    },

    brands: {
        productsTitlePrefix: "Produk",
        otherBrandsTitle: "Brand Lainnya",
        contactButtonLabel: "Hubungi Kami",
        awardButtonLabel: "Awards & Certification",
        items: [
            {
                id: "br-tekiro",
                slug: "tekiro",
                name: "Tekiro",
                category: "Hand Tools",
                tagline: "Perkakas tangan untuk pekerjaan yang menuntut presisi.",
                description:
                    "Tekiro menghadirkan rangkaian perkakas tangan untuk kebutuhan otomotif, industri, dan rumah tangga. Setiap produk dirancang untuk penggunaan harian yang berat dengan standar kualitas yang konsisten.",
                highlights: [
                    { id: "hl-tk-1", value: "7", label: "Penghargaan yang diterima brand Tekiro" },
                    { id: "hl-tk-2", value: "2023", label: "Digital Popular Brand Award kategori Handtools" },
                    { id: "hl-tk-3", value: "100+", label: "Varian produk perkakas tangan" },
                ],
                products: [],
            },
            {
                id: "br-rexco",
                slug: "rexco",
                name: "Rexco",
                category: "Perawatan & Pelumas",
                tagline: "Solusi perawatan untuk mesin dan peralatan Anda.",
                description:
                    "Rexco melengkapi kebutuhan perawatan peralatan dan kendaraan, dari pelumas hingga produk pembersih dan pelindung. Dibuat untuk menjaga performa peralatan tetap optimal dalam pemakaian jangka panjang.",
                highlights: [
                    { id: "hl-rx-1", value: "20+", label: "Varian produk perawatan" },
                    { id: "hl-rx-2", value: "Multi", label: "Aplikasi otomotif dan industri" },
                    { id: "hl-rx-3", value: "Nasional", label: "Jaringan distribusi di seluruh Indonesia" },
                ],
                products: [],
            },
            {
                id: "br-ryu",
                slug: "ryu",
                name: "Ryu",
                category: "Power Tools",
                tagline: "Mesin bertenaga untuk hasil kerja yang lebih cepat.",
                description:
                    "Ryu menyediakan perkakas bertenaga listrik untuk pekerjaan konstruksi, pertukangan, dan perbaikan. Fokusnya sederhana: tenaga yang bisa diandalkan dengan pengoperasian yang mudah.",
                highlights: [
                    { id: "hl-ry-1", value: "3", label: "Penghargaan yang diterima Ryu berturut-turut" },
                    { id: "hl-ry-2", value: "2023", label: "Digital Popular Brand Award kategori Powertools" },
                    { id: "hl-ry-3", value: "50+", label: "Varian produk perkakas listrik" },
                ],
                products: [],
            },
        ],
    },

    contactPage: {
        titleBefore: "Connect ",
        titleHighlight: "With Us!",
        subtitle: "Kami siap membantu kebutuhan bisnis, distribusi, dan kerja sama Anda.",
        cardTitle: "Connect With Altama!",
        cardText: "Tim kami siap membantu Anda setiap saat.",
        submitLabel: "Send Message",
        submittingLabel: "Sending...",
    },

    thanksPage: {
        title: "Terima Kasih",
        headline: "Sudah mengirimkan ceritamu!",
        description:
            "Kami akan segera tindak lanjuti cerita dan\npengalamanmu segera.",
        buttonLabel: "Back to Contact",
        buttonPath: "/contact-us",
    },

    // The navbar's dropdowns. Each top-level entry scrolls to its home-page
    // section; `items` are the pages underneath it. `key` ties a menu to the
    // artwork the desktop navbar uses for it, so it is fixed, not free text.
    navigation: {
        contactLabel: "Hubungi Kami",
        menus: [
            {
                id: "nav-profile",
                key: "profile",
                label: "Profil",
                path: "/#profile",
                items: [
                    { id: "nv-p1", label: "Company Overview", path: "/visi-misi" },
                    { id: "nv-p2", label: "Awards & Certification", path: "/award" },
                    { id: "nv-p3", label: "Board of Directors", path: "/board" },
                    { id: "nv-p4", label: "Gallery", path: "/gallery" },
                ],
            },
            {
                id: "nav-brand",
                key: "brand",
                label: "Brand",
                path: "/#brand",
                items: [
                    { id: "nv-b1", label: "Tekiro", path: "/brand/tekiro" },
                    { id: "nv-b2", label: "Rexco", path: "/brand/rexco" },
                    { id: "nv-b3", label: "Ryu", path: "/brand/ryu" },
                ],
            },
            {
                id: "nav-media",
                key: "media",
                label: "Media Center",
                path: "/#media-center",
                items: [
                    { id: "nv-m1", label: "Instagram Gallery", path: "/gallery" },
                    { id: "nv-m2", label: "Web Gallery", path: "/web-gallery" },
                    { id: "nv-m3", label: "News", path: "/detail-news" },
                ],
            },
            {
                id: "nav-career",
                key: "career",
                label: "Karir",
                path: "/#career",
                items: [
                    { id: "nv-c1", label: "Life at Altama", path: "/life-at" },
                    { id: "nv-c2", label: "Apply Jobs", path: "/grow-with" },
                ],
            },
        ],
    },

    footer: {
        innovationImage: "asset:footer/INNOVATION.png",
        copyrightImage: "asset:footer/Copyright.png",
        columns: [
            {
                id: "fc-profile",
                title: "Profile",
                links: [
                    { id: "fl-p1", label: "Company Overview", path: "/visi-misi" },
                    { id: "fl-p2", label: "Awards & Certification", path: "/award" },
                    { id: "fl-p3", label: "Board of Directors", path: "/board" },
                    { id: "fl-p4", label: "Gallery", path: "/gallery" },
                ],
            },
            {
                id: "fc-brand",
                title: "Brand",
                links: [
                    { id: "fl-b1", label: "Tekiro", path: "/brand/tekiro" },
                    { id: "fl-b2", label: "Rexco", path: "/brand/rexco" },
                    { id: "fl-b3", label: "Ryu", path: "/brand/ryu" },
                ],
            },
            {
                id: "fc-media",
                title: "Media Center",
                links: [
                    { id: "fl-m1", label: "Instagram Gallery", path: "/gallery" },
                    { id: "fl-m2", label: "Web Gallery", path: "/web-gallery" },
                    { id: "fl-m3", label: "News", path: "/detail-news" },
                ],
            },
            {
                id: "fc-career",
                title: "Career",
                links: [
                    { id: "fl-c1", label: "Life at Altama", path: "/life-at" },
                    { id: "fl-c2", label: "Apply Jobs", path: "/grow-with" },
                    { id: "fl-c3", label: "Contact Us", path: "/contact-us" },
                ],
            },
        ],
    },
}

// Every list the admin can run CRUD against, keyed by the dotted path that the
// /api/content/items/:path endpoints take. `label` is what the admin calls one
// item, and `fields` is the shape a newly created item gets.
export const CONTENT_COLLECTIONS = {
    "site.socials": { label: "Social link", fields: { label: "", url: "#", icon: "" } },
    "home.brand.stats": { label: "Award stat", fields: { value: "", label: "" } },
    "visiMisi.missions": { label: "Mission point", fields: { text: "" } },
    "visiMisi.coreValues": { label: "Core value", fields: { title: "", subtitle: "", active: false } },
    "visiMisi.milestones": { label: "Milestone", fields: { year: "", description: "" } },
    "awards.items": { label: "Award", fields: { title: "", description: "", icon: "", variant: "muted" } },
    "board.members": { label: "Board member", fields: { name: "", role: "", image: "", categoryImage: "", paragraphs: [] } },
    "lifeAt.testimonials": { label: "Testimonial", fields: { name: "", role: "", quote: "", avatar: "", rating: 5 } },
    "careers.jobs": { label: "Job opening", fields: { title: "", description: "", applyPath: "/contact-us" } },
    "gallery.instagram": { label: "Instagram post", fields: { image: "", caption: "", link: "" } },
    "gallery.web": { label: "Gallery image", fields: { image: "", area: "a", caption: "" } },
    "news.articles": { label: "Article", fields: { slug: "", title: "", excerpt: "", heroImage: "", featured: false, tags: [], sections: [] } },
    "brands.items": { label: "Brand", fields: { slug: "", name: "", category: "", tagline: "", description: "", highlights: [], products: [] } },
    "navigation.menus": { label: "Menu", fields: { key: "profile", label: "", path: "/", items: [] } },
    "footer.columns": { label: "Footer column", fields: { title: "", links: [] } },
}

// Sections the admin can save and reset independently. Anything not listed here
// is rejected by the API, so this doubles as the allow-list for PATCH.
export const CONTENT_SECTIONS = [
    "site",
    "cta",
    "home",
    "visiMisi",
    "awards",
    "board",
    "lifeAt",
    "careers",
    "gallery",
    "news",
    "brands",
    "contactPage",
    "thanksPage",
    "navigation",
    "footer",
]
