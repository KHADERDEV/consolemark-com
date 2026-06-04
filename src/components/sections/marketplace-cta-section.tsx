import Link from "next/link";

import { siteConfig } from "@/config/site";

export function MarketplaceCtaSection() {
  return (
    <section className="bg-[#55d3e8] bg-[linear-gradient(rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.32)_1px,transparent_1px)] bg-[length:56px_56px] px-4 py-20 text-black sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <h2 className="font-lilita max-w-5xl text-5xl leading-none tracking-normal sm:text-6xl lg:text-8xl">
          {siteConfig.marketplaceCta.text}
        </h2>

        <Link
          href={siteConfig.marketplaceCta.href}
          className="group font-lilita mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-black px-7 py-4 text-lg tracking-normal text-white transition-colors hover:bg-white hover:text-black sm:mt-12 sm:min-h-16 sm:px-9 sm:text-2xl"
        >
          <span>{siteConfig.marketplaceCta.buttonLabel}</span>
          <span
            aria-hidden="true"
            className="h-6 w-6 bg-white transition-colors group-hover:bg-black sm:h-7 sm:w-7"
            style={{
              maskImage: `url(${siteConfig.assets.ctaArrow})`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskImage: `url(${siteConfig.assets.ctaArrow})`,
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
          />
        </Link>
      </div>
    </section>
  );
}
