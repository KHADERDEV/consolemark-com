import { type NextRequest, NextResponse } from "next/server";

import { logoutAdmin } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  await logoutAdmin();
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
