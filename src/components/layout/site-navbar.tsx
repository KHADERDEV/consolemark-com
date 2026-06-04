"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: siteConfig.links.privacyPolicy, label: "Privacy Policy" },
  { href: siteConfig.links.support, label: "Support" },
];

export function SiteNavbar() {
  const [hasLeftHero, setHasLeftHero] = useState(false);

  useEffect(() => {
    const updateNavbar = () => {
      const hero = document.getElementById("hero");
      const heroHeight = hero?.offsetHeight ?? window.innerHeight;

      setHasLeftHero(window.scrollY > heroHeight - 88);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("resize", updateNavbar);

    return () => {
      window.removeEventListener("scroll", updateNavbar);
      window.removeEventListener("resize", updateNavbar);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        hasLeftHero
          ? "border-black/10 border-b bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-4 text-black sm:h-20 sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:py-0 lg:px-8">
        <Link
          href={siteConfig.links.home}
          aria-label={`${siteConfig.name} home`}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <Image
            src={siteConfig.assets.logo}
            alt={`${siteConfig.name} logo`}
            width={44}
            height={44}
            priority
            className="h-8 w-8 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <span className="font-lilita whitespace-nowrap text-lg tracking-normal sm:text-2xl">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-lilita whitespace-nowrap rounded-md px-2 py-1.5 text-xs tracking-normal text-black transition-colors hover:bg-black/5 min-[380px]:text-sm sm:px-3 sm:py-2 sm:text-base"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
