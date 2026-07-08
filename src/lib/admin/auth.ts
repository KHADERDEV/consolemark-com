import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import {
  ADMIN_EMAIL,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DAYS,
} from "@/lib/admin/config";
import {
  createSessionToken,
  hashSessionToken,
  verifyPassword,
} from "@/lib/admin/crypto";
import { supabaseRest } from "@/lib/admin/supabase-rest";

type AdminUser = {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  is_active: boolean;
};

type AdminSession = {
  id: string;
  admin_user_id: string;
  admin_users: {
    id: string;
    email: string;
    is_active: boolean;
  };
};

export type AdminSessionUser = {
  id: string;
  email: string;
};

const ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES = 10;

function getClientIp(headerList: Headers) {
  const forwardedFor = headerList.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return firstForwardedIp || headerList.get("x-real-ip") || null;
}

async function getAdminUserByEmail(email: string) {
  const rows = await supabaseRest<AdminUser[]>("admin_users", {
    query: {
      select: "id,email,password_hash,password_salt,is_active",
      email: `eq.${email}`,
      limit: "1",
    },
  });

  return rows[0] ?? null;
}

async function getRecentFailedLoginCount(
  email: string,
  ipAddress: string | null,
) {
  const since = new Date(
    Date.now() - ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
  ).toISOString();
  const query: Record<string, string> = {
    select: "id",
    event_type: "eq.admin_login_failed",
    created_at: `gt.${since}`,
    limit: String(ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES),
  };

  if (ipAddress) {
    query.ip_address = `eq.${ipAddress}`;
  } else {
    query["metadata->>email"] = `eq.${email}`;
  }

  const rows = await supabaseRest<Array<{ id: string }>>("admin_audit_events", {
    query,
  });

  return rows.length;
}

async function recordAdminAuditEvent(input: {
  adminUserId?: string | null;
  eventType: "admin_login_failed" | "admin_login_success";
  email: string;
  ipAddress: string | null;
  userAgent: string | null;
  reason?: string;
}) {
  await supabaseRest("admin_audit_events", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      admin_user_id: input.adminUserId ?? null,
      event_type: input.eventType,
      ip_address: input.ipAddress,
      user_agent: input.userAgent,
      metadata: {
        email: input.email,
        ...(input.reason ? { reason: input.reason } : {}),
      },
    },
  });
}

export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const headerList = await headers();
  const ipAddress = getClientIp(headerList);
  const userAgent = headerList.get("user-agent");

  if (
    (await getRecentFailedLoginCount(normalizedEmail, ipAddress)) >=
    ADMIN_LOGIN_RATE_LIMIT_MAX_FAILURES
  ) {
    await recordAdminAuditEvent({
      eventType: "admin_login_failed",
      email: normalizedEmail,
      ipAddress,
      userAgent,
      reason: "rate_limited",
    });

    return { ok: false };
  }

  if (normalizedEmail !== ADMIN_EMAIL) {
    await recordAdminAuditEvent({
      eventType: "admin_login_failed",
      email: normalizedEmail,
      ipAddress,
      userAgent,
      reason: "wrong_email",
    });

    return { ok: false };
  }

  const adminUser = await getAdminUserByEmail(normalizedEmail);

  if (
    !adminUser?.is_active ||
    !verifyPassword(password, adminUser.password_salt, adminUser.password_hash)
  ) {
    await recordAdminAuditEvent({
      adminUserId: adminUser?.id,
      eventType: "admin_login_failed",
      email: normalizedEmail,
      ipAddress,
      userAgent,
      reason: adminUser?.is_active ? "bad_password" : "inactive_or_missing",
    });

    return { ok: false };
  }

  const sessionToken = createSessionToken();
  const tokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(
    Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000,
  );

  await supabaseRest("admin_sessions", {
    method: "POST",
    prefer: "return=minimal",
    body: {
      admin_user_id: adminUser.id,
      token_hash: tokenHash,
      user_agent: userAgent,
      ip_address: ipAddress,
      expires_at: expiresAt.toISOString(),
    },
  });

  await recordAdminAuditEvent({
    adminUserId: adminUser.id,
    eventType: "admin_login_success",
    email: normalizedEmail,
    ipAddress,
    userAgent,
  });

  await supabaseRest("admin_users", {
    method: "PATCH",
    query: {
      id: `eq.${adminUser.id}`,
    },
    prefer: "return=minimal",
    body: {
      last_login_at: new Date().toISOString(),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiresAt,
  });

  return { ok: true };
}

export const getAdminSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const rows = await supabaseRest<AdminSession[]>("admin_sessions", {
    query: {
      select: "id,admin_user_id,admin_users(id,email,is_active)",
      token_hash: `eq.${hashSessionToken(token)}`,
      revoked_at: "is.null",
      expires_at: `gt.${new Date().toISOString()}`,
      limit: "1",
    },
  });

  const session = rows[0];

  if (
    !session?.admin_users?.is_active ||
    session.admin_users.email !== ADMIN_EMAIL
  ) {
    return null;
  }

  return {
    id: session.admin_users.id,
    email: session.admin_users.email,
  } satisfies AdminSessionUser;
});

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (token) {
    await supabaseRest("admin_sessions", {
      method: "PATCH",
      query: {
        token_hash: `eq.${hashSessionToken(token)}`,
        revoked_at: "is.null",
      },
      prefer: "return=minimal",
      body: {
        revoked_at: new Date().toISOString(),
      },
    });
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
