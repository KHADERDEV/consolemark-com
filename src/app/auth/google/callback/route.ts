import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getSafeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const credential = formData.get("credential");
  const csrfToken = formData.get("g_csrf_token");
  const csrfCookie = request.cookies.get("g_csrf_token")?.value;
  const state = formData.get("state");
  const next = getSafeNext(typeof state === "string" ? state : null);

  if (
    !credential ||
    typeof credential !== "string" ||
    !csrfToken ||
    typeof csrfToken !== "string" ||
    csrfToken !== csrfCookie
  ) {
    console.error(
      "Google redirect login failed: missing credential or CSRF mismatch.",
    );
    return redirectTo(request, "/auth/login?error=google");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: credential,
  });

  if (error) {
    console.error("Supabase Google ID-token login failed:", error);
    return redirectTo(request, "/auth/login?error=google");
  }

  return redirectTo(request, next);
}
