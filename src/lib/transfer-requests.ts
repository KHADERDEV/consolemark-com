import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";
import {
  hasContactMethod,
  optionalPhoneContactSchema,
  optionalTelegramUsernameSchema,
} from "@/lib/contact-methods";
import { type PagedResult, paginateItems } from "@/lib/pagination";
import {
  type RentRequestStatus,
  rentRequestStatuses,
} from "@/lib/rent-requests";

export const transferRequestStatuses = rentRequestStatuses;
export type TransferRequestStatus = RentRequestStatus;

export const transferAppStatuses = [
  "transfer_request_approved",
  "transfer_accepted_in_progress",
  "transferred_successfully",
] as const;

export type TransferAppStatus = (typeof transferAppStatuses)[number];

export type TransferAppOption = {
  app_name: string;
  package_name: string;
  rent_console_id: string;
  rent_consoles?: {
    name: string;
  };
};

export type TransferRequest = {
  id: string;
  request_code: string;
  user_id: string;
  rent_console_id: string;
  developer_account_id: string;
  transaction_id: string;
  app_names: string[];
  package_names: string[];
  whatsapp_number: string | null;
  telegram_username: string | null;
  telegram_number: string | null;
  status: TransferRequestStatus;
  app_status: TransferAppStatus | null;
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

export const transferRequestFormSchema = z
  .object({
    rent_console_id: z.uuid(),
    developer_account_id: z.string().trim().min(1).max(160),
    transaction_id: z.string().trim().min(1).max(160),
    package_names: z.array(z.string().trim().min(1).max(160)).min(1),
    whatsapp_number: optionalPhoneContactSchema,
    telegram_username: optionalTelegramUsernameSchema,
    telegram_number: optionalPhoneContactSchema,
  })
  .refine(hasContactMethod, {
    message: "Add at least one contact method.",
    path: ["whatsapp_number"],
  });

export const adminTransferRequestSchema = z.object({
  status: z.enum(transferRequestStatuses),
  app_status: z.enum(transferAppStatuses).optional().nullable(),
  admin_note: z.string().trim().max(2000).optional().nullable(),
});

const transferSelect =
  "id,request_code,user_id,rent_console_id,developer_account_id,transaction_id,app_names,package_names,whatsapp_number,telegram_username,telegram_number,status,app_status,admin_note,created_at,updated_at,rent_consoles(id,name,console_type,console_url,live_price,weekly_price,transfer_apps_price,show_price_cents),user_profiles(email,display_name,whatsapp_number,telegram_username,telegram_number,is_trusted,is_blocked)";

export function getTransferStatusLabel(status: TransferRequestStatus) {
  const labels: Record<TransferRequestStatus, string> = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };

  return labels[status];
}

export function getTransferAppStatusLabel(status: TransferAppStatus) {
  const labels: Record<TransferAppStatus, string> = {
    transfer_request_approved: "Transfer Request Approved",
    transfer_accepted_in_progress: "Transfer Request Accepted and in Progress",
    transferred_successfully: "Transferred Successfully",
  };

  return labels[status];
}

export function getTransferAppStatusClass(status: TransferAppStatus) {
  const classes: Record<TransferAppStatus, string> = {
    transfer_request_approved: "bg-[#fdd52e] text-black",
    transfer_accepted_in_progress: "bg-[#55d3e8] text-black",
    transferred_successfully: "bg-[#02feb7] text-black",
  };

  return classes[status];
}

export async function getUserTransferRequests(userId: string) {
  return supabaseRest<TransferRequest[]>("transfer_requests", {
    query: {
      select: transferSelect,
      user_id: `eq.${userId}`,
      order: "created_at.desc",
    },
  });
}

export async function getUserTransferRequestsPage({
  userId,
  page,
  pageSize,
}: {
  userId: string;
  page: number;
  pageSize: number;
}): Promise<PagedResult<TransferRequest>> {
  const requests = await getUserTransferRequests(userId);

  return paginateItems({ items: requests, page, pageSize });
}

type AdminTransferRequestFilters = {
  status?: string;
  userId?: string;
  query?: string;
  from?: string;
  to?: string;
};

