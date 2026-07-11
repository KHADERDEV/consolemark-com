import { ChevronDown } from "lucide-react";
import { redirect } from "next/navigation";

import { SiteNavbar } from "@/components/layout/site-navbar";
import {
  PaymentStatusTags,
  PaymentSummary,
} from "@/components/payments/payment-summary";
import { FloatingContactWidget } from "@/components/support/floating-contact-widget";
import { CopyValueButton } from "@/components/ui/copy-value-button";
import { PagePagination } from "@/components/ui/page-pagination";
import { getPageValue, paginateItems } from "@/lib/pagination";
import { getUserPayments } from "@/lib/payments";
import { formatMoney, getConsoleTypeLabel } from "@/lib/rent-consoles";
import { createClient } from "@/lib/supabase/server";
import {
  getTransferAppStatusClass,
  getTransferAppStatusLabel,
  getTransferStatusLabel,
  getUserTransferRequests,
  type TransferRequestStatus,
  transferRequestStatuses,
} from "@/lib/transfer-requests";

export const metadata = {
  title: "My Transfers | Console Mark",
};

const statusClasses: Record<TransferRequestStatus, string> = {
  requested: "bg-[#fdd52e] text-black",
  approved: "bg-[#02feb7] text-black",
  rejected: "bg-[#ff2780] text-white",
  cancelled: "bg-neutral-200 text-black",
};

