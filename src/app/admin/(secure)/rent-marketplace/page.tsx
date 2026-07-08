import { ChevronDown } from "lucide-react";

import { DeleteListingButton } from "@/app/admin/(secure)/rent-marketplace/delete-listing-button";
import { ListingForm } from "@/app/admin/(secure)/rent-marketplace/listing-form";
import { PagePagination } from "@/components/ui/page-pagination";
import { getPageValue } from "@/lib/pagination";
import {
  formatMoney,
  getAllRentConsolesPage,
  getAvailabilityLabel,
  getConsoleTypeLabel,
} from "@/lib/rent-consoles";

export const metadata = {
  title: "Rent Marketplace | Console Mark Admin",
};

const PAGE_SIZE = 10;

export default async function AdminRentMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const consolePage = await getAllRentConsolesPage({
    page,
    pageSize: PAGE_SIZE,
  });
  const consoles = consolePage.items;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-lilita text-3xl sm:text-5xl">Rent Marketplace</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Create, edit, publish, and remove Play Console rental listings.
            These records power the public marketplace.
          </p>
        </div>
        <a
          href="#create-listing"
          className="font-lilita inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-sm text-white transition hover:bg-black/85"
        >
          Create New Listing
        </a>
      </div>

      {params.created || params.updated || params.deleted ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm font-semibold text-black">
          Marketplace listing changes saved.
        </div>
      ) : null}

      {params.unpublished ? (
        <div className="mt-6 rounded-[22px] bg-[#fdd52e]/25 px-5 py-3 text-sm font-semibold text-black">
          This listing is linked to existing rent orders, so it was unpublished
          instead of permanently deleted.
        </div>
      ) : null}

      {params.error ? (
        <div className="mt-6 rounded-full bg-[#ff2780]/15 px-5 py-3 text-sm font-semibold text-[#b8004e]">
          The listing form was not valid. Check the required fields and try
          again.
        </div>
      ) : null}

      <details
        id="create-listing"
        className="mt-8 rounded-[28px] border border-black/10 bg-neutral-50 p-5"
      >
        <summary className="font-lilita cursor-pointer list-none text-2xl">
          Create New Listing
        </summary>
        <div className="mt-5">
          <ListingForm />
        </div>
      </details>

      <div className="mt-8 grid gap-5">
        {consoles.map((consoleItem) => (
          <details
            key={consoleItem.id}
            className="group overflow-hidden rounded-[28px] border border-black/10 bg-neutral-50"
          >
            <summary className="grid cursor-pointer list-none gap-4 bg-white p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-lilita break-words text-3xl leading-none">
                    {consoleItem.name}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      consoleItem.is_published
                        ? "bg-[#02feb7] text-black"
                        : "bg-neutral-200 text-black"
                    }`}
                  >
                    {consoleItem.is_published ? "Published" : "Unpublished"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/60">
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1">
                    {consoleItem.country_code}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1">
                    {getConsoleTypeLabel(consoleItem.console_type)}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1">
                    {consoleItem.creation_year}
                  </span>
                  <span className="rounded-full border border-black/10 bg-white px-3 py-1">
                    {getAvailabilityLabel(consoleItem.availability_status)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <div className="rounded-[18px] bg-neutral-50 px-4 py-2 text-sm">
                  Live {formatMoney(consoleItem.live_price)} / Weekly{" "}
                  {formatMoney(consoleItem.weekly_price)}
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition group-open:rotate-180">
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </summary>

            <div className="border-t border-black/10 p-5">
              <div className="mb-5 flex flex-col gap-3 rounded-[22px] border border-black/10 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid gap-1 text-sm text-black/60">
                  <p>
                    Owner:{" "}
                    <span className="text-black">{consoleItem.owner_name}</span>
                  </p>
                  <p className="break-all">
                    Console URL:{" "}
                    <a
                      href={consoleItem.console_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-black underline"
                    >
                      {consoleItem.console_url}
                    </a>
                  </p>
                  <p>
                    Sort order:{" "}
                    <span className="text-black">{consoleItem.sort_order}</span>
                  </p>
                </div>
                <DeleteListingButton
                  consoleId={consoleItem.id}
                  consoleName={consoleItem.name}
                />
              </div>
              <ListingForm consoleItem={consoleItem} />
            </div>
          </details>
        ))}
        <PagePagination
          ariaLabel="Admin rent marketplace pagination"
          basePath="/admin/rent-marketplace"
          currentPage={consolePage.page}
          hasNextPage={consolePage.hasNextPage}
          hasPreviousPage={consolePage.hasPreviousPage}
          searchParams={params}
        />
      </div>
    </div>
  );
}
