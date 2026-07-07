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

export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL) {
    return { ok: false };
  }

  const adminUser = await getAdminUserByEmail(normalizedEmail);

  if (
    !adminUser?.is_active ||
    !verifyPassword(password, adminUser.password_salt, adminUser.password_hash)
  ) {
    return { ok: false };
  }

  const headerList = await headers();
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
      user_agent: headerList.get("user-agent"),
      ip_address: getClientIp(headerList),
      expires_at: expiresAt.toISOString(),
    },
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
