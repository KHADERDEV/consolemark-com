import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { RentConsoleCard } from "@/components/marketplace/rent-console-card";
import { getPublishedRentConsoles } from "@/lib/rent-consoles";
import { getUserProfile } from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Rent Marketplace | Console Mark",
  description: "Rent available Play Consoles from Console Mark.",
};

export default async function RentMarketplacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [consoles, profile] = await Promise.all([
    getPublishedRentConsoles(),
    user ? getUserProfile(user.id) : null,
  ]);

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar stable fixed={false} transparent />
      <section
        id="hero"
        className="flex min-h-[50svh] items-center bg-[#55d3e8] bg-[linear-gradient(rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.32)_1px,transparent_1px)] bg-[length:56px_56px] px-4 py-12 text-black sm:px-6 lg:px-8"
      >
        {/* lets make the text centered */}
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl leading-none tracking-normal sm:text-7xl lg:text-8xl">
              Rent Marketplace
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-7 tracking-normal sm:text-2xl sm:leading-9">
              Browse Play Consoles available for rent, compare options, and
              request to rent the console that best fits your needs.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {consoles.length > 0 ? (
            <div className="flex w-full flex-col items-center gap-7">
              {consoles.map((consoleItem) => (
                <div
                  key={consoleItem.id}
                  className="w-full lg:w-[70vw] lg:max-w-5xl"
                >
                  <RentConsoleCard
                    consoleItem={consoleItem}
                    isLoggedIn={Boolean(user)}
                    initialWhatsappNumber={profile?.whatsapp_number}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-black/10 bg-neutral-50 p-8">
              <p className="font-lilita text-3xl">No consoles available</p>
              <p className="mt-2 text-sm text-black/60">
                New rent listings will appear here as soon as they are
                published.
              </p>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
