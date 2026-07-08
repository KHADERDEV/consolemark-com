import {
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  ShieldAlert,
  Store,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";

import { TrustedDeveloperBadge } from "@/components/users/trusted-developer-badge";
import { supabaseRest } from "@/lib/admin/supabase-rest";
import { getAdminCryptoWallets } from "@/lib/crypto-wallets";
import {
  formatPaymentDate,
  getAdminPayments,
  getDisplayPaymentStatus,
  getPaymentStatusClass,
  getPaymentTypeLabel,
} from "@/lib/payments";
import { getAllRentConsoles } from "@/lib/rent-consoles";
import { getAdminRentRequests, getStatusLabel } from "@/lib/rent-requests";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAdminTransferRequests,
  getTransferStatusLabel,
} from "@/lib/transfer-requests";

export const metadata = {
  title: "Admin Dashboard | Console Mark",
};

type UserProfileSummary = {
  id: string;
  is_trusted: boolean;
  is_blocked: boolean;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatCard({
  label,
  value,
  detail,
  href,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: true }>;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[28px] border-2 border-black/10 bg-neutral-50 p-5 shadow-[0_16px_44px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-black"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-[#55d3e8] group-hover:text-black">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <ArrowUpRight className="h-5 w-5 text-black/35 transition group-hover:text-black" />
      </div>
      <p className="mt-5 text-sm text-black/50">{label}</p>
      <p className="mt-2 text-5xl leading-none">{value}</p>
      <p className="mt-3 text-sm leading-6 text-black/55">{detail}</p>
    </Link>
  );
}

function QueueLink({
  href,
  title,
  subtitle,
  tag,
  tagClass = "bg-neutral-100 text-black",
}: {
  href: string;
  title: string;
  subtitle: string;
  tag: string;
  tagClass?: string;
}) {
  return (
    <Link
      href={href}
      className="grid gap-3 rounded-[22px] border border-black/10 bg-white p-4 transition hover:border-black sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div className="min-w-0">
        <p className="break-words text-2xl leading-none">{title}</p>
        <p className="mt-2 break-all text-sm text-black/50">{subtitle}</p>
      </div>
      <span className={`w-fit rounded-full px-3 py-1 text-xs ${tagClass}`}>
        {tag}
      </span>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [
    consoles,
    rentRequests,
    transferRequests,
    payments,
    wallets,
    profileRows,
    authUsers,
  ] = await Promise.all([
    getAllRentConsoles(),
    getAdminRentRequests({}),
    getAdminTransferRequests({}),
    getAdminPayments({}),
    getAdminCryptoWallets(),
    supabaseRest<UserProfileSummary[]>("user_profiles", {
      query: {
        select: "id,is_trusted,is_blocked",
      },
    }),
    createAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const totalUsers = authUsers.data?.users.length ?? 0;
  const trustedUsers = profileRows.filter((profile) => profile.is_trusted);
  const blockedUsers = profileRows.filter((profile) => profile.is_blocked);
  const publishedConsoles = consoles.filter((item) => item.is_published);
  const availableConsoles = consoles.filter(
    (item) => item.availability_status === "available_for_rent",
  );
  const requestedRent = rentRequests.filter(
    (request) => request.status === "requested",
  );
  const requestedTransfers = transferRequests.filter(
    (request) => request.status === "requested",
  );
  const unpaidPayments = payments.filter(
    (payment) => payment.status === "unpaid",
  );
  const overduePayments = unpaidPayments.filter(
    (payment) => new Date(payment.due_date).getTime() < Date.now(),
  );
  const activeWallets = wallets.filter((wallet) => wallet.is_active);
  const recentRent = rentRequests.slice(0, 3);
  const recentTransfers = transferRequests.slice(0, 3);
  const recentPayments = payments.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-3xl sm:text-5xl">Dashboard</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
            Live operational overview for marketplace listings, developer
            accounts, rent orders, transfer orders, payments, and crypto
            wallets.
          </p>
        </div>
        <div className="rounded-full bg-black px-5 py-3 text-sm text-white">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date())}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Developers"
          value={totalUsers}
          detail={`${trustedUsers.length} trusted, ${blockedUsers.length} blocked`}
          href="/admin/users"
          icon={Users}
        />
        <StatCard
          label="Console Listings"
          value={publishedConsoles.length}
          detail={`${availableConsoles.length} available, ${consoles.length} total`}
          href="/admin/rent-marketplace"
          icon={Store}
        />
        <StatCard
          label="Open Requests"
          value={requestedRent.length + requestedTransfers.length}
          detail={`${requestedRent.length} rent, ${requestedTransfers.length} transfer`}
          href="/admin/rent-orders?status=requested"
          icon={Clock3}
        />
        <StatCard
          label="Unpaid Payments"
          value={unpaidPayments.length}
          detail={`${overduePayments.length} overdue payment record${overduePayments.length === 1 ? "" : "s"}`}
          href="/admin/payments?status=unpaid"
          icon={CircleDollarSign}
        />
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl leading-none">Priority Queues</h2>
              <p className="mt-2 text-sm text-black/55">
                Requests and payments that need the fastest admin attention.
              </p>
            </div>
            <Link
              href="/admin/payments"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-4 text-sm text-white transition hover:bg-[#55d3e8] hover:text-black"
            >
              Open Payments
            </Link>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-[24px] border border-black/10 bg-white p-4">
              <p className="text-sm text-black/45">Rent requests</p>
              <p className="mt-2 text-4xl leading-none">
                {requestedRent.length}
              </p>
              <Link
                href="/admin/rent-orders?status=requested"
                className="mt-4 inline-flex min-h-10 items-center rounded-full border border-black/10 px-4 text-sm transition hover:border-black"
              >
                Review Rent
              </Link>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white p-4">
              <p className="text-sm text-black/45">Transfer requests</p>
              <p className="mt-2 text-4xl leading-none">
                {requestedTransfers.length}
              </p>
              <Link
                href="/admin/transfer-orders?status=requested"
                className="mt-4 inline-flex min-h-10 items-center rounded-full border border-black/10 px-4 text-sm transition hover:border-black"
              >
                Review Transfers
              </Link>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white p-4">
              <p className="text-sm text-black/45">Overdue payments</p>
              <p className="mt-2 text-4xl leading-none">
                {overduePayments.length}
              </p>
              <Link
                href="/admin/payments?status=unpaid"
                className="mt-4 inline-flex min-h-10 items-center rounded-full border border-black/10 px-4 text-sm transition hover:border-black"
              >
                Review Unpaid
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-black p-5 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#55d3e8] text-black">
            <WalletCards className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mt-5 text-3xl leading-none">Payment Wallets</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            {activeWallets.length} active wallet
            {activeWallets.length === 1 ? "" : "s"} on the public payment page.
          </p>
          <div className="mt-5 grid gap-2">
            {activeWallets.slice(0, 3).map((wallet) => (
              <div
                key={wallet.id}
                className="rounded-[18px] border border-white/10 bg-white/5 p-3"
              >
                <p className="text-lg leading-none">{wallet.asset_name}</p>
                <p className="mt-1 text-xs text-white/55">
                  {wallet.network_name}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/admin/crypto-wallets"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm text-black transition hover:bg-[#55d3e8]"
          >
            Manage Wallets
          </Link>
        </section>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl leading-none">Recent Rent Orders</h2>
            <Link
              href="/admin/rent-orders"
              className="text-sm text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {recentRent.length > 0 ? (
              recentRent.map((request) => (
                <QueueLink
                  key={request.id}
                  href="/admin/rent-orders"
                  title={request.app_name}
                  subtitle={`${request.request_code} • ${request.package_name} • ${formatDateTime(request.created_at)}`}
                  tag={getStatusLabel(request.status)}
                  tagClass={
                    request.status === "requested"
                      ? "bg-[#fdd52e]/25 text-black"
                      : "bg-neutral-100 text-black"
                  }
                />
              ))
            ) : (
              <p className="rounded-[22px] bg-white p-4 text-sm text-black/55">
                No rent orders yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl leading-none">Recent Transfer Orders</h2>
            <Link
              href="/admin/transfer-orders"
              className="text-sm text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {recentTransfers.length > 0 ? (
              recentTransfers.map((request) => (
                <QueueLink
                  key={request.id}
                  href="/admin/transfer-orders"
                  title={request.app_names.join(", ")}
                  subtitle={`${request.request_code} • ${request.package_names.join(", ")} • ${formatDateTime(request.created_at)}`}
                  tag={getTransferStatusLabel(request.status)}
                  tagClass={
                    request.status === "requested"
                      ? "bg-[#fdd52e]/25 text-black"
                      : "bg-neutral-100 text-black"
                  }
                />
              ))
            ) : (
              <p className="rounded-[22px] bg-white p-4 text-sm text-black/55">
                No transfer orders yet.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl leading-none">Payment Timeline</h2>
            <Link
              href="/admin/payments"
              className="text-sm text-black/55 underline decoration-black/20 underline-offset-4 hover:text-black"
            >
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <QueueLink
                  key={payment.id}
                  href="/admin/payments"
                  title={`${getPaymentTypeLabel(payment.payment_type)} • ${payment.request_code}`}
                  subtitle={`${formatPaymentDate(payment.due_date)} • ${payment.amount ? `$${payment.amount}` : "No amount"}`}
                  tag={getDisplayPaymentStatus(payment)}
                  tagClass={getPaymentStatusClass(payment)}
                />
              ))
            ) : (
              <p className="rounded-[22px] bg-white p-4 text-sm text-black/55">
                No payment records yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-neutral-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff2780]/15 text-[#b8004e]">
            <ShieldAlert className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mt-5 text-3xl leading-none">Developer Trust</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[20px] bg-white p-4">
              <p className="text-sm text-black/45">Trusted developers</p>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-4xl leading-none">{trustedUsers.length}</p>
                {trustedUsers.length > 0 ? <TrustedDeveloperBadge /> : null}
              </div>
            </div>
            <div className="rounded-[20px] bg-white p-4">
              <p className="text-sm text-black/45">Blocked developers</p>
              <p className="mt-2 text-4xl leading-none">
                {blockedUsers.length}
              </p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-black px-5 text-sm text-white transition hover:bg-[#55d3e8] hover:text-black"
          >
            Manage Users
          </Link>
        </section>
      </div>
    </div>
  );
}
