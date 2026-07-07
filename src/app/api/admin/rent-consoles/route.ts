import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { createRentConsole, parseRentConsoleForm } from "@/lib/rent-consoles";

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const formData = await request.formData();
  const parsed = parseRentConsoleForm(formData);

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/rent-marketplace?error=create", request.url),
      { status: 303 },
    );
  }

  await createRentConsole(parsed.data);
  revalidatePath("/rent-marketplace");
  revalidatePath("/admin/rent-marketplace");

  return NextResponse.redirect(
    new URL("/admin/rent-marketplace?created=1", request.url),
    { status: 303 },
  );
}
