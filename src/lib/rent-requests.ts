import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";
import {
  hasContactMethod,
  optionalPhoneContactSchema,
  optionalTelegramUsernameSchema,
  toContactMethods,
} from "@/lib/contact-methods";
import {
  createPagedResult,
  getPaginationQuery,
  type PagedResult,
} from "@/lib/pagination";

export const rentRequestStatuses = [
  "requested",
  "approved",
  "rejected",
  "cancelled",
] as const;

export type RentRequestStatus = (typeof rentRequestStatuses)[number];

export const rentAppStatuses = [
  "live",
  "draft",
  "in_review",
  "rejected",
  "unpublished",
  "suspended_by_google",
] as const;

export type RentAppStatus = (typeof rentAppStatuses)[number];

export type RentRequest = {
  id: string;
  request_code: string;
  user_id: string;
  rent_console_id: string;
  app_name: string;
  package_name: string;
  submission_type: "app" | "game";
  pricing_type: "free" | "paid";
  gmail: string;
  whatsapp_number: string | null;
  telegram_username: string | null;
  telegram_number: string | null;
  status: RentRequestStatus;
  app_status: RentAppStatus;
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
    telegram_username: string | null;
    telegram_number: string | null;
    is_trusted: boolean;
    is_blocked: boolean;
  };
};

const contactMethodsShape = {
  whatsapp_number: optionalPhoneContactSchema,
  telegram_username: optionalTelegramUsernameSchema,
  telegram_number: optionalPhoneContactSchema,
};

export const contactMethodsSchema = z
  .object({
    ...contactMethodsShape,
  })
  .refine(hasContactMethod, {
    message: "Add at least one contact method.",
    path: ["whatsapp_number"],
  });

export const rentRequestFormSchema = z
  .object({
    rent_console_id: z.uuid(),
    app_name: z.string().trim().min(1).max(30),
    package_name: z.string().trim().min(1).max(160),
    submission_type: z.enum(["app", "game"]),
    pricing_type: z.enum(["free", "paid"]),
    gmail: z.email(),
    ...contactMethodsShape,
  })
  .refine(hasContactMethod, {
    message: "Add at least one contact method.",
    path: ["whatsapp_number"],
  });

export const adminRentRequestSchema = z.object({
  status: z.enum(rentRequestStatuses),
  app_status: z.enum(rentAppStatuses),
  admin_note: z.string().trim().max(2000).optional().nullable(),
});

const requestSelect =
  "id,request_code,user_id,rent_console_id,app_name,package_name,submission_type,pricing_type,gmail,whatsapp_number,telegram_username,telegram_number,status,app_status,admin_note,created_at,updated_at,rent_consoles(id,name,console_type,console_url,live_price,weekly_price,transfer_apps_price,show_price_cents),user_profiles(email,display_name,whatsapp_number,telegram_username,telegram_number,is_trusted,is_blocked)";

export function getStatusLabel(status: RentRequestStatus) {
  const labels: Record<RentRequestStatus, string> = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return labels[status];
}

export function getRentAppStatusLabel(status: RentAppStatus) {
  const labels: Record<RentAppStatus, string> = {
    live: "Live",
    draft: "Draft",
    in_review: "In Review",
    rejected: "Rejected",
    unpublished: "Unpublished",
    suspended_by_google: "Suspended by Google",
  };

  return labels[status];
}

