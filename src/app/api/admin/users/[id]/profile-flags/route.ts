import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { supabaseRest } from "@/lib/admin/supabase-rest";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/users/[id]/profile-flags">,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const isTrusted = formData.get("is_trusted") === "on";
  const isBlocked = formData.get("is_blocked") === "on";
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.getUserById(id);

  if (error || !data.user) {
    return NextResponse.redirect(
      new URL("/admin/users?error=profile-flags", request.url),
      { status: 303 },
    );
  }

  await supabaseRest("user_profiles", {
    method: "POST",
    query: {
      on_conflict: "id",
    },
    prefer: "resolution=merge-duplicates,return=minimal",
    body: {
      id,
      email: data.user.email ?? null,
      is_trusted: isTrusted,
      is_blocked: isBlocked,
    },
  });

  return NextResponse.redirect(new URL("/admin/users?updated=1", request.url), {
    status: 303,
  });
}
