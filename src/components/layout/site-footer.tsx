import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

type SocialLink = {
  label: string;
  href: string;
  image: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "Youtube",
    href: siteConfig.links.youtube,
    image: siteConfig.assets.youtubeIcon,
  },
  {
    label: "Telegram",
    href: siteConfig.links.telegram,
    image: siteConfig.assets.telegramIcon,
  },
  {
    label: "WhatsApp",
    href: siteConfig.links.whatsapp,
    image: siteConfig.assets.whatsappIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#03091d] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href={siteConfig.links.home}
              aria-label={`${siteConfig.name} home`}
              className="inline-flex items-center gap-3"
            >
              <Image
                src={siteConfig.assets.logo}
                alt={`${siteConfig.name} logo`}
                width={48}
                height={48}
                draggable={false}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
              />
              <span className="font-lilita text-2xl tracking-normal sm:text-3xl">
                {siteConfig.name}
              </span>
            </Link>
            <p className="font-lilita mt-5 max-w-xs text-sm leading-6 text-white/70 tracking-normal sm:text-base">
              {siteConfig.tagline}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 lg:gap-x-10"
          >
            {siteConfig.footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-lilita text-lg tracking-normal text-white">
                  {column.title}
                </h2>
                {column.links.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="font-lilita text-sm tracking-normal text-white/75 transition-colors hover:text-[#00e5ff] sm:text-base"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4 h-px w-12 bg-white/20" />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="h-px bg-white/15" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="font-lilita text-sm tracking-normal text-white sm:text-base">
            {siteConfig.footer.copyright}
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-[#00e5ff] hover:bg-[#00e5ff]"
              >
                <Image
                  src={social.image}
                  alt=""
                  width={24}
                  height={24}
                  draggable={false}
                  className="h-6 w-6 object-contain transition-[filter] group-hover:brightness-0"
                />
              </a>
            ))}
          </div>
        </div>

        <p className="font-lilita text-center text-sm leading-6 tracking-normal text-white sm:text-base">
          {siteConfig.footer.address}
        </p>
      </div>
    </footer>
  );
}
