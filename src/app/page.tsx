import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar />
      <HeroSection />

      <section
        id="after-hero"
        className="min-h-[60vh] bg-white px-4 py-20 sm:px-6 lg:px-8"
      />
      <SiteFooter />
    </main>
  );
}
