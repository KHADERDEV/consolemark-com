import { Mail } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/config/site";

const contactActions = [
  {
    label: "Contact us on Telegram",
    href: siteConfig.footer.telegram.contactLink,
    image: siteConfig.assets.telegramIcon,
  },
  {
    label: "Contact us on WhatsApp",
    href: siteConfig.footer.whatsapp.qrLink,
    image: siteConfig.assets.whatsappIcon,
  },
  {
    label: "Email support",
    href: siteConfig.links.email,
  },
];

export function FloatingContactWidget() {
  return (
    <aside
      aria-label="Quick contact"
      className="fixed right-3 bottom-3 z-40 flex gap-2 rounded-full border border-black/10 bg-white/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur sm:right-6 sm:bottom-6 sm:flex-col"
    >
      {contactActions.map((action) => {
        return (
          <a
            key={action.label}
            href={action.href}
            target={action.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={action.href.startsWith("mailto:") ? undefined : "noreferrer"}
            aria-label={action.label}
            title={action.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#55d3e8] hover:text-black sm:h-11 sm:w-11"
          >
            {"image" in action && action.image ? (
              <Image
                src={action.image}
                alt=""
                width={20}
                height={20}
                draggable={false}
                className="h-5 w-5 object-contain"
              />
            ) : (
              <Mail className="h-5 w-5" aria-hidden="true" />
            )}
          </a>
        );
      })}
    </aside>
  );
}
