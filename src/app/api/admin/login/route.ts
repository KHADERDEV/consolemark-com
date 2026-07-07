import { type NextRequest, NextResponse } from "next/server";

import { loginAdmin } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginAdmin(email, password);

  if (!result.ok) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), {
      status: 303,
    });
  }

  return NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
}
