import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import {
  adminRentRequestSchema,
  updateAdminRentRequest,
} from "@/lib/rent-requests";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/rent-requests/[id]">,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const formData = await request.formData();
  const parsed = adminRentRequestSchema.safeParse({
    status: formData.get("status"),
    app_status: formData.get("app_status"),
    admin_note: formData.get("admin_note"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/rent-orders?error=update", request.url),
      { status: 303 },
    );
  }

  const { id } = await context.params;
  await updateAdminRentRequest(id, parsed.data);
  revalidatePath("/admin/rent-orders");
  revalidatePath("/my-rentals");

  return NextResponse.redirect(
    new URL("/admin/rent-orders?updated=1", request.url),
    { status: 303 },
  );
}
