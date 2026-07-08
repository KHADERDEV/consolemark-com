"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { CopyValueButton } from "@/components/ui/copy-value-button";
import { siteConfig } from "@/config/site";

type SocialLink = {
  label: "Telegram" | "WhatsApp" | "Email" | "Facebook";
  href?: string;
  image?: string;
  action?: "telegram" | "whatsapp";
  icon?: "facebook";
};

const socialLinks: SocialLink[] = [
  {
    label: "Telegram",
    image: siteConfig.assets.telegramIcon,
    action: "telegram",
  },
  {
    label: "WhatsApp",
    image: siteConfig.assets.whatsappIcon,
    action: "whatsapp",
  },
  {
    label: "Email",
    href: siteConfig.links.email,
  },
  {
    label: "Facebook",
    href: siteConfig.links.facebook,
    icon: "facebook",
  },
];

export function FooterSocialLinks() {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        {socialLinks.map((social) =>
          social.action ? (
            <button
              key={social.label}
              type="button"
              aria-label={social.label}
              onClick={() =>
                social.action === "telegram"
                  ? setIsTelegramOpen(true)
                  : setIsWhatsAppOpen(true)
              }
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
              <SocialIcon image={social.image} icon={social.icon} />
            </a>
          ),
        )}
      </div>

      {isTelegramOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close Telegram popup"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsTelegramOpen(false)}
          />
          <div
            className="relative w-full max-w-sm rounded-lg bg-white p-6 text-center text-black shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="telegram-popup-title"
          >
            <h2
              id="telegram-popup-title"
              className="font-lilita text-3xl tracking-normal"
            >
              Join our Telegram Channel
            </h2>
            <div className="mt-5 flex items-center justify-center gap-2 rounded-full border border-black/10 bg-neutral-50 px-4 py-2">
              <span className="font-lilita text-lg tracking-normal">
                {siteConfig.footer.telegram.username}
              </span>
              <CopyValueButton
                value={siteConfig.footer.telegram.username}
                label="Telegram username"
              />
            </div>
            <div className="mt-5 grid gap-3">
              <a
                href={siteConfig.footer.telegram.contactLink}
                target="_blank"
                rel="noreferrer"
                className="font-lilita inline-flex min-h-11 items-center justify-center rounded-full bg-[#00e5ff] px-5 py-3 text-sm tracking-normal text-black transition-colors hover:bg-black hover:text-white sm:text-base"
              >
                Contact us on Telegram
              </a>
              <a
                href={siteConfig.footer.telegram.channelLink}
                target="_blank"
                rel="noreferrer"
                className="font-lilita inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm tracking-normal text-black transition-colors hover:border-black hover:bg-black hover:text-white sm:text-base"
              >
                Join Telegram Channel
              </a>
            </div>
            <button
              type="button"
              onClick={() => setIsTelegramOpen(false)}
              className="font-lilita mt-6 min-h-11 rounded-full bg-black px-6 text-base tracking-normal text-white transition hover:bg-[#00e5ff] hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

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
            <div className="mt-6 grid gap-3">
              <a
                href={siteConfig.footer.whatsapp.qrLink}
                target="_blank"
                rel="noreferrer"
                className="font-lilita inline-flex min-h-12 max-w-full items-center justify-center rounded-full bg-[#00e5ff] px-6 py-3 text-base tracking-normal text-black transition-colors hover:bg-black hover:text-white"
              >
                Contact us on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setIsWhatsAppOpen(false)}
                className="font-lilita inline-flex min-h-12 justify-self-center rounded-full bg-black px-6 py-3 text-base tracking-normal text-white transition hover:bg-[#00e5ff] hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SocialIcon({
  image,
  icon,
}: {
  image?: string;
  icon?: SocialLink["icon"];
}) {
  if (icon === "facebook") {
    return (
      <span
        className="font-lilita text-2xl leading-none text-white transition-colors group-hover:text-black"
        aria-hidden="true"
      >
        f
      </span>
    );
  }

  if (!image) {
    return (
      <Mail
        className="h-5 w-5 transition-colors group-hover:text-black"
        aria-hidden="true"
      />
    );
  }

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
