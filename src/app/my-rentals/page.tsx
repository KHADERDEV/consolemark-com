import { ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";

import { SiteNavbar } from "@/components/layout/site-navbar";
import { formatMoney, getConsoleTypeLabel } from "@/lib/rent-consoles";
import {
  getStatusLabel,
  getUserRentRequests,
  type RentRequestStatus,
  rentRequestStatuses,
} from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My Rentals | Console Mark",
};

const statusClasses: Record<RentRequestStatus, string> = {
  requested: "bg-[#fdd52e] text-black",
  approved: "bg-[#02feb7] text-black",
  rejected: "bg-[#ff2780] text-white",
  cancelled: "bg-neutral-200 text-black",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getRequestDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] bg-white p-4">
      <p className="text-xs text-black/45">{label}</p>
      <div className="mt-1 break-words text-base leading-5 text-black">
        {value}
      </div>
    </div>
  );
}

export default async function MyRentalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const requests = await getUserRentRequests(user.id);
  const statusFilter = params.status;
  const searchQuery = params.q?.trim().toLowerCase() ?? "";
  const dateFilter = params.date;
  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      !statusFilter ||
      rentRequestStatuses.includes(statusFilter as RentRequestStatus)
        ? !statusFilter || request.status === statusFilter
        : true;
    const matchesSearch =
      !searchQuery ||
      request.app_name.toLowerCase().includes(searchQuery) ||
      request.package_name.toLowerCase().includes(searchQuery);
    const matchesDate =
      !dateFilter ||
      getRequestDateInputValue(request.created_at) === dateFilter;

    return matchesStatus && matchesSearch && matchesDate;
  });

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar stable />
      <section className="mx-auto w-full max-w-6xl px-4 pt-36 pb-16 sm:px-6 lg:px-8">
        <h1 className="text-5xl leading-none">My Rentals</h1>
        <p className="mt-3 text-sm text-black/60">
          Review your console requests, access details, status updates, and
          console owner notes.
        </p>

        <form className="mt-8 grid gap-3 rounded-[28px] border border-black/10 bg-neutral-50 p-4 lg:grid-cols-[1fr_180px_170px_auto]">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search app or package"
            className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
          />
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
          >
            <option value="">All statuses</option>
            {rentRequestStatuses.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
          <input
            name="date"
            type="date"
            defaultValue={params.date}
            className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
          />
          <button
            type="submit"
            className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
          >
            Filter
          </button>
        </form>
        {params.q || params.status || params.date ? (
          <a
            href="/my-rentals"
            className="mt-3 inline-flex min-h-9 items-center rounded-full border border-black/10 px-4 text-sm transition hover:border-black"
          >
            Clear filters
          </a>
        ) : null}

        <div className="mt-8 grid gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const consoleItem = request.rent_consoles;
              const showCents = consoleItem?.show_price_cents ?? true;
              const livePrice = consoleItem
                ? formatMoney(consoleItem.live_price, showCents)
                : null;
              const weeklyPrice = consoleItem
                ? formatMoney(consoleItem.weekly_price, showCents)
                : null;
              const transferPrice = consoleItem
                ? formatMoney(consoleItem.transfer_apps_price, showCents)
                : null;

              return (
                <details
                  key={request.id}
                  className="group overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50 shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
                >
                  <summary className="grid cursor-pointer list-none gap-5 border-b border-black/10 bg-white p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div className="min-w-0">
                      <p className="text-sm text-black/45">
                        Request submitted {formatDate(request.created_at)}
                      </p>
                      <h2 className="mt-2 break-words text-4xl leading-none sm:text-4xl">
                        {request.app_name}
                      </h2>
                      <p className="mt-3 break-all text-xl leading-6 text-black/75 sm:text-2xl">
                        {request.package_name}
                      </p>
                      <p className="mt-1 text-xs text-black/40">Package name</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span
                        className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm ${statusClasses[request.status]}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition group-open:rotate-180">
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  </summary>

                  {request.status === "requested" ? (
                    <div className="flex justify-start px-5 pt-5 lg:justify-end">
                      <form
                        action={`/api/rent-requests/${request.id}/cancel`}
                        method="post"
                      >
                        <button
                          type="submit"
                          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-[#ff2780] transition hover:border-[#ff2780]/30 hover:bg-[#ff2780]/10"
                        >
                          Cancel request
                        </button>
                      </form>
                    </div>
                  ) : null}

                  <div className="grid gap-5 p-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">Console requested</p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="break-words text-3xl leading-none">
                            {consoleItem?.name ?? "Console listing"}
                          </p>
                        </div>
                        {consoleItem?.console_url ? (
                          <a
                            href={consoleItem.console_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-black px-4 text-sm text-white transition hover:bg-[#55d3e8] hover:text-black"
                          >
                            Open Console
                          </a>
                        ) : null}
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <DetailItem
                          label="Live price"
                          value={livePrice ?? "Not available"}
                        />
                        <DetailItem
                          label="Weekly price"
                          value={weeklyPrice ?? "Not available"}
                        />
                        <DetailItem
                          label="Transfer apps"
                          value={transferPrice ?? "Not available"}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <DetailItem
                        label="Submission type"
                        value={
                          request.submission_type === "game" ? "Game" : "App"
                        }
                      />
                      <DetailItem
                        label="Pricing type"
                        value={
                          request.pricing_type === "paid" ? "Paid" : "Free"
                        }
                      />
                      {consoleItem ? (
                        <DetailItem
                          label="Console type"
                          value={getConsoleTypeLabel(consoleItem.console_type)}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-5 px-5 pb-5 lg:grid-cols-2">
                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">
                        Draft access details
                      </p>
                      <div className="mt-4 grid gap-3">
                        <DetailItem
                          label="Gmail account"
                          value={request.gmail}
                        />
                        <DetailItem
                          label="WhatsApp number"
                          value={request.whatsapp_number}
                        />
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">
                        Console owner note
                      </p>
                      {request.admin_note ? (
                        <p className="mt-3 text-base leading-6">
                          {request.admin_note}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-black/50">
                          No console owner note has been added yet. Updates will
                          appear here when the team reviews your request.
                        </p>
                      )}
                    </div>
                  </div>
                </details>
              );
            })
          ) : (
            <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-6">
              <p className="text-sm text-black/60">
                {requests.length > 0
                  ? "No rent requests match the selected filters."
                  : "You have not submitted any rent requests yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
