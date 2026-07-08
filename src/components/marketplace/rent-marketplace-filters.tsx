"use client";

import { SlidersHorizontal } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RentMarketplaceFiltersProps = {
  searchParams: Record<string, string | undefined>;
  countries: string[];
  years: number[];
  activeFilterCount: number;
};

const availabilityOptions = [
  { value: "available_for_rent", label: "Available for Rent" },
  { value: "not_available_for_rent", label: "Not Available for Rent" },
  { value: "fully_rented", label: "Fully Rented" },
] as const;

const consoleTypeOptions = [
  { value: "personal", label: "Personal" },
  { value: "organization", label: "Organization" },
] as const;

const priceTypes = [
  { value: "live_price", label: "Live price" },
  { value: "weekly_price", label: "Weekly price" },
  { value: "transfer_apps_price", label: "Transfer apps price" },
] as const;

export function RentMarketplaceFilters({
  searchParams,
  countries,
  years,
  activeFilterCount,
}: RentMarketplaceFiltersProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 ? (
            <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#55d3e8] px-2 text-xs text-black">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[min(760px,calc(100svh-2rem))] overflow-y-auto rounded-[28px] bg-white p-0 text-black sm:max-w-2xl">
        <DialogHeader className="border-b border-black/10 px-5 pt-5 pb-4 sm:px-6">
          <DialogTitle className="font-lilita text-3xl leading-none">
            Filters
          </DialogTitle>
          <DialogDescription className="text-sm text-black/55">
            Narrow listings by availability, price, type, country, and console
            creation year.
          </DialogDescription>
        </DialogHeader>

        <form action="/rent-marketplace" className="grid gap-5 px-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-black/55">Available for</span>
              <select
                name="availability"
                defaultValue={searchParams.availability ?? ""}
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                <option value="">All availability</option>
                {availabilityOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Console type</span>
              <select
                name="console_type"
                defaultValue={searchParams.console_type ?? ""}
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                <option value="">All types</option>
                {consoleTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Country</span>
              <select
                name="country"
                defaultValue={searchParams.country ?? ""}
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                <option value="">All countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Price type</span>
              <select
                name="price_type"
                defaultValue={searchParams.price_type ?? "live_price"}
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                {priceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-black/55">Minimum price</span>
              <input
                name="min_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={searchParams.min_price ?? ""}
                placeholder="0"
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Maximum price</span>
              <input
                name="max_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={searchParams.max_price ?? ""}
                placeholder="100"
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-black/55">Creation year from</span>
              <select
                name="year_from"
                defaultValue={searchParams.year_from ?? ""}
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                <option value="">Any year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Creation year to</span>
              <select
                name="year_to"
                defaultValue={searchParams.year_to ?? ""}
                className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                <option value="">Any year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <DialogFooter className="-mx-5 mt-1 gap-3 rounded-none border-black/10 bg-neutral-50 sm:-mx-6 sm:flex-row sm:justify-between">
            <a
              href="/rent-marketplace"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-black transition hover:border-black"
            >
              Reset Filters
            </a>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <DialogClose asChild>
                <button
                  type="button"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-5 text-black transition hover:border-black"
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
              >
                Apply Filters
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
