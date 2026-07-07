import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";

export const rentRequestStatuses = [
  "requested",
  "approved",
  "rejected",
  "cancelled",
] as const;

export type RentRequestStatus = (typeof rentRequestStatuses)[number];

export type RentRequest = {
  id: string;
  user_id: string;
  rent_console_id: string;
  app_name: string;
  package_name: string;
  submission_type: "app" | "game";
  pricing_type: "free" | "paid";
  gmail: string;
  whatsapp_number: string;
  status: RentRequestStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  rent_consoles?: {
    id: string;
    name: string;
    console_type: "personal" | "organization";
    console_url: string;
    live_price: string;
    weekly_price: string;
    transfer_apps_price: string | null;
    show_price_cents: boolean;
  };
  user_profiles?: {
    email: string | null;
    display_name: string | null;
    whatsapp_number: string | null;
  };
};

export const rentRequestFormSchema = z.object({
  rent_console_id: z.uuid(),
  app_name: z.string().trim().min(1).max(30),
  package_name: z.string().trim().min(1).max(160),
  submission_type: z.enum(["app", "game"]),
  pricing_type: z.enum(["free", "paid"]),
  gmail: z
    .email()
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Use a Gmail address.",
    }),
  whatsapp_number: z
    .string()
    .trim()
    .regex(
      /^\+[1-9]\d{7,18}$/,
      "Use a full WhatsApp number with country code.",
    ),
});

export const adminRentRequestSchema = z.object({
  status: z.enum(rentRequestStatuses),
  admin_note: z.string().trim().max(2000).optional().nullable(),
});

const requestSelect =
  "id,user_id,rent_console_id,app_name,package_name,submission_type,pricing_type,gmail,whatsapp_number,status,admin_note,created_at,updated_at,rent_consoles(id,name,console_type,console_url,live_price,weekly_price,transfer_apps_price,show_price_cents),user_profiles(email,display_name,whatsapp_number)";

export function getStatusLabel(status: RentRequestStatus) {
  const labels: Record<RentRequestStatus, string> = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return labels[status];
}

export async function getUserRentRequests(userId: string) {
  return supabaseRest<RentRequest[]>("rent_requests", {
    query: {
      select: requestSelect,
      user_id: `eq.${userId}`,
      order: "created_at.desc",
    },
  });
}

export async function getAdminRentRequests(filters: {
  status?: string;
  userId?: string;
  query?: string;
  from?: string;
  to?: string;
}) {
  const query: Record<string, string> = {
    select: requestSelect,
    order: "created_at.desc",
  };

  if (filters.status) {
    query.status = `eq.${filters.status}`;
  }

  if (filters.userId) {
    query.user_id = `eq.${filters.userId}`;
  }

  if (filters.from) {
    query.created_at = `gte.${filters.from}`;
  }

  if (filters.to && !filters.from) {
    query.created_at = `lte.${filters.to}`;
  }

  if (filters.from && filters.to) {
    delete query.created_at;
    query.and = `(created_at.gte.${filters.from},created_at.lte.${filters.to})`;
  }

  if (filters.query) {
    const safeQuery = filters.query.replaceAll("*", "").replaceAll(",", " ");
    query.or = `(app_name.ilike.*${safeQuery}*,package_name.ilike.*${safeQuery}*)`;
  }

  return supabaseRest<RentRequest[]>("rent_requests", { query });
}

export async function createRentRequest(input: {
  userId: string;
  rentConsoleId: string;
  appName: string;
  packageName: string;
  submissionType: "app" | "game";
  pricingType: "free" | "paid";
  gmail: string;
  whatsappNumber: string;
}) {
  await supabaseRest("rent_requests", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      user_id: input.userId,
      rent_console_id: input.rentConsoleId,
      app_name: input.appName,
      package_name: input.packageName,
      submission_type: input.submissionType,
      pricing_type: input.pricingType,
      gmail: input.gmail,
      whatsapp_number: input.whatsappNumber,
      status: "requested",
    },
  });
}

export async function updateUserWhatsapp(
  userId: string,
  whatsappNumber: string,
) {
  await supabaseRest("user_profiles", {
    method: "POST",
    query: {
      on_conflict: "id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      id: userId,
      whatsapp_number: whatsappNumber,
    },
  });
}

export async function getUserProfile(userId: string) {
  const rows = await supabaseRest<
    Array<{
      id: string;
      email: string | null;
      display_name: string | null;
      avatar_url: string | null;
      whatsapp_number: string | null;
    }>
  >("user_profiles", {
    query: {
      select: "id,email,display_name,avatar_url,whatsapp_number",
      id: `eq.${userId}`,
      limit: "1",
    },
  });

  return rows[0] ?? null;
}

export async function cancelRentRequest(id: string, userId: string) {
  await supabaseRest("rent_requests", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
      user_id: `eq.${userId}`,
      status: "eq.requested",
    },
    prefer: "return=minimal",
    body: {
      status: "cancelled",
    },
  });
}

export async function updateAdminRentRequest(
  id: string,
  data: z.infer<typeof adminRentRequestSchema>,
) {
  await supabaseRest("rent_requests", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
    body: {
      status: data.status,
      admin_note: data.admin_note ?? null,
    },
  });
}
