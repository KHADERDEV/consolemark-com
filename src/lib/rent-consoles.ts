import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";
import {
  createPagedResult,
  getPaginationQuery,
  type PagedResult,
} from "@/lib/pagination";

export const availabilityOptions = [
  "available_for_rent",
  "not_available_for_rent",
  "fully_rented",
] as const;

export type AvailabilityStatus = (typeof availabilityOptions)[number];

export const consoleTypeOptions = ["personal", "organization"] as const;

export type ConsoleType = (typeof consoleTypeOptions)[number];

export type RentConsole = {
  id: string;
  name: string;
  country_code: string;
  console_type: ConsoleType;
  creation_year: number;
  availability_status: AvailabilityStatus;
  draft_access_available: boolean;
  transfer_apps_available: boolean;
  live_price: string;
  weekly_price: string;
  transfer_apps_price: string | null;
  show_price_cents: boolean;
  owner_name: string;
  console_url: string;
  image_url: string;
  highlight_marker_color: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type PublishedRentConsoleFilters = {
  availability?: AvailabilityStatus;
  consoleType?: ConsoleType;
  country?: string;
  yearFrom?: number;
  yearTo?: number;
  priceType?: "live_price" | "weekly_price" | "transfer_apps_price";
  minPrice?: number;
  maxPrice?: number;
};

export const rentConsoleFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  country_code: z
    .string()
    .trim()
    .min(2)
    .max(3)
    .transform((value) => value.toUpperCase()),
  console_type: z.enum(consoleTypeOptions),
  creation_year: z.coerce.number().int().min(2008).max(2100),
  availability_status: z.enum(availabilityOptions),
  draft_access_available: z.coerce.boolean().default(false),
  transfer_apps_available: z.coerce.boolean().default(false),
  live_price: z.coerce.number().min(0),
  weekly_price: z.coerce.number().min(0),
  transfer_apps_price: z.coerce.number().min(0).optional().nullable(),
  show_price_cents: z.coerce.boolean().default(true),
  owner_name: z.string().trim().min(1).max(120),
  console_url: z.url(),
  image_url: z.url(),
  highlight_marker_color: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || null)
    .refine(
      (value) => value === null || /^#[0-9A-Fa-f]{6}$/.test(value),
      "Use a valid hex color.",
    ),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.coerce.boolean().default(false),
});

export type RentConsoleFormData = z.infer<typeof rentConsoleFormSchema>;

const selectFields =
  "id,name,country_code,console_type,creation_year,availability_status,draft_access_available,transfer_apps_available,live_price,weekly_price,transfer_apps_price,show_price_cents,owner_name,console_url,image_url,highlight_marker_color,sort_order,is_published,created_at,updated_at";

