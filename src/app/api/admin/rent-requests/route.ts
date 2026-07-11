import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import {
  createAdminRentRequest,
  rentRequestFormSchema,
  toContactMethods,
  updateUserContactMethods,
} from "@/lib/rent-requests";

const adminCreateRentRequestSchema = z.intersection(
  z.object({ user_id: z.uuid() }),
  rentRequestFormSchema,
);

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const formData = await request.formData();
  const parsed = adminCreateRentRequestSchema.safeParse({
    user_id: formData.get("user_id"),
    rent_console_id: formData.get("rent_console_id"),
    app_name: formData.get("app_name"),
    package_name: formData.get("package_name"),
    submission_type: formData.get("submission_type"),
    pricing_type: formData.get("pricing_type"),
    gmail: formData.get("gmail"),
    whatsapp_number: formData.get("whatsapp_number"),
    telegram_username: formData.get("telegram_username"),
    telegram_number: formData.get("telegram_number"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/rent-orders?error=create", request.url),
      { status: 303 },
    );
  }

  const contactMethods = toContactMethods(parsed.data);

  try {
    await createAdminRentRequest({
      userId: parsed.data.user_id,
      rentConsoleId: parsed.data.rent_console_id,
      appName: parsed.data.app_name,
      packageName: parsed.data.package_name,
      submissionType: parsed.data.submission_type,
      pricingType: parsed.data.pricing_type,
      gmail: parsed.data.gmail,
      ...contactMethods,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("foreign key")) {
      return NextResponse.redirect(
        new URL("/admin/rent-orders?error=user-not-found", request.url),
        { status: 303 },
      );
    }

    if (message.includes("rent_requests_user_app_package_unique")) {
      return NextResponse.redirect(
        new URL("/admin/rent-orders?error=duplicate", request.url),
        { status: 303 },
      );
    }

    throw error;
  }

  await updateUserContactMethods(parsed.data.user_id, contactMethods);
  revalidatePath("/admin/rent-orders");
  revalidatePath("/my-rentals");

  return NextResponse.redirect(
    new URL("/admin/rent-orders?created=1", request.url),
    { status: 303 },
  );
}
