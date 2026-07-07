import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-white bg-cover bg-[center_top] bg-no-repeat px-3 pt-28 pb-24 text-black sm:min-h-screen sm:bg-center sm:px-6 sm:pt-24"
      style={{
        backgroundImage: `url('${siteConfig.assets.heroBackground}')`,
      }}
    >
      <div className="relative z-10 flex w-full max-w-[98vw] flex-col items-center text-center sm:max-w-[96vw]">
        <h1 className="font-lilita whitespace-nowrap leading-none tracking-normal text-[clamp(0.64rem,3vw,3.7rem)]">
          {siteConfig.tagline}
        </h1>
        <p className="font-lilita mt-4 whitespace-nowrap leading-none tracking-normal text-[clamp(1rem,5.4vw,5.4rem)] sm:mt-7">
          {siteConfig.subTagline}
        </p>
        <Link
          href={siteConfig.marketplaceCta.href}
          className="font-lilita mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-7 text-base tracking-normal text-white transition hover:bg-black/85 sm:mt-10 sm:min-h-14 sm:px-9 sm:text-xl"
        >
          {siteConfig.marketplaceCta.buttonLabel}
        </Link>
      </div>

      <a
        href="#rent-services"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transition-transform duration-200 hover:translate-y-1 sm:bottom-9"
      >
        <Image
          src={siteConfig.assets.scrollDown}
          alt="Scroll down"
          width={72}
          height={72}
          draggable={false}
          className="h-16 w-16 object-contain sm:h-[72px] sm:w-[72px]"
        />
      </a>
    </section>
  );
}