const PAGE_SIZE = 10;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDateInputValue(value: string) {
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

export default async function MyTransfersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [requests, payments] = await Promise.all([
    getUserTransferRequests(user.id),
    getUserPayments(user.id),
  ]);
  const statusFilter = params.status;
  const searchQuery = params.q?.trim().toLowerCase() ?? "";
  const dateFilter = params.date;
  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      !statusFilter ||
      transferRequestStatuses.includes(statusFilter as TransferRequestStatus)
        ? !statusFilter || request.status === statusFilter
        : true;
    const matchesSearch =
      !searchQuery ||
      request.request_code.toLowerCase().includes(searchQuery) ||
      request.app_names.some((appName) =>
        appName.toLowerCase().includes(searchQuery),
      ) ||
      request.package_names.some((packageName) =>
        packageName.toLowerCase().includes(searchQuery),
      );
    const matchesDate =
      !dateFilter || getDateInputValue(request.created_at) === dateFilter;

    return matchesStatus && matchesSearch && matchesDate;
  });
  const requestPage = paginateItems({
    items: filteredRequests,
    page,
    pageSize: PAGE_SIZE,
  });
  const pagedRequests = requestPage.items;

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar stable />
      <section className="mx-auto w-full max-w-6xl px-4 pt-36 pb-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl leading-none sm:text-5xl">My Transfers</h1>
        <p className="mt-3 text-sm text-black/60">
          Review transfer requests, destination account details, status updates,
          and console owner notes.
        </p>

        <details
          className="mt-6 rounded-[22px] border border-black/10 bg-neutral-50 p-3 lg:hidden"
          open={Boolean(params.q || params.status || params.date)}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-full bg-white px-4 py-3 text-sm">
            <span>Filters</span>
            <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
              {filteredRequests.length} result
              {filteredRequests.length === 1 ? "" : "s"}
            </span>
          </summary>
          <form className="mt-3 grid gap-2">
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search ID, app, package"
              className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                name="status"
                defaultValue={params.status ?? ""}
                className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              >
                <option value="">All statuses</option>
                {transferRequestStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getTransferStatusLabel(status)}
                  </option>
                ))}
              </select>
              <input
                name="date"
                type="date"
                defaultValue={params.date}
                className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none transition focus:border-black"
              />
            </div>
            <button
              type="submit"
              className="min-h-11 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
            >
              Apply Filters
            </button>
          </form>
        </details>

        <form className="mt-8 hidden gap-3 rounded-[28px] border border-black/10 bg-neutral-50 p-4 lg:grid lg:grid-cols-[1fr_180px_170px_auto]">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search request ID, app, or package"
            className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
          />
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
          >
            <option value="">All statuses</option>
            {transferRequestStatuses.map((status) => (
              <option key={status} value={status}>
                {getTransferStatusLabel(status)}
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

        <div className="mt-6 grid gap-4 lg:mt-8 lg:gap-6">
          {pagedRequests.length > 0 ? (
            pagedRequests.map((request) => {
              const consoleItem = request.rent_consoles;
              const showCents = consoleItem?.show_price_cents ?? true;
              const transferPrice = consoleItem
                ? formatMoney(consoleItem.transfer_apps_price, showCents)
                : null;
              const requestPayments = payments.filter(
                (payment) =>
                  payment.request_type === "transfer" &&
                  payment.request_code === request.request_code,
              );

              return (
                <details
                  key={request.id}
                  className="group overflow-hidden rounded-[22px] border-2 border-black/10 bg-neutral-50 shadow-[0_12px_34px_rgba(0,0,0,0.06)] lg:rounded-[28px] lg:shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
                >
                  <summary className="grid cursor-pointer list-none gap-3 border-b border-black/10 bg-white p-4 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-5 lg:p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs lg:hidden ${statusClasses[request.status]}`}
                        >
                          {getTransferStatusLabel(request.status)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs text-white">
                          <span className="text-white/60">Request ID</span>
                          <span>{request.request_code}</span>
                        </span>
                        <CopyValueButton
                          value={request.request_code}
                          label="request ID"
                        />
                        <span className="text-sm text-black/45">
                          Submitted {formatDate(request.created_at)}
                        </span>
                      </div>
                      <h2 className="mt-3 break-words text-2xl leading-none sm:text-4xl">
                        {request.app_names.length} app
                        {request.app_names.length === 1 ? "" : "s"} to transfer
                      </h2>
                      <p className="mt-2 break-all text-base leading-5 text-black/75 sm:mt-3 sm:text-2xl sm:leading-6">
                        {request.app_names.join(", ")}
                      </p>
                      <p className="mt-1 break-all text-sm text-black/50">
                        {request.package_names.join(", ")}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <PaymentStatusTags
                          payments={requestPayments}
                          types={["live", "transfer"]}
                        />
                        {consoleItem ? (
                          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/55 lg:hidden">
                            {getConsoleTypeLabel(consoleItem.console_type)}
                          </span>
                        ) : null}
                      </div>
                      {request.status === "approved" && request.app_status ? (
                        <div className="mt-3">
                          <span
                            className={`inline-flex min-h-10 items-center rounded-full px-4 text-base ${getTransferAppStatusClass(request.app_status)}`}
                          >
                            App Status:{" "}
                            {getTransferAppStatusLabel(request.app_status)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                      <span
                        className={`hidden min-h-9 items-center rounded-full px-4 text-sm lg:inline-flex ${statusClasses[request.status]}`}
                      >
                        {getTransferStatusLabel(request.status)}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition group-open:rotate-180">
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                  </summary>

                  {request.status === "requested" ? (
                    <div className="flex justify-start px-4 pt-4 lg:justify-end lg:px-5 lg:pt-5">
                      <form
                        action={`/api/transfer-requests/${request.id}/cancel`}
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

                  <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5 lg:p-5">
                    <div className="rounded-[20px] border border-black/10 bg-white p-4 lg:rounded-[22px] lg:p-5">
                      <p className="text-sm text-black/45">Console listing</p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <p className="break-words text-2xl leading-none lg:text-3xl">
                          {consoleItem?.name ?? "Console listing"}
                        </p>
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

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <DetailItem
                          label="Console type"
                          value={
                            consoleItem
                              ? getConsoleTypeLabel(consoleItem.console_type)
                              : "Not available"
                          }
                        />
                        <DetailItem
                          label="Transfer apps price"
                          value={transferPrice ?? "Not available"}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <DetailItem
                        label="Developer account"
                        value={request.developer_account_id}
                      />
                      <DetailItem
                        label="Transaction / verification code"
                        value={request.transaction_id}
                      />
                      <DetailItem
                        label="WhatsApp number"
                        value={request.whatsapp_number ?? "Not provided"}
                      />
                      <DetailItem
                        label="Telegram username"
                        value={request.telegram_username ?? "Not provided"}
                      />
                      <DetailItem
                        label="Telegram number"
                        value={request.telegram_number ?? "Not provided"}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 px-4 pb-4 lg:grid-cols-2 lg:gap-5 lg:px-5 lg:pb-5">
                    <PaymentSummary
                      payments={requestPayments}
                      types={["live", "transfer"]}
                    />

                    <div className="rounded-[20px] border border-black/10 bg-white p-4 lg:rounded-[22px] lg:p-5">
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
                {requestPage.hasPreviousPage
                  ? "No transfer requests on this page."
                  : requests.length > 0
                    ? "No transfer requests match the selected filters."
                    : "You have not submitted any transfer requests yet."}
              </p>
            </div>
          )}
          <PagePagination
            ariaLabel="My transfers pagination"
            basePath="/my-transfers"
            currentPage={requestPage.page}
            hasNextPage={requestPage.hasNextPage}
            hasPreviousPage={requestPage.hasPreviousPage}
            searchParams={params}
          />
        </div>
      </section>
      <FloatingContactWidget />
    </main>
  );
}
