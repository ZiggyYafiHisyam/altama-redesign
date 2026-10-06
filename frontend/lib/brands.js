// The three brand pages (/brand/tekiro, /brand/rexco, /brand/ryu) are all
// rendered from this one list, so adding a brand only means adding an entry
// here plus a route in routes/Route.jsx.
//
// TODO(content): the copy below is placeholder. The award numbers for Tekiro
// and Ryu come from the home page's Brand section; everything else -- taglines,
// descriptions, highlights and the product images -- still needs the real
// marketing copy and assets.
export const brands = [
    {
        slug: "tekiro",
        name: "Tekiro",
        category: "Hand Tools",
        tagline: "Perkakas tangan untuk pekerjaan yang menuntut presisi.",
        description:
            "Tekiro menghadirkan rangkaian perkakas tangan untuk kebutuhan otomotif, industri, dan rumah tangga. Setiap produk dirancang untuk penggunaan harian yang berat dengan standar kualitas yang konsisten.",
        highlights: [
            { value: "7", label: "Penghargaan yang diterima brand Tekiro" },
            { value: "2023", label: "Digital Popular Brand Award kategori Handtools" },
            { value: "100+", label: "Varian produk perkakas tangan" },
        ],
    },
    {
        slug: "rexco",
        name: "Rexco",
        category: "Perawatan & Pelumas",
        tagline: "Solusi perawatan untuk mesin dan peralatan Anda.",
        description:
            "Rexco melengkapi kebutuhan perawatan peralatan dan kendaraan, dari pelumas hingga produk pembersih dan pelindung. Dibuat untuk menjaga performa peralatan tetap optimal dalam pemakaian jangka panjang.",
        highlights: [
            { value: "20+", label: "Varian produk perawatan" },
            { value: "Multi", label: "Aplikasi otomotif dan industri" },
            { value: "Nasional", label: "Jaringan distribusi di seluruh Indonesia" },
        ],
    },
    {
        slug: "ryu",
        name: "Ryu",
        category: "Power Tools",
        tagline: "Mesin bertenaga untuk hasil kerja yang lebih cepat.",
        description:
            "Ryu menyediakan perkakas bertenaga listrik untuk pekerjaan konstruksi, pertukangan, dan perbaikan. Fokusnya sederhana: tenaga yang bisa diandalkan dengan pengoperasian yang mudah.",
        highlights: [
            { value: "3", label: "Penghargaan yang diterima Ryu berturut-turut" },
            { value: "2023", label: "Digital Popular Brand Award kategori Powertools" },
            { value: "50+", label: "Varian produk perkakas listrik" },
        ],
    },
]

export function getBrandBySlug(slug) {
    return brands.find((brand) => brand.slug === slug) ?? null
}
