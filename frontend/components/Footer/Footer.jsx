import { Link } from "react-router-dom";
import gradientDua from "../../assets/footer/gradientDua.svg";
import gradientSatu from "../../assets/footer/gradientSatu.svg";
import { resolveImage } from "../../lib/assets";
import { useSection } from "../../lib/content";
import SmartLink from "../../ui/SmartLink";

const Footer = () => {
    const footer = useSection("footer");
    const site = useSection("site");

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
                        <Link to="/" aria-label={`${site.companyName} home`}>
                            {resolveImage(site.footerLogo) && (
                                <img
                                    className="w-52 md:w-auto"
                                    src={resolveImage(site.footerLogo)}
                                    alt={site.companyName}
                                />
                            )}
                        </Link>
                        <div className="flex gap-2 sm:gap-3">
                            {(site.socials ?? []).map((social) => (
                                <SmartLink
                                    key={social.id}
                                    to={social.url}
                                    aria-label={social.label}
                                    className="rounded-2xl focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                                >
                                    {resolveImage(social.icon) && (
                                        <img
                                            className="h-10 w-10 md:h-auto md:w-auto"
                                            src={resolveImage(social.icon)}
                                            alt=""
                                        />
                                    )}
                                </SmartLink>
                            ))}
                        </div>
                    </div>

                    <nav
                        className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 sm:gap-x-20 lg:gap-x-23"
                        aria-label="Footer navigation"
                    >
                        {footer.columns.map((column) => (
                            <div key={column.id}>
                                <h2 className="mb-8 font-header text-xl font-bold">
                                    {column.title}
                                </h2>
                                <ul className="space-y-5">
                                    {column.links.map((link) => (
                                        <li key={link.id}>
                                            <SmartLink
                                                className="font-inter text-lg underline decoration-white/40 underline-offset-4 transition-opacity hover:opacity-70"
                                                to={link.path}
                                            >
                                                {link.label}
                                            </SmartLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {resolveImage(footer.innovationImage) && (
                    <img
                        className="pointer-events-none mx-auto mt-20 max-w-full"
                        src={resolveImage(footer.innovationImage)}
                        alt=""
                    />
                )}

                <div className="mt-14 border-t border-white/20 pt-10 text-center">
                    {resolveImage(footer.copyrightImage) && (
                        <img
                            className="mx-auto max-w-full"
                            src={resolveImage(footer.copyrightImage)}
                            alt={`Copyright ${site.companyName}. All Right Reserved`}
                        />
                    )}
                </div>
            </div>
        </footer>
    );
}

export default Footer
