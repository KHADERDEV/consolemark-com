import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { MarketplaceCtaSection } from "@/components/sections/marketplace-cta-section";
import { RentServicesSection } from "@/components/sections/rent-services-section";
import { FloatingContactWidget } from "@/components/support/floating-contact-widget";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar />
      <HeroSection />
      <RentServicesSection />
      <MarketplaceCtaSection />
      <SiteFooter />
      <FloatingContactWidget />
    </main>
  );
}
