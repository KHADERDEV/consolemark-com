import { ChevronDown } from "lucide-react";

import { CopyButton } from "@/app/admin/(secure)/rent-orders/copy-button";
import { PagePagination } from "@/components/ui/page-pagination";
import { TrustedDeveloperBadge } from "@/components/users/trusted-developer-badge";
import { getPageValue } from "@/lib/pagination";
import {
  type ConsoleType,
  formatMoney,
  getAllRentConsoles,
  getConsoleTypeLabel,
} from "@/lib/rent-consoles";
import {
  getAdminRentRequests,
  getRentAppStatusClass,
  getRentAppStatusLabel,
  getStatusLabel,
  type RentRequestStatus,
  rentAppStatuses,
  rentRequestStatuses,
} from "@/lib/rent-requests";

export const metadata = {
  title: "Rent Orders | Console Mark Admin",
};

const statusClasses: Record<RentRequestStatus, string> = {
  requested: "bg-[#fdd52e] text-black",
  approved: "bg-[#02feb7] text-black",
  rejected: "bg-[#ff2780] text-white",
  cancelled: "bg-neutral-200 text-black",
};

const PAGE_SIZE = 10;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function AdminDetail({
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

function CopyField({
  label,
  value,
  size = "base",
}: {
  label: string;
  value: string;
  size?: "base" | "large";
}) {
  return (
    <div className="rounded-[20px] border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-black/45">{label}</p>
          <p
            className={
              size === "large"
                ? "mt-2 break-words text-3xl leading-none sm:text-4xl"
                : "mt-2 break-all text-xl leading-6"
            }
          >
            {value}
          </p>
        </div>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}

function AddRentRequestForm({
  consoles,
}: {
  consoles: Array<{ id: string; name: string }>;
}) {
  return (
    <details className="mt-8 rounded-[28px] border border-black/10 bg-neutral-50 p-5">
      <summary className="cursor-pointer list-none text-2xl">
        Add New Request
      </summary>
      <form
        action="/api/admin/rent-requests"
        method="post"
        className="mt-5 grid gap-3 rounded-[22px] border border-black/10 bg-white p-5"
      >
        <div className="grid gap-3 lg:grid-cols-2">
          <input
            name="user_id"
            required
            placeholder="User ID"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
          <select
            name="rent_console_id"
            required
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          >
            <option value="">Select console listing</option>
            {consoles.map((consoleItem) => (
              <option key={consoleItem.id} value={consoleItem.id}>
                {consoleItem.name}
              </option>
            ))}
          </select>
          <input
            name="app_name"
            required
            maxLength={30}
            placeholder="App/Game name"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
          <input
            name="package_name"
            required
            placeholder="Package name"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
          <select
            name="submission_type"
            defaultValue="app"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          >
            <option value="app">App</option>
            <option value="game">Game</option>
          </select>
          <select
            name="pricing_type"
            defaultValue="free"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          >
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
          <input
            name="gmail"
            required
            type="email"
            placeholder="Draft access email"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
          <input
            name="whatsapp_number"
            placeholder="WhatsApp number, e.g. +447520603830"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
          <input
            name="telegram_username"
            placeholder="Telegram username, e.g. @ConsoleMark_com"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
          <input
            name="telegram_number"
            placeholder="Telegram number, e.g. +447520603830"
            className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
          />
        </div>
        <p className="text-xs leading-5 text-black/50">
          Add at least one contact method: WhatsApp, Telegram username, or
          Telegram number.
        </p>
        <button
          type="submit"
          className="h-12 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
        >
          Create Rent Request
        </button>
      </form>
    </details>
  );
}

export default async function AdminRentOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const [requestPage, consoles] = await Promise.all([
    getAdminRentRequests({
      status: params.status,
      userId: params.user,
      query: params.q,
      from: params.from,
      to: params.to,
      page,
      pageSize: PAGE_SIZE,
    }),
    getAllRentConsoles(),
  ]);
  const requests = requestPage.items;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-3xl sm:text-5xl">Rent Orders</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
        Review every rent request, copy key publishing fields, inspect console
        details, update status, and write notes visible to the user.
      </p>

      {params.updated ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm">
          Rent request updated.
        </div>
      ) : null}
      {params.created ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm">
          Rent request created.
        </div>
      ) : null}
      {params.error ? (
        <div className="mt-6 rounded-full bg-[#ff2780]/10 px-5 py-3 text-sm text-[#b8004e]">
          {params.error === "user-not-found"
            ? "User ID was not found."
            : params.error === "duplicate"
              ? "This user already has a rent request for that app and package."
              : "Could not create the rent request. Check the required fields."}
        </div>
      ) : null}

      <AddRentRequestForm
        consoles={consoles.map((consoleItem) => ({
          id: consoleItem.id,
          name: consoleItem.name,
        }))}
      />

      <form className="mt-8 grid gap-3 rounded-[28px] border border-black/10 bg-neutral-50 p-5 lg:grid-cols-[1fr_220px_180px_160px_160px_auto]">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search request ID/app/package"
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <input
          name="user"
          defaultValue={params.user}
          placeholder="User ID"
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        >
          <option value="">All statuses</option>
          {rentRequestStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
        <input
          name="from"
          type="date"
          defaultValue={params.from}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <input
          name="to"
          type="date"
          defaultValue={params.to}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <button
          type="submit"
          className="h-11 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
        >
          Filter
        </button>
      </form>
      {params.q || params.user || params.status || params.from || params.to ? (
        <a
          href="/admin/rent-orders"
          className="mt-3 inline-flex min-h-9 items-center rounded-full border border-black/10 px-4 text-sm transition hover:border-black"
        >
          Clear filters
        </a>
      ) : null}

      <div className="mt-8 grid gap-6">
        {requests.length > 0 ? (
          requests.map((request) => {
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
            const isTrusted = request.user_profiles?.is_trusted ?? false;
            const requesterName =
              request.user_profiles?.display_name ??
              request.user_profiles?.email ??
              request.user_id;

            return (
              <details
                key={request.id}
                className="group overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50 shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
              >
                <summary className="grid cursor-pointer list-none gap-5 border-b border-black/10 bg-white p-5 transition hover:bg-neutral-50 xl:grid-cols-[1fr_auto] xl:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs text-white">
                        <span className="text-white/60">Request ID</span>
                        <span>{request.request_code}</span>
                      </span>
                      <CopyButton
                        value={request.request_code}
                        label="request ID"
                      />
                      <span className="text-sm text-black/45">
                        Submitted {formatDateTime(request.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 break-words text-3xl leading-none sm:text-5xl">
                      {request.app_name}
                    </p>
                    <p className="mt-3 break-all text-xl leading-6 text-black/75 sm:text-2xl">
                      {request.package_name}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/55">
                      {request.status === "approved" ? (
                        <span
                          className={`rounded-full px-3 py-1 ${getRentAppStatusClass(request.app_status)}`}
                        >
                          App/Game: {getRentAppStatusLabel(request.app_status)}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-black/10 bg-white px-3 py-1">
                        Email: {request.gmail}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1">
                        <span>User: {requesterName}</span>
                        {isTrusted ? <TrustedDeveloperBadge size="sm" /> : null}
                      </span>
                      <span className="rounded-full border border-black/10 bg-white px-3 py-1">
                        Console: {consoleItem?.name ?? request.rent_console_id}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 xl:items-end">
                    <span
                      className={`inline-flex min-h-10 items-center rounded-full px-4 text-base ${statusClasses[request.status]}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition group-open:rotate-180">
                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </summary>

                <div className="grid gap-5 p-5 xl:grid-cols-[1fr_360px]">
                  <div className="grid gap-5">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <CopyField
                        label="App/Game name"
                        value={request.app_name}
                        size="large"
                      />
                      <CopyField
                        label="Package name"
                        value={request.package_name}
                        size="large"
                      />
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                      <AdminDetail
                        label="Submitted"
                        value={formatDateTime(request.created_at)}
                      />
                      <AdminDetail
                        label="Last updated"
                        value={formatDateTime(request.updated_at)}
                      />
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">
                        Draft access and contact
                      </p>
                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        <CopyField
                          label="Draft access email"
                          value={request.gmail}
                          size="large"
                        />
                        <AdminDetail
                          label="WhatsApp number"
                          value={request.whatsapp_number ?? "Not provided"}
                        />
                        <AdminDetail
                          label="Telegram username"
                          value={request.telegram_username ?? "Not provided"}
                        />
                        <AdminDetail
                          label="Telegram number"
                          value={request.telegram_number ?? "Not provided"}
                        />
                        <AdminDetail
                          label="Submission type"
                          value={
                            request.submission_type === "game" ? "Game" : "App"
                          }
                        />
                        <AdminDetail
                          label="Pricing type"
                          value={
                            request.pricing_type === "paid" ? "Paid" : "Free"
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">Requester</p>
                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        <AdminDetail
                          label="User email"
                          value={request.user_profiles?.email ?? "Not stored"}
                        />
                        <AdminDetail
                          label="Profile name"
                          value={
                            <span className="inline-flex flex-wrap items-center gap-2">
                              {request.user_profiles?.display_name ??
                                "Not stored"}
                              {isTrusted ? <TrustedDeveloperBadge /> : null}
                            </span>
                          }
                        />
                        <AdminDetail label="User ID" value={request.user_id} />
                        <AdminDetail
                          label="Stored profile WhatsApp"
                          value={
                            request.user_profiles?.whatsapp_number ??
                            "Not stored"
                          }
                        />
                        <AdminDetail
                          label="Stored Telegram username"
                          value={
                            request.user_profiles?.telegram_username ??
                            "Not stored"
                          }
                        />
                        <AdminDetail
                          label="Stored Telegram number"
                          value={
                            request.user_profiles?.telegram_number ??
                            "Not stored"
                          }
                        />
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">Console listing</p>
                      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <p className="break-words text-3xl leading-none">
                            {consoleItem?.name ?? "Console listing"}
                          </p>
                          <p className="mt-2 break-all text-xs text-black/45">
                            Console listing ID: {request.rent_console_id}
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

                      <div className="mt-5 grid gap-3 lg:grid-cols-4">
                        <AdminDetail
                          label="Console type"
                          value={
                            consoleItem?.console_type
                              ? getConsoleTypeLabel(
                                  consoleItem.console_type as ConsoleType,
                                )
                              : "Not available"
                          }
                        />
                        <AdminDetail
                          label="Live price"
                          value={livePrice ?? "Not available"}
                        />
                        <AdminDetail
                          label="Weekly price"
                          value={weeklyPrice ?? "Not available"}
                        />
                        <AdminDetail
                          label="Transfer apps"
                          value={transferPrice ?? "Not available"}
                        />
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5">
                      <p className="text-sm text-black/45">Internal IDs</p>
                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        <AdminDetail
                          label="Rent request ID"
                          value={request.request_code}
                        />
                        <AdminDetail
                          label="Database row ID"
                          value={request.id}
                        />
                        <AdminDetail
                          label="Console listing ID"
                          value={request.rent_console_id}
                        />
                      </div>
                    </div>
                  </div>

                  <form
                    action={`/api/admin/rent-requests/${request.id}`}
                    method="post"
                    className="flex h-fit flex-col gap-3 rounded-[22px] border border-black/10 bg-white p-5"
                  >
                    <p className="text-sm text-black/45">Admin action</p>
                    <select
                      name="status"
                      defaultValue={request.status}
                      className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
                    >
                      {rentRequestStatuses.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                    <select
                      name="app_status"
                      defaultValue={request.app_status}
                      className="h-12 rounded-full border border-black/15 bg-white px-4 outline-none"
                    >
                      {rentAppStatuses.map((status) => (
                        <option key={status} value={status}>
                          {getRentAppStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="admin_note"
                      defaultValue={request.admin_note ?? ""}
                      placeholder="Admin note visible to user"
                      className="min-h-44 rounded-[22px] border border-black/15 bg-white p-4 outline-none"
                    />
                    <button
                      type="submit"
                      className="h-12 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
                    >
                      Save Order Update
                    </button>
                  </form>
                </div>
              </details>
            );
          })
        ) : (
          <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-6">
            <p className="text-sm text-black/60">
              No rent orders match the selected filters.
            </p>
          </div>
        )}
        <PagePagination
          ariaLabel="Admin rent orders pagination"
          basePath="/admin/rent-orders"
          currentPage={requestPage.page}
          hasNextPage={requestPage.hasNextPage}
          hasPreviousPage={requestPage.hasPreviousPage}
          searchParams={params}
        />
      </div>
    </div>
  );
}
