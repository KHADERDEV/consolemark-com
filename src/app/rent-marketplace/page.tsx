import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { RentConsoleCard } from "@/components/marketplace/rent-console-card";
import { RentMarketplaceFilters } from "@/components/marketplace/rent-marketplace-filters";
import { ScrollToTopButton } from "@/components/marketplace/scroll-to-top-button";
import { FloatingContactWidget } from "@/components/support/floating-contact-widget";
import { PagePagination } from "@/components/ui/page-pagination";
import { getPageValue } from "@/lib/pagination";
import {
  type AvailabilityStatus,
  availabilityOptions,
  type ConsoleType,
  consoleTypeOptions,
  getPublishedRentConsoleFilterOptions,
  getPublishedRentConsolesPage,
  type PublishedRentConsoleFilters,
} from "@/lib/rent-consoles";
import { getUserProfile } from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";
import { getTransferAppOptions } from "@/lib/transfer-requests";

export const metadata = {
  title: "Rent Marketplace | Console Mark",
  description: "Rent available Play Consoles from Console Mark.",
};

const PAGE_SIZE = 10;

const priceTypes = ["live_price", "weekly_price", "transfer_apps_price"];

function getNumberFilter(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue >= 0
    ? numberValue
    : undefined;
}

function getYearFilter(value: string | undefined) {
  const year = getNumberFilter(value);

  return Number.isInteger(year) ? year : undefined;
}

function getMarketplaceFilters(
  params: Record<string, string | undefined>,
): PublishedRentConsoleFilters {
  const availability = availabilityOptions.includes(
    params.availability as AvailabilityStatus,
  )
    ? (params.availability as AvailabilityStatus)
    : undefined;
  const consoleType = consoleTypeOptions.includes(
    params.console_type as ConsoleType,
  )
    ? (params.console_type as ConsoleType)
    : undefined;
  const priceType = priceTypes.includes(params.price_type ?? "")
    ? (params.price_type as PublishedRentConsoleFilters["priceType"])
    : "live_price";
  const minPrice = getNumberFilter(params.min_price);
  const maxPrice = getNumberFilter(params.max_price);

  return {
    availability,
    consoleType,
    country: params.country?.trim().toUpperCase() || undefined,
    yearFrom: getYearFilter(params.year_from),
    yearTo: getYearFilter(params.year_to),
    priceType:
      minPrice !== undefined || maxPrice !== undefined ? priceType : undefined,
    minPrice,
    maxPrice,
  };
}

function getActiveFilterCount(params: Record<string, string | undefined>) {
  return [
    params.availability,
    params.console_type,
    params.country,
    params.year_from,
    params.year_to,
    params.min_price,
    params.max_price,
  ].filter(Boolean).length;
}

export default async function RentMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const filters = getMarketplaceFilters(params);
  const activeFilterCount = getActiveFilterCount(params);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [consolePage, filterOptions, profile, transferApps] = await Promise.all(
    [
      getPublishedRentConsolesPage({ page, pageSize: PAGE_SIZE, filters }),
      getPublishedRentConsoleFilterOptions(),
      user ? getUserProfile(user.id) : null,
      user ? getTransferAppOptions(user.id) : [],
    ],
  );
  const { consoles, hasNextPage, hasPreviousPage } = consolePage;
  const countries = Array.from(
    new Set(filterOptions.map((option) => option.country_code)),
  ).sort();
  const years = Array.from(
    new Set(filterOptions.map((option) => option.creation_year)),
  ).sort((first, second) => second - first);

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
            <h1 className="text-4xl leading-none tracking-normal sm:text-7xl lg:text-8xl">
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
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <RentMarketplaceFilters
              activeFilterCount={activeFilterCount}
              countries={countries}
              searchParams={params}
              years={years}
            />
            {activeFilterCount > 0 ? (
              <a
                href="/rent-marketplace"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-sm text-black transition hover:border-black"
              >
                Reset Filters
              </a>
            ) : null}
          </div>
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
                    initialTelegramUsername={profile?.telegram_username}
                    initialTelegramNumber={profile?.telegram_number}
                    initialDraftAccessEmail={profile?.draft_access_email}
                    transferAppOptions={transferApps
                      .filter((app) => app.rent_console_id === consoleItem.id)
                      .map((app) => ({
                        appName: app.app_name,
                        packageName: app.package_name,
                      }))}
                  />
                </div>
              ))}
              <div className="w-full lg:w-[70vw] lg:max-w-5xl">
                <PagePagination
                  ariaLabel="Rent marketplace pagination"
                  alwaysShow
                  basePath="/rent-marketplace"
                  currentPage={consolePage.page}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  searchParams={params}
                />
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-black/10 bg-neutral-50 p-8">
              <p className="font-lilita text-3xl">
                {hasPreviousPage
                  ? "No consoles on this page"
                  : activeFilterCount > 0
                    ? "No consoles match these filters"
                    : "No consoles available"}
              </p>
              <p className="mt-2 text-sm text-black/60">
                {hasPreviousPage
                  ? "Go back to the previous page to continue browsing published consoles."
                  : activeFilterCount > 0
                    ? "Adjust or reset the filters to see more marketplace listings."
                    : "New rent listings will appear here as soon as they are published."}
              </p>
              {activeFilterCount > 0 && !hasPreviousPage ? (
                <a
                  href="/rent-marketplace"
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
                >
                  Reset Filters
                </a>
              ) : null}
              <PagePagination
                ariaLabel="Rent marketplace pagination"
                alwaysShow
                basePath="/rent-marketplace"
                currentPage={consolePage.page}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                searchParams={params}
              />
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
      <ScrollToTopButton />
      <FloatingContactWidget />
    </main>
  );
}
