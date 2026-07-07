import "server-only";

export const ADMIN_EMAIL = "khader@consolemark.com";
export const ADMIN_SESSION_COOKIE = "consolemark_admin_session";
export const ADMIN_SESSION_DAYS = 7;

export function getAdminHost() {
  return process.env.ADMIN_PRIMARY_HOST ?? "admin.consolemark.com";
}

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return { url, serviceRoleKey };
}
