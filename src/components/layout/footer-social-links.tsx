"use client";

import Image from "next/image";
import { useState } from "react";

import { siteConfig } from "@/config/site";

type SocialLink = {
  label: string;
  href: string;
  image: string;
  opensPopup?: boolean;
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
    opensPopup: true,
  },
];

export function FooterSocialLinks() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        {socialLinks.map((social) =>
          social.opensPopup ? (
            <button
              key={social.label}
              type="button"
              aria-label={social.label}
              onClick={() => setIsWhatsAppOpen(true)}
              className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-[#00e5ff] hover:bg-[#00e5ff]"
            >
              <SocialIcon image={social.image} />
            </button>
          ) : (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-[#00e5ff] hover:bg-[#00e5ff]"
            >
              <SocialIcon image={social.image} />
            </a>
          ),
        )}
      </div>

      {isWhatsAppOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close WhatsApp popup"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsWhatsAppOpen(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-lg bg-white p-6 text-center text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-popup-title"
          >
            <h2
              id="whatsapp-popup-title"
              className="font-lilita text-3xl tracking-normal"
            >
              WhatsApp
            </h2>
            <p className="font-lilita mt-5 text-2xl tracking-normal">
              {siteConfig.footer.whatsapp.phone}
            </p>
            <a
              href={siteConfig.footer.whatsapp.qrLink}
              target="_blank"
              rel="noreferrer"
              className="font-lilita mt-5 inline-flex min-h-11 max-w-full items-center justify-center rounded-full bg-[#00e5ff] px-5 py-3 text-sm tracking-normal text-black transition-colors hover:bg-black hover:text-white sm:text-base"
            >
              <span className="break-all">
                {siteConfig.footer.whatsapp.qrLink}
              </span>
            </a>
            <button
              type="button"
              onClick={() => setIsWhatsAppOpen(false)}
              className="font-lilita mt-6 min-h-11 rounded-full bg-black px-6 text-base tracking-normal text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SocialIcon({ image }: { image: string }) {
  return (
    <Image
      src={image}
      alt=""
      width={24}
      height={24}
      draggable={false}
      className="h-6 w-6 object-contain transition-[filter] group-hover:brightness-0"
    />
  );
}
