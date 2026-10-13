import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import bgSubMenu from "../../assets/navbar/BgSubMenu.svg";
import bgMenuBrand from "../../assets/navbar/BgMenuBrand.png";
import bgMenuCareer from "../../assets/navbar/BgMenuCareer.png";
import btnBrand from "../../assets/navbar/BtnBrand.svg";
import btnCareer from "../../assets/navbar/BtnCareer.svg";
import btnContactUs from "../../assets/navbar/BtnContactUs.svg";
import btnMedia from "../../assets/navbar/BtnMedia.svg";
import btnProfile from "../../assets/navbar/BtnProfile.svg";
import arrow from "../../assets/navbar/PanahSubMenu.svg";
import { resolveImage } from "../../lib/assets";
import { useSection } from "../../lib/content";
import SmartLink from "../../ui/SmartLink";

// The desktop navbar is drawn with artwork rather than type, and two of the four
// dropdowns are shaped images. That artwork is design, not content, so it is
// keyed here by each menu's fixed `key` while the labels and links come from the
// content document. A menu whose key is not listed falls back to plain text and
// a plain panel, which is what a newly added menu gets.
const MENU_ART = {
    profile: {
        buttonImage: btnProfile,
        panelClassName:
            "min-w-45 rounded-2xl border border-border bg-white p-4 shadow-[0_10px_30px_rgba(22,22,22,0.15)]",
        itemClassName: "whitespace-nowrap font-header text-base font-semibold leading-none",
    },
    brand: {
        buttonImage: btnBrand,
        backgroundImage: bgMenuBrand,
        panelClassName: "h-[min(10.5rem,42vw)] w-[min(7.625rem,calc(100vw-2rem))]",
        listClassName: "gap-[clamp(0.6rem,3vw,1rem)] pl-[clamp(0.75rem,4vw,1.25rem)]",
        itemClassName: "font-header text-[clamp(1rem,5vw,1.375rem)] leading-none",
    },
    media: {
        buttonImage: btnMedia,
        linkClassName: "h-12",
        panelClassName:
            "min-w-48 rounded-2xl border border-border bg-white p-4 shadow-[0_10px_30px_rgba(22,22,22,0.15)]",
        itemClassName: "whitespace-nowrap font-header text-base font-semibold leading-none",
    },
    career: {
        buttonImage: btnCareer,
        backgroundImage: bgMenuCareer,
        panelClassName: "h-[min(7.75rem,37vw)] w-[min(11.25rem,calc(100vw-2rem))]",
        listClassName: "gap-[clamp(0.75rem,4vw,1.25rem)] pl-[clamp(0.75rem,4vw,1.25rem)]",
        itemClassName: "font-header text-[clamp(1.125rem,6vw,1.5625rem)] leading-none",
    },
};

const FALLBACK_ART = {
    panelClassName:
        "min-w-45 rounded-2xl border border-border bg-white p-4 shadow-[0_10px_30px_rgba(22,22,22,0.15)]",
    itemClassName: "whitespace-nowrap font-header text-base font-semibold leading-none",
};

