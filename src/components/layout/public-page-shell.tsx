import type React from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

type PublicPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl";
};

const maxWidthClass = {
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
  maxWidth = "5xl",
}: PublicPageShellProps) {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar stable />
      <section
        className={`mx-auto w-full ${maxWidthClass[maxWidth]} px-4 pt-36 pb-16 sm:px-6 lg:px-8`}
      >
        <div className="max-w-3xl">
          <p className="text-sm text-black/45">{eyebrow}</p>
          <h1 className="mt-3 text-4xl leading-none tracking-normal sm:text-7xl">
            {title}
          </h1>
          <p className="mt-5 text-lg leading-7 text-black/65 sm:text-2xl sm:leading-9">
            {description}
          </p>
        </div>
        {children}
      </section>
      <SiteFooter />
    </main>
  );
}