export function getRentAppStatusClass(status: RentAppStatus) {
  const classes: Record<RentAppStatus, string> = {
    live: "bg-[#02feb7] text-black",
    draft: "bg-neutral-200 text-black",
    in_review: "bg-[#fdd52e] text-black",
    rejected: "bg-[#ff2780] text-white",
    unpublished: "bg-black text-white",
    suspended_by_google: "bg-[#ff2780] text-white",
  };

  return classes[status];
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

export async function getUserRentRequestsPage({
  userId,
  page,
  pageSize,
}: {
  userId: string;
  page: number;
  pageSize: number;
}): Promise<PagedResult<RentRequest>> {
  const rows = await supabaseRest<RentRequest[]>("rent_requests", {
    query: {
      select: requestSelect,
      user_id: `eq.${userId}`,
      order: "created_at.desc",
      ...getPaginationQuery({ page, pageSize }),
    },
  });

  return createPagedResult({ rows, page, pageSize });
}

type AdminRentRequestFilters = {
  status?: string;
  userId?: string;
  query?: string;
  from?: string;
  to?: string;
};

type AdminRentRequestPageFilters = AdminRentRequestFilters & {
  page: number;
  pageSize: number;
};

export async function getAdminRentRequests(
  filters: AdminRentRequestPageFilters,
): Promise<PagedResult<RentRequest>>;
export async function getAdminRentRequests(
  filters: AdminRentRequestFilters,
): Promise<RentRequest[]>;
export async function getAdminRentRequests(filters: {
  status?: string;
  userId?: string;
  query?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
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
    query.or = `(request_code.ilike.*${safeQuery}*,app_name.ilike.*${safeQuery}*,package_name.ilike.*${safeQuery}*)`;
  }

  if (filters.page && filters.pageSize) {
    Object.assign(
      query,
      getPaginationQuery({ page: filters.page, pageSize: filters.pageSize }),
    );
  }

  const rows = await supabaseRest<RentRequest[]>("rent_requests", { query });

  if (filters.page && filters.pageSize) {
    return createPagedResult({
      rows,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  }

  return rows;
}

export async function createRentRequest(input: {
  userId: string;
  rentConsoleId: string;
  appName: string;
  packageName: string;
  submissionType: "app" | "game";
  pricingType: "free" | "paid";
  gmail: string;
  whatsappNumber: string | null;
  telegramUsername: string | null;
  telegramNumber: string | null;
}) {
  const rows = await supabaseRest<Array<{ request_code: string }>>(
    "rent_requests",
    {
      method: "POST",
      prefer: "return=representation",
      query: {
        select: "request_code",
      },
      body: {
        user_id: input.userId,
        rent_console_id: input.rentConsoleId,
        app_name: input.appName,
        package_name: input.packageName,
        submission_type: input.submissionType,
        pricing_type: input.pricingType,
        gmail: input.gmail,
        whatsapp_number: input.whatsappNumber,
        telegram_username: input.telegramUsername,
        telegram_number: input.telegramNumber,
        status: "requested",
      },
    },
  );

  return rows[0];
}

export async function createAdminRentRequest(input: {
  userId: string;
  rentConsoleId: string;
  appName: string;
  packageName: string;
  submissionType: "app" | "game";
  pricingType: "free" | "paid";
  gmail: string;
  whatsappNumber: string | null;
  telegramUsername: string | null;
  telegramNumber: string | null;
}) {
  return createRentRequest({
    userId: input.userId,
    rentConsoleId: input.rentConsoleId,
    appName: input.appName,
    packageName: input.packageName,
    submissionType: input.submissionType,
    pricingType: input.pricingType,
    gmail: input.gmail,
    whatsappNumber: input.whatsappNumber,
    telegramUsername: input.telegramUsername,
    telegramNumber: input.telegramNumber,
  });
}

export async function updateUserContactMethods(
  userId: string,
  contactMethods: {
    whatsappNumber: string | null;
    telegramUsername: string | null;
    telegramNumber: string | null;
  },
) {
  await supabaseRest("user_profiles", {
    method: "POST",
    query: {
      on_conflict: "id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      id: userId,
      whatsapp_number: contactMethods.whatsappNumber,
      telegram_username: contactMethods.telegramUsername,
      telegram_number: contactMethods.telegramNumber,
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
      telegram_username: string | null;
      telegram_number: string | null;
      is_trusted: boolean;
      is_blocked: boolean;
    }>
  >("user_profiles", {
    query: {
      select:
        "id,email,display_name,avatar_url,whatsapp_number,telegram_username,telegram_number,is_trusted,is_blocked",
      id: `eq.${userId}`,
      limit: "1",
    },
  });

  return rows[0] ?? null;
}

export { toContactMethods };

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
      app_status: data.app_status,
      admin_note: data.admin_note ?? null,
    },
  });
}