const Navbar = () => {
    const navigation = useSection("navigation");
    const site = useSection("site");
    const [openMenu, setOpenMenu] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            requestAnimationFrame(() => {
                document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname, hash]);

    const toggleMenu = (menu) => {
        setOpenMenu((current) => (current === menu ? null : menu));
    };

    const closeMenus = () => setOpenMenu(null);

    return (
        <div className="">
        <header className="fixed inset-x-0 top-0 z-30 h-15 bg-white lg:h-auto lg:bg-transparent">
            <div
                className="pointer-events-none absolute left-79.5 top-0 hidden origin-top-left drop-shadow-[0_6px_6px_rgba(0,0,0,0.18)] lg:block"
            >
                <img
                    className="block h-auto w-full object-contain"
                    src={bgSubMenu}
                    alt=""
                />
            </div>

            <Link
                className="absolute left-3 top-2.5 z-10 w-[clamp(6.5rem,30vw,8rem)] focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-4 lg:left-0 lg:top-0 lg:w-auto"
                to="/"
                aria-label={`${site.companyName} home`}
                onClick={closeMenus}
            >
                {resolveImage(site.navLogo) && (
                    <img src={resolveImage(site.navLogo)} alt={site.companyName} />
                )}
            </Link>

            <button
                type="button"
                className="absolute right-4 top-2 z-40 flex h-11 w-11 flex-col items-center justify-center gap-1.5 text-primary lg:hidden"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
                onClick={() => {
                    setIsMobileMenuOpen((isOpen) => !isOpen);
                    closeMenus();
                }}
            >
                <span className={`h-0.5 w-5 bg-current transition-transform ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-5 bg-current transition-opacity ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-5 bg-current transition-transform ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>

            <nav
                className={`${isMobileMenuOpen ? "flex" : "hidden"} absolute left-0 top-15 z-30 w-full flex-col border-t border-abu bg-white px-[clamp(0.75rem,4vw,1rem)] pb-4 pt-2 lg:relative lg:left-auto lg:top-auto lg:ml-[clamp(12rem,28vw,25rem)] lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-[clamp(1rem,3vw,3rem)] lg:border-0 lg:bg-transparent lg:p-0 lg:pb-6.5 lg:pt-6.5`}
                aria-label="Main navigation"
            >
                {navigation.menus.map((menu) => {
                    const art = MENU_ART[menu.key] ?? FALLBACK_ART;
                    const isOpen = openMenu === menu.id;

                    return (
                        <div key={menu.id} className="relative flex-[0_0_auto]">
                            <div className="inline-flex items-center">
                                <SmartLink
                                    className={`inline-flex items-center focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-4 ${art.linkClassName ?? ""}`}
                                    to={menu.path}
                                    aria-label={menu.label}
                                    onClick={closeMenus}
                                >
                                    <span className="font-header text-[clamp(1rem,4vw,1.125rem)] leading-[clamp(2.5rem,10vw,3rem)] text-primary lg:hidden">
                                        {menu.label}
                                    </span>
                                    {art.buttonImage ? (
                                        <img className="hidden lg:block" src={art.buttonImage} alt={menu.label} />
                                    ) : (
                                        <span className="hidden font-header text-lg text-primary lg:block">
                                            {menu.label}
                                        </span>
                                    )}
                                </SmartLink>
                                {menu.items.length > 0 && (
                                    <button
                                        type="button"
                                        className="ml-auto inline-flex items-center focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-4 lg:ml-2"
                                        aria-label={`Open ${menu.label} menu`}
                                        aria-expanded={isOpen}
                                        aria-controls={`${menu.id}-menu`}
                                        onClick={() => toggleMenu(menu.id)}
                                    >
                                        <img
                                            className={`h-3 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                            src={arrow}
                                            alt=""
                                        />
                                    </button>
                                )}
                            </div>
                            {isOpen && menu.items.length > 0 && (
                                <div
                                    id={`${menu.id}-menu`}
                                    className={`absolute left-1/2 top-full z-30 mt-3 -translate-x-1/2 ${art.panelClassName}`}
                                    role="menu"
                                >
                                    {art.backgroundImage && (
                                        <img
                                            className="absolute inset-0 h-full w-full"
                                            src={art.backgroundImage}
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    )}
                                    <div
                                        className={`relative flex h-full flex-col justify-center ${art.listClassName ?? "gap-3"}`}
                                    >
                                        {menu.items.map((item) => (
                                            <SmartLink
                                                key={item.id}
                                                className={`text-primary transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-primary ${art.itemClassName}`}
                                                to={item.path}
                                                role="menuitem"
                                                onClick={closeMenus}
                                            >
                                                {item.label}
                                            </SmartLink>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <Link
                    className="inline-flex h-12 flex-[0_0_auto] items-center focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-4"
                    to="/contact-us"
                    aria-label={navigation.contactLabel}
                    onClick={closeMenus}
                >
                    <span className="font-header text-[clamp(1rem,4vw,1.125rem)] leading-[clamp(2.5rem,10vw,3rem)] text-primary lg:hidden">
                        {navigation.contactLabel}
                    </span>
                    <img className="hidden lg:block" src={btnContactUs} alt={navigation.contactLabel} />
                </Link>
            </nav>
        </header>
        </div>
    );
};

export default Navbar;
