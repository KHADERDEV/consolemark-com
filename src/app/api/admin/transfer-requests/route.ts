import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/admin/auth";
import {
  hasContactMethod,
  optionalPhoneContactSchema,
  optionalTelegramUsernameSchema,
} from "@/lib/contact-methods";
import {
  toContactMethods,
  updateUserContactMethods,
} from "@/lib/rent-requests";
import { createAdminTransferRequest } from "@/lib/transfer-requests";

const adminCreateTransferRequestSchema = z
  .object({
    user_id: z.uuid(),
    rent_console_id: z.uuid(),
    developer_account_id: z.string().trim().min(1).max(160),
    transaction_id: z.string().trim().min(1).max(160),
    app_names: z.string().trim().min(1).max(2000),
    package_names_text: z.string().trim().min(1).max(2000),
    whatsapp_number: optionalPhoneContactSchema,
    telegram_username: optionalTelegramUsernameSchema,
    telegram_number: optionalPhoneContactSchema,
  })
  .refine(hasContactMethod, {
    message: "Add at least one contact method.",
    path: ["whatsapp_number"],
  });

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const formData = await request.formData();
  const parsed = adminCreateTransferRequestSchema.safeParse({
    user_id: formData.get("user_id"),
    rent_console_id: formData.get("rent_console_id"),
    developer_account_id: formData.get("developer_account_id"),
    transaction_id: formData.get("transaction_id"),
    app_names: formData.get("app_names"),
    package_names_text: formData.get("package_names_text"),
    whatsapp_number: formData.get("whatsapp_number"),
    telegram_username: formData.get("telegram_username"),
    telegram_number: formData.get("telegram_number"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/transfer-orders?error=create", request.url),
      { status: 303 },
    );
  }

  const appNames = splitLines(parsed.data.app_names);
  const packageNames = splitLines(parsed.data.package_names_text);

  if (appNames.length !== packageNames.length) {
    return NextResponse.redirect(
      new URL("/admin/transfer-orders?error=app-package-mismatch", request.url),
      { status: 303 },
    );
  }

  const contactMethods = toContactMethods(parsed.data);

  try {
    await createAdminTransferRequest({
      userId: parsed.data.user_id,
      rentConsoleId: parsed.data.rent_console_id,
      developerAccountId: parsed.data.developer_account_id,
      transactionId: parsed.data.transaction_id,
      appNames,
      packageNames,
      ...contactMethods,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("foreign key")) {
      return NextResponse.redirect(
        new URL("/admin/transfer-orders?error=user-not-found", request.url),
        { status: 303 },
      );
    }

    throw error;
  }

  await updateUserContactMethods(parsed.data.user_id, contactMethods);
  revalidatePath("/admin/transfer-orders");
  revalidatePath("/my-transfers");

  return NextResponse.redirect(
    new URL("/admin/transfer-orders?created=1", request.url),
    { status: 303 },
  );
}
