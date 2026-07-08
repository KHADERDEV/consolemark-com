import {
  formatPaymentDate,
  getDisplayPaymentStatus,
  getPaymentStatusClass,
  getPaymentTypeLabel,
  type Payment,
  type PaymentType,
} from "@/lib/payments";

type PaymentSummaryProps = {
  title?: string;
  payments: Payment[];
  types: PaymentType[];
};

export function PaymentStatusTags({
  payments,
  types,
}: {
  payments: Payment[];
  types: PaymentType[];
}) {
  const filteredPayments = payments.filter((payment) =>
    types.includes(payment.payment_type),
  );

  if (filteredPayments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filteredPayments.map((payment) => (
        <span
          key={payment.id}
          className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs ${getPaymentStatusClass(payment)}`}
        >
          {getPaymentTypeLabel(payment.payment_type).replace(" Payment", "")}:{" "}
          {getDisplayPaymentStatus(payment)}
        </span>
      ))}
    </div>
  );
}

export function PaymentSummary({
  title = "Payment status",
  payments,
  types,
}: PaymentSummaryProps) {
  const filteredPayments = payments.filter((payment) =>
    types.includes(payment.payment_type),
  );

  return (
    <div className="rounded-[22px] border border-black/10 bg-white p-5">
      <p className="text-sm text-black/45">{title}</p>
      <div className="mt-4 grid gap-3">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-[18px] border border-black/10 bg-neutral-50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base">
                  {getPaymentTypeLabel(payment.payment_type)} |{" "}
                  {formatPaymentDate(payment.due_date)}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${getPaymentStatusClass(payment)}`}
                >
                  {getDisplayPaymentStatus(payment)}
                </span>
              </div>
              {payment.note ? (
                <p className="mt-2 text-sm leading-5 text-black/55">
                  {payment.note}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="rounded-[18px] bg-neutral-50 p-4 text-sm text-black/55">
            No payment records have been added yet.
          </p>
        )}
      </div>
    </div>
  );
}
