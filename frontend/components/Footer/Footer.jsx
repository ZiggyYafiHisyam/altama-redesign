import copyright from "../../assets/footer/Copyright.png";
import { Link } from "react-router-dom";
import fb from "../../assets/footer/fb.svg";
import gradientDua from "../../assets/footer/gradientDua.svg";
import gradientSatu from "../../assets/footer/gradientSatu.svg";
import ig from "../../assets/footer/ig.svg";
import innovation from "../../assets/footer/INNOVATION.png";
import linkend from "../../assets/footer/linkend.svg";
import logo from "../../assets/footer/LogoAltama.svg";
import wa from "../../assets/footer/wa.svg";
import yt from "../../assets/footer/yt.svg";

const socialLinks = [
    { label: "WhatsApp", image: wa },
    { label: "Facebook", image: fb },
    { label: "YouTube", image: yt },
    { label: "LinkedIn", image: linkend },
    { label: "Instagram", image: ig },
];

const footerColumns = [
    {
        title: "Company",
        links: [
            { label: "About", path: "/#profile" },
            { label: "Career", path: "/grow-with" },
            { label: "News", path: "/detail-news" },
        ],
    },
    {
        title: "Product",
        links: [
            { label: "Tekiro", path: "/#brand" },
            { label: "Rexco", path: "/#brand" },
            { label: "Ryu", path: "/#brand" },
        ],
    },
    {
        title: "Contact Us",
        links: [
            { label: "Location", path: "/contact-us" },
            { label: "Help", path: "/contact-us" },
            { label: "Alva", path: "/contact-us" },
        ],
    },
    {
        title: "Company Overview",
        links: [
            { label: "Media Center", path: "/gallery" },
            { label: "Gallery", path: "/gallery" },
            { label: "Career", path: "/grow-with" },
        ],
    },
];

const Footer =()=>{
    return (
        <footer className="relative isolate overflow-hidden bg-primary text-white">
            <img
                className="pointer-events-none absolute left-0 top-0 -z-10"
                src={gradientSatu}
                alt=""
            />
            <img
                className="pointer-events-none absolute right-0 top-0 -z-10"
                src={gradientDua}
                alt=""
            />

            <div className="relative mx-auto flex max-w-450 flex-col px-6 pb-8 pt-16 sm:px-8 md:pt-20 lg:px-20 lg:pt-24">
                <div className="flex flex-col gap-16 lg:flex-row lg:justify-between lg:gap-24">
                    <div className="flex shrink-0 flex-col gap-20">
                        <Link to="/" aria-label="Altama Surya Anugerah home">
                            <img className="w-52 md:w-auto" src={logo} alt="Altama Surya Anugerah" />
                        </Link>
                        <div className="flex gap-2 sm:gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="rounded-2xl focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                                >
                                    <img className="h-10 w-10 md:h-auto md:w-auto" src={social.image} alt="" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <nav
                        className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 sm:gap-x-20 lg:gap-x-23"
                        aria-label="Footer navigation"
                    >
                        {footerColumns.map((column) => (
                            <div key={column.title}>
                                <h2 className="mb-8 font-header text-xl font-bold">
                                    {column.title}
                                </h2>
                                <ul className="space-y-5">
                                    {column.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                className="font-inter text-lg underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-70"
                                                to={link.path}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <img
                    className="pointer-events-none mx-auto mt-20 max-w-full"
                    src={innovation}
                    alt=""
                />

                <div className="mt-14 border-t border-white/20 pt-10 text-center">
                    <img className="mx-auto max-w-full" src={copyright} alt="Copyright 2025 PT. Altama Surya Anugerah. All Right Reserved" />
                </div>
            </div>
        </footer>
    );
}

export default Footer