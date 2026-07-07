import "server-only";

import { getSupabaseConfig } from "@/lib/admin/config";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string>;
  body?: Record<string, JsonValue>;
  prefer?: string;
};

export async function supabaseRest<T>(
  table: string,
  { method = "GET", query, body, prefer }: RequestOptions = {},
) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const endpoint = new URL(`/rest/v1/${table}`, url);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      endpoint.searchParams.set(key, value);
    }
  }

  const response = await fetch(endpoint, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  const text = await response.text();

  if (!text) {
    return null as T;
  }

  return JSON.parse(text) as T;
}
