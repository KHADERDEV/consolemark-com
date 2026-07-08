import { Mail } from "lucide-react";
import Image from "next/image";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { CopyValueButton } from "@/components/ui/copy-value-button";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Support | Console Mark",
  description: "Contact Console Mark support by Telegram, WhatsApp, or email.",
};

const supportMethods = [
  {
    title: "Telegram",
    description: "Fast support for rental, transfer, and payment requests.",
    value: siteConfig.footer.telegram.username,
    href: siteConfig.footer.telegram.contactLink,
    buttonLabel: "Contact us on Telegram",
    image: siteConfig.assets.telegramIcon,
    copyLabel: "Telegram username",
  },
  {
    title: "WhatsApp",
    description: "Use WhatsApp when you need direct help with an active order.",
    value: siteConfig.footer.whatsapp.phone,
    href: siteConfig.footer.whatsapp.qrLink,
    buttonLabel: "Contact us on Whatsapp",
    image: siteConfig.assets.whatsappIcon,
    copyLabel: "WhatsApp number",
  },
  {
    title: "Email",
    description: "Best for account, documentation, and formal support topics.",
    value: siteConfig.footer.email,
    href: siteConfig.links.email,
    buttonLabel: "Email support",
    copyLabel: "support email",
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar stable />
      <section className="mx-auto w-full max-w-7xl px-4 pt-36 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm text-black/45">Console Mark Support</p>
          <h1 className="mt-3 text-4xl leading-none tracking-normal sm:text-7xl">
            Contact Us
          </h1>
          <p className="mt-5 text-lg leading-7 text-black/65 sm:text-2xl sm:leading-9">
            Reach our team through Telegram, WhatsApp, or email for marketplace
            requests, rental orders, transfer orders, and payment questions.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {supportMethods.map((method) => {
            return (
              <article
                key={method.title}
                className="rounded-[28px] border-2 border-black/10 bg-neutral-50 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  {"image" in method && method.image ? (
                    <Image
                      src={method.image}
                      alt=""
                      width={24}
                      height={24}
                      draggable={false}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <Mail className="h-6 w-6" aria-hidden="true" />
                  )}
                </div>
                <h2 className="mt-5 text-3xl leading-none">{method.title}</h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-black/55">
                  {method.description}
                </p>
                <div className="mt-5 flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
                  <span className="min-w-0 flex-1 break-all text-base">
                    {method.value}
                  </span>
                  <CopyValueButton
                    value={method.value}
                    label={method.copyLabel}
                  />
                </div>
                <a
                  href={method.href}
                  target={
                    method.href.startsWith("mailto:") ? undefined : "_blank"
                  }
                  rel={
                    method.href.startsWith("mailto:") ? undefined : "noreferrer"
                  }
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-black px-5 text-base text-white transition hover:bg-[#55d3e8] hover:text-black"
                >
                  {method.buttonLabel}
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[28px] border border-black/10 bg-black p-6 text-white">
          <h2 className="text-3xl leading-none">For active requests</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
            Include your request ID, app name, package name, and the email used
            for draft access so the team can find the order quickly.
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
