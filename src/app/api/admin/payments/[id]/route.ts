import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import {
  paymentFormSchema,
  resolvePaymentRequest,
  updatePayment,
} from "@/lib/payments";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/payments/[id]">,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const parsed = paymentFormSchema.safeParse({
    request_code: formData.get("request_code"),
    payment_type: formData.get("payment_type"),
    due_date: formData.get("due_date"),
    status: formData.get("status"),
    amount: formData.get("amount") || null,
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/payments?error=1", request.url),
      {
        status: 303,
      },
    );
  }

  const resolvedRequest = await resolvePaymentRequest(parsed.data.request_code);

  if (!resolvedRequest) {
    return NextResponse.redirect(
      new URL("/admin/payments?error=request-not-found", request.url),
      {
        status: 303,
      },
    );
  }

  await updatePayment(id, parsed.data, resolvedRequest);
  revalidatePath("/admin/payments");
  revalidatePath("/my-rentals");
  revalidatePath("/my-transfers");

  return NextResponse.redirect(
    new URL("/admin/payments?updated=1", request.url),
    {
      status: 303,
    },
  );
}