type AdminTransferRequestPageFilters = AdminTransferRequestFilters & {
  page: number;
  pageSize: number;
};

export async function getAdminTransferRequests(
  filters: AdminTransferRequestPageFilters,
): Promise<PagedResult<TransferRequest>>;
export async function getAdminTransferRequests(
  filters: AdminTransferRequestFilters,
): Promise<TransferRequest[]>;
export async function getAdminTransferRequests(filters: {
  status?: string;
  userId?: string;
  query?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}) {
  const query: Record<string, string> = {
    select: transferSelect,
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

  const requests = await supabaseRest<TransferRequest[]>("transfer_requests", {
    query,
  });

  const filteredRequests = filters.query
    ? requests.filter((request) => {
        const search = filters.query?.trim().toLowerCase() ?? "";

        return [
          request.request_code,
          ...request.app_names,
          ...request.package_names,
        ].some((value) => value.toLowerCase().includes(search));
      })
    : requests;

  if (filters.page && filters.pageSize) {
    return paginateItems({
      items: filteredRequests,
      page: filters.page,
      pageSize: filters.pageSize,
    });
  }

  return filteredRequests;
}

export async function getTransferAppOptions(userId: string) {
  return supabaseRest<TransferAppOption[]>("rent_requests", {
    query: {
      select: "app_name,package_name,rent_console_id,rent_consoles(name)",
      user_id: `eq.${userId}`,
      status: "eq.approved",
      order: "created_at.desc",
    },
  });
}

export async function getActiveTransferRequestsForPackages(
  userId: string,
  packageNames: string[],
) {
  const requests = await supabaseRest<TransferRequest[]>("transfer_requests", {
    query: {
      select: "id,package_names,status",
      user_id: `eq.${userId}`,
      status: "in.(requested,approved)",
    },
  });

  const selected = new Set(packageNames.map((value) => value.toLowerCase()));

  return requests.filter((request) =>
    request.package_names.some((packageName) =>
      selected.has(packageName.toLowerCase()),
    ),
  );
}

export async function createTransferRequest(input: {
  userId: string;
  rentConsoleId: string;
  developerAccountId: string;
  transactionId: string;
  appNames: string[];
  packageNames: string[];
  whatsappNumber: string | null;
  telegramUsername: string | null;
  telegramNumber: string | null;
}) {
  const rows = await supabaseRest<Array<{ request_code: string }>>(
    "transfer_requests",
    {
      method: "POST",
      prefer: "return=representation",
      query: {
        select: "request_code",
      },
      body: {
        user_id: input.userId,
        rent_console_id: input.rentConsoleId,
        developer_account_id: input.developerAccountId,
        transaction_id: input.transactionId,
        app_names: input.appNames,
        package_names: input.packageNames,
        whatsapp_number: input.whatsappNumber,
        telegram_username: input.telegramUsername,
        telegram_number: input.telegramNumber,
        status: "requested",
      },
    },
  );

  return rows[0];
}

export async function createAdminTransferRequest(input: {
  userId: string;
  rentConsoleId: string;
  developerAccountId: string;
  transactionId: string;
  appNames: string[];
  packageNames: string[];
  whatsappNumber: string | null;
  telegramUsername: string | null;
  telegramNumber: string | null;
}) {
  return createTransferRequest({
    userId: input.userId,
    rentConsoleId: input.rentConsoleId,
    developerAccountId: input.developerAccountId,
    transactionId: input.transactionId,
    appNames: input.appNames,
    packageNames: input.packageNames,
    whatsappNumber: input.whatsappNumber,
    telegramUsername: input.telegramUsername,
    telegramNumber: input.telegramNumber,
  });
}

export async function cancelTransferRequest(id: string, userId: string) {
  await supabaseRest("transfer_requests", {
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

export async function updateAdminTransferRequest(
  id: string,
  data: z.infer<typeof adminTransferRequestSchema>,
) {
  await supabaseRest("transfer_requests", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
    body: {
      status: data.status,
      app_status: data.app_status ?? null,
      admin_note: data.admin_note ?? null,
    },
  });
}
