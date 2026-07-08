import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";
import {
  createPagedResult,
  getPaginationQuery,
  type PagedResult,
} from "@/lib/pagination";

export const paymentTypes = ["live", "weekly", "transfer"] as const;
export const paymentStatuses = ["paid", "unpaid"] as const;
export const paymentRequestTypes = ["rent", "transfer"] as const;

export type PaymentType = (typeof paymentTypes)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type PaymentRequestType = (typeof paymentRequestTypes)[number];

export type Payment = {
  id: string;
  user_id: string;
  request_type: PaymentRequestType;
  request_code: string;
  payment_type: PaymentType;
  due_date: string;
  status: PaymentStatus;
  amount: string | null;
  note: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export const paymentFormSchema = z.object({
  request_code: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .transform((value) => value.toUpperCase()),
  payment_type: z.enum(paymentTypes),
  due_date: z.string().trim().min(1),
  status: z.enum(paymentStatuses),
  amount: z.coerce.number().min(0).optional().nullable(),
  note: z.string().trim().max(2000).optional().nullable(),
});

const paymentSelect =
  "id,user_id,request_type,request_code,payment_type,due_date,status,amount,note,paid_at,created_at,updated_at";

type ResolvedPaymentRequest = {
  user_id: string;
  request_type: PaymentRequestType;
  request_code: string;
};

export function getPaymentTypeLabel(type: PaymentType) {
  const labels: Record<PaymentType, string> = {
    live: "Live Payment",
    weekly: "Weekly Payment",
    transfer: "Transfer Payment",
  };

  return labels[type];
}

export function getDisplayPaymentStatus(payment: Payment) {
  if (payment.status === "paid") {
    return "Paid";
  }

  if (
    payment.payment_type === "weekly" &&
    new Date(payment.due_date).getTime() > Date.now()
  ) {
    return "Upcoming";
  }

  return "Unpaid";
}

export function getPaymentStatusClass(payment: Payment) {
  const displayStatus = getDisplayPaymentStatus(payment);

  if (displayStatus === "Paid") {
    return "bg-[#02feb7]/20 text-black";
  }

  if (displayStatus === "Upcoming") {
    return "bg-[#fdd52e]/25 text-black";
  }

  return "bg-[#ff2780]/10 text-[#b8004e]";
}

export function formatPaymentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function getUserPayments(userId: string) {
  return supabaseRest<Payment[]>("payments", {
    query: {
      select: paymentSelect,
      user_id: `eq.${userId}`,
      order: "due_date.desc,created_at.desc",
    },
  });
}

type AdminPaymentFilters = {
  requestCode?: string;
  requestType?: string;
  paymentType?: string;
  status?: string;
  userId?: string;
};

type AdminPaymentPageFilters = AdminPaymentFilters & {
  page: number;
  pageSize: number;
};

export async function getAdminPayments(
  filters: AdminPaymentPageFilters,
): Promise<PagedResult<Payment>>;
export async function getAdminPayments(
  filters: AdminPaymentFilters,
): Promise<Payment[]>;
export async function getAdminPayments(filters: {
  requestCode?: string;
  requestType?: string;
  paymentType?: string;
  status?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}) {
  const query: Record<string, string> = {
    select: paymentSelect,
    order: "due_date.desc,created_at.desc",
  };

  if (filters.requestCode) {
    query.request_code = `ilike.*${filters.requestCode.replaceAll("*", "")}*`;
  }

  if (filters.requestType) {
    query.request_type = `eq.${filters.requestType}`;
  }

  if (filters.paymentType) {
    query.payment_type = `eq.${filters.paymentType}`;
  }

  if (filters.status) {
    query.status = `eq.${filters.status}`;
  }

  if (filters.userId) {
    query.user_id = `eq.${filters.userId}`;
  }

  if (filters.page && filters.pageSize) {
    Object.assign(
      query,
      getPaginationQuery({ page: filters.page, pageSize: filters.pageSize }),
    );
  }

  const rows = await supabaseRest<Payment[]>("payments", { query });

  if (filters.page && filters.pageSize) {
    return createPagedResult({
      rows,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  }

  return rows;
}

export async function resolvePaymentRequest(requestCode: string) {
  const normalizedCode = requestCode.trim().toUpperCase();

  if (normalizedCode.startsWith("RR-")) {
    const rows = await supabaseRest<
      Array<{ user_id: string; request_code: string }>
    >("rent_requests", {
      query: {
        select: "user_id,request_code",
        request_code: `eq.${normalizedCode}`,
        limit: "1",
      },
    });

    if (rows[0]) {
      return {
        user_id: rows[0].user_id,
        request_type: "rent",
        request_code: rows[0].request_code,
      } satisfies ResolvedPaymentRequest;
    }
  }

  if (normalizedCode.startsWith("TR-")) {
    const rows = await supabaseRest<
      Array<{ user_id: string; request_code: string }>
    >("transfer_requests", {
      query: {
        select: "user_id,request_code",
        request_code: `eq.${normalizedCode}`,
        limit: "1",
      },
    });

    if (rows[0]) {
      return {
        user_id: rows[0].user_id,
        request_type: "transfer",
        request_code: rows[0].request_code,
      } satisfies ResolvedPaymentRequest;
    }
  }

  return null;
}

export async function upsertPayment(
  data: z.infer<typeof paymentFormSchema>,
  request: ResolvedPaymentRequest,
) {
  await supabaseRest("payments", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      user_id: request.user_id,
      request_type: request.request_type,
      request_code: request.request_code,
      payment_type: data.payment_type,
      due_date: data.due_date,
      status: data.status,
      amount: data.amount ?? null,
      note: data.note ?? null,
      paid_at: data.status === "paid" ? new Date().toISOString() : null,
    },
  });
}

export async function updatePayment(
  id: string,
  data: z.infer<typeof paymentFormSchema>,
  request: ResolvedPaymentRequest,
) {
  await supabaseRest("payments", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
    body: {
      user_id: request.user_id,
      request_type: request.request_type,
      request_code: request.request_code,
      payment_type: data.payment_type,
      due_date: data.due_date,
      status: data.status,
      amount: data.amount ?? null,
      note: data.note ?? null,
      paid_at: data.status === "paid" ? new Date().toISOString() : null,
    },
  });
}
