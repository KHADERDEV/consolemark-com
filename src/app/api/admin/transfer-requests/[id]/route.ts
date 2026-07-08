import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import {
  adminTransferRequestSchema,
  updateAdminTransferRequest,
} from "@/lib/transfer-requests";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/transfer-requests/[id]">,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const parsed = adminTransferRequestSchema.safeParse({
    status: formData.get("status"),
    app_status: formData.get("app_status") || null,
    admin_note: formData.get("admin_note"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/transfer-orders?error=update", request.url),
      { status: 303 },
    );
  }

  await updateAdminTransferRequest(id, parsed.data);
  revalidatePath("/admin/transfer-orders");
  revalidatePath("/my-transfers");

  return NextResponse.redirect(
    new URL("/admin/transfer-orders?updated=1", request.url),
    { status: 303 },
  );
}