export function formatMoney(value: string | number | null, showCents = true) {
  if (value === null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(Number(value));
}

export function getAvailabilityLabel(status: AvailabilityStatus) {
  const labels: Record<AvailabilityStatus, string> = {
    available_for_rent: "Available for Rent",
    not_available_for_rent: "Not Available for Rent",
    fully_rented: "Fully Rented",
  };

  return labels[status];
}

export function getConsoleTypeLabel(type: ConsoleType) {
  const labels: Record<ConsoleType, string> = {
    personal: "Personal",
    organization: "Organization",
  };

  return labels[type];
}

export async function getPublishedRentConsoles() {
  return supabaseRest<RentConsole[]>("rent_consoles", {
    query: {
      select: selectFields,
      is_published: "eq.true",
      order: "sort_order.asc,created_at.desc",
    },
  });
}

export async function getPublishedRentConsolesPage({
  page,
  pageSize,
  filters = {},
}: {
  page: number;
  pageSize: number;
  filters?: PublishedRentConsoleFilters;
}) {
  const query: Record<string, string> = {
    select: selectFields,
    is_published: "eq.true",
    order: "sort_order.asc,created_at.desc",
    ...getPaginationQuery({ page, pageSize }),
  };
  const andConditions: string[] = [];

  if (filters.availability) {
    query.availability_status = `eq.${filters.availability}`;
  }

  if (filters.consoleType) {
    query.console_type = `eq.${filters.consoleType}`;
  }

  if (filters.country) {
    query.country_code = `eq.${filters.country}`;
  }

  if (typeof filters.yearFrom === "number") {
    andConditions.push(`creation_year.gte.${filters.yearFrom}`);
  }

  if (typeof filters.yearTo === "number") {
    andConditions.push(`creation_year.lte.${filters.yearTo}`);
  }

  if (typeof filters.minPrice === "number" && filters.priceType) {
    andConditions.push(`${filters.priceType}.gte.${filters.minPrice}`);
  }

  if (typeof filters.maxPrice === "number" && filters.priceType) {
    andConditions.push(`${filters.priceType}.lte.${filters.maxPrice}`);
  }

  if (andConditions.length > 0) {
    query.and = `(${andConditions.join(",")})`;
  }

  const rows = await supabaseRest<RentConsole[]>("rent_consoles", {
    query,
  });

  const result = createPagedResult({ rows, page, pageSize });

  return {
    consoles: result.items,
    hasNextPage: result.hasNextPage,
    hasPreviousPage: result.hasPreviousPage,
    page: result.page,
  };
}

export async function getPublishedRentConsoleFilterOptions() {
  return supabaseRest<Array<{ country_code: string; creation_year: number }>>(
    "rent_consoles",
    {
      query: {
        select: "country_code,creation_year",
        is_published: "eq.true",
        order: "country_code.asc,creation_year.desc",
      },
    },
  );
}

export async function getAllRentConsoles() {
  return supabaseRest<RentConsole[]>("rent_consoles", {
    query: {
      select: selectFields,
      order: "sort_order.asc,created_at.desc",
    },
  });
}

export async function getAllRentConsolesPage({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<PagedResult<RentConsole>> {
  const rows = await supabaseRest<RentConsole[]>("rent_consoles", {
    query: {
      select: selectFields,
      order: "sort_order.asc,created_at.desc",
      ...getPaginationQuery({ page, pageSize }),
    },
  });

  return createPagedResult({ rows, page, pageSize });
}

export async function createRentConsole(data: RentConsoleFormData) {
  await supabaseRest("rent_consoles", {
    method: "POST",
    prefer: "return=minimal",
    body: serializeRentConsole(data),
  });
}

export async function updateRentConsole(id: string, data: RentConsoleFormData) {
  await supabaseRest("rent_consoles", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
    body: serializeRentConsole(data),
  });
}

export async function deleteRentConsole(id: string) {
  await supabaseRest("rent_consoles", {
    method: "DELETE",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
  });
}

export async function unpublishRentConsole(id: string) {
  await supabaseRest("rent_consoles", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
    body: {
      is_published: false,
    },
  });
}

export function parseRentConsoleForm(formData: FormData) {
  return rentConsoleFormSchema.safeParse({
    name: formData.get("name"),
    country_code: formData.get("country_code"),
    console_type: formData.get("console_type") || "personal",
    creation_year: formData.get("creation_year"),
    availability_status: formData.get("availability_status"),
    draft_access_available: formData.has("draft_access_available"),
    transfer_apps_available: formData.has("transfer_apps_available"),
    live_price: formData.get("live_price"),
    weekly_price: formData.get("weekly_price"),
    transfer_apps_price: formData.get("transfer_apps_price") || null,
    show_price_cents: formData.has("show_price_cents"),
    owner_name: formData.get("owner_name"),
    console_url: formData.get("console_url"),
    image_url: formData.get("image_url"),
    highlight_marker_color: formData.get("highlight_marker_color"),
    sort_order: formData.get("sort_order") || 0,
    is_published: formData.has("is_published"),
  });
}

function serializeRentConsole(data: RentConsoleFormData) {
  return {
    name: data.name,
    country_code: data.country_code,
    console_type: data.console_type,
    creation_year: data.creation_year,
    availability_status: data.availability_status,
    draft_access_available: data.draft_access_available,
    transfer_apps_available: data.transfer_apps_available,
    live_price: data.live_price,
    weekly_price: data.weekly_price,
    transfer_apps_price: data.transfer_apps_available
      ? (data.transfer_apps_price ?? 0)
      : null,
    show_price_cents: data.show_price_cents,
    owner_name: data.owner_name,
    console_url: data.console_url,
    image_url: data.image_url,
    highlight_marker_color: data.highlight_marker_color,
    sort_order: data.sort_order,
    is_published: data.is_published,
  };
}
