import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/users/[id]/reset-password">,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const { id } = await context.params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.getUserById(id);

  if (error || !data.user.email) {
    return NextResponse.redirect(
      new URL("/admin/users?error=reset", request.url),
      {
        status: 303,
      },
    );
  }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    data.user.email,
    {
      redirectTo: `${new URL(request.url).origin}/auth/callback?next=/auth/update-password`,
    },
  );

  if (resetError) {
    return NextResponse.redirect(
      new URL("/admin/users?error=reset", request.url),
      {
        status: 303,
      },
    );
  }

  return NextResponse.redirect(new URL("/admin/users?reset=1", request.url), {
    status: 303,
  });
}
