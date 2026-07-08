import { PagePagination } from "@/components/ui/page-pagination";
import { getPageValue } from "@/lib/pagination";
import {
  formatPaymentDate,
  getAdminPayments,
  getDisplayPaymentStatus,
  getPaymentStatusClass,
  getPaymentTypeLabel,
  type Payment,
  paymentStatuses,
  paymentTypes,
} from "@/lib/payments";

export const metadata = {
  title: "Payments | Console Mark Admin",
};

const PAGE_SIZE = 20;

function PaymentForm({ payment }: { payment?: Payment }) {
  const action = payment
    ? `/api/admin/payments/${payment.id}`
    : "/api/admin/payments";

  return (
    <form
      action={action}
      method="post"
      className="grid gap-3 rounded-[22px] border border-black/10 bg-white p-5"
    >
      {payment ? (
        <div className="grid gap-3 rounded-[18px] bg-neutral-50 p-4 text-sm text-black/60 lg:grid-cols-2">
          <p>
            Request type:{" "}
            <span className="text-black">
              {payment.request_type === "rent"
                ? "Rent Request"
                : "Transfer Request"}
            </span>
          </p>
          <p className="break-all">
            User ID: <span className="text-black">{payment.user_id}</span>
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-3">
        <input
          name="request_code"
          required
          defaultValue={payment?.request_code}
          placeholder="Request ID, e.g. RR-000001"
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        />
        <select
          name="payment_type"
          defaultValue={payment?.payment_type ?? "live"}
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        >
          {paymentTypes.map((type) => (
            <option key={type} value={type}>
              {getPaymentTypeLabel(type)}
            </option>
          ))}
        </select>
        <input
          name="due_date"
          type="date"
          required
          defaultValue={payment?.due_date}
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        />
        <select
          name="status"
          defaultValue={payment?.status ?? "unpaid"}
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        >
          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {status === "paid" ? "Paid" : "Unpaid"}
            </option>
          ))}
        </select>
      </div>
      <input
        name="amount"
        type="number"
        step="0.01"
        defaultValue={payment?.amount ?? ""}
        placeholder="Amount"
        className="h-11 rounded-full border border-black/15 px-4 outline-none"
      />
      <textarea
        name="note"
        defaultValue={payment?.note ?? ""}
        placeholder="Payment note"
        className="min-h-24 rounded-[22px] border border-black/15 p-4 outline-none"
      />
      <button
        type="submit"
        className="h-11 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
      >
        {payment ? "Save Payment" : "Create Payment"}
      </button>
    </form>
  );
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const paymentPage = await getAdminPayments({
    requestCode: params.q,
    requestType: params.request_type,
    paymentType: params.payment_type,
    status: params.status,
    userId: params.user,
    page,
    pageSize: PAGE_SIZE,
  });
  const payments = paymentPage.items;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-3xl sm:text-5xl">Payments</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
        Track Live, Weekly, and Transfer payments for rent and transfer
        requests.
      </p>

      {params.created || params.updated ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm">
          Payment changes saved.
        </div>
      ) : null}

      {params.error ? (
        <div className="mt-6 rounded-full bg-[#ff2780]/10 px-5 py-3 text-sm text-[#b8004e]">
          {params.error === "request-not-found"
            ? "Request ID was not found. Use a valid RR- or TR- request ID."
            : "Payment form is missing required values."}
        </div>
      ) : null}

      <details className="mt-8 rounded-[28px] border border-black/10 bg-neutral-50 p-5">
        <summary className="cursor-pointer list-none text-2xl">
          Create Payment
        </summary>
        <div className="mt-5">
          <PaymentForm />
        </div>
      </details>

      <form className="mt-8 grid gap-3 rounded-[28px] border border-black/10 bg-neutral-50 p-5 lg:grid-cols-[1fr_220px_160px_160px_160px_auto]">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search Request ID"
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <input
          name="user"
          defaultValue={params.user}
          placeholder="User ID"
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <select
          name="request_type"
          defaultValue={params.request_type ?? ""}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        >
          <option value="">All requests</option>
          <option value="rent">Rent</option>
          <option value="transfer">Transfer</option>
        </select>
        <select
          name="payment_type"
          defaultValue={params.payment_type ?? ""}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        >
          <option value="">All payment types</option>
          {paymentTypes.map((type) => (
            <option key={type} value={type}>
              {getPaymentTypeLabel(type)}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        >
          <option value="">All statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
        >
          Filter
        </button>
      </form>

      <div className="mt-8 grid gap-5">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <details
              key={payment.id}
              className="group overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50"
            >
              <summary className="grid cursor-pointer list-none gap-4 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black px-3 py-1.5 text-xs text-white">
                      {payment.request_code}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${getPaymentStatusClass(payment)}`}
                    >
                      {getDisplayPaymentStatus(payment)}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl leading-none">
                    {getPaymentTypeLabel(payment.payment_type)} |{" "}
                    {formatPaymentDate(payment.due_date)}
                  </p>
                  <p className="mt-2 text-sm text-black/50">
                    {payment.request_type} request • User {payment.user_id}
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm">
                  {payment.amount ? `$${payment.amount}` : "No amount"}
                </span>
              </summary>
              <div className="border-t border-black/10 p-5">
                <PaymentForm payment={payment} />
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-6">
            <p className="text-sm text-black/60">
              No payments match the selected filters.
            </p>
          </div>
        )}
        <PagePagination
          ariaLabel="Admin payments pagination"
          basePath="/admin/payments"
          currentPage={paymentPage.page}
          hasNextPage={paymentPage.hasNextPage}
          hasPreviousPage={paymentPage.hasPreviousPage}
          searchParams={params}
        />
      </div>
    </div>
  );
}
