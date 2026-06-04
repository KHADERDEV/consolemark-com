import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { ComingSoonSection } from "@/components/sections/coming-soon-section";

export const metadata: Metadata = {
  title: "Coming Soon | Console Mark",
  description: "This Console Mark page is coming soon.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar />
      <ComingSoonSection />
      <SiteFooter />
    </main>
  );
}
