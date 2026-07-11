import { NextResponse } from "next/server";

import { sendTransferRequestEmail } from "@/lib/email/resend";
import { getPublishedRentConsoles } from "@/lib/rent-consoles";
import {
  getUserProfile,
  toContactMethods,
  updateUserContactMethods,
} from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";
import {
  createTransferRequest,
  getActiveTransferRequestsForPackages,
  getTransferAppOptions,
  transferRequestFormSchema,
} from "@/lib/transfer-requests";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const parsed = transferRequestFormSchema.safeParse({
    rent_console_id: formData.get("rent_console_id"),
    developer_account_id: formData.get("developer_account_id"),
    transaction_id: formData.get("transaction_id"),
    package_names: formData.getAll("package_names"),
    whatsapp_number: formData.get("whatsapp_number"),
    telegram_username: formData.get("telegram_username"),
    telegram_number: formData.get("telegram_number"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const profile = await getUserProfile(user.id);

  if (profile?.is_blocked) {
    return NextResponse.json(
      {
        error:
          "Your developer account is blocked from submitting new transfer requests. Contact support if you believe this is a mistake.",
      },
      { status: 403 },
    );
  }

  const consoles = await getPublishedRentConsoles();
  const consoleItem = consoles.find(
    (item) => item.id === parsed.data.rent_console_id,
  );

  if (!consoleItem) {
    return NextResponse.json(
      { error: "Console listing not found." },
      { status: 404 },
    );
  }

  const userApps = await getTransferAppOptions(user.id);
  const allowedPackages = new Set(
    userApps
      .filter((app) => app.rent_console_id === parsed.data.rent_console_id)
      .map((app) => app.package_name),
  );
  const selectedPackages = Array.from(new Set(parsed.data.package_names));
  const appNameByPackage = new Map(
    userApps.map((app) => [app.package_name, app.app_name]),
  );
  const selectedAppNames = selectedPackages.map(
    (packageName) => appNameByPackage.get(packageName) ?? packageName,
  );
  const hasInvalidPackage = selectedPackages.some(
    (packageName) => !allowedPackages.has(packageName),
  );

  if (hasInvalidPackage) {
    return NextResponse.json(
      { error: "Select an app rented from this console." },
      { status: 400 },
    );
  }

  const duplicateRequests = await getActiveTransferRequestsForPackages(
    user.id,
    selectedPackages,
  );

  if (duplicateRequests.length > 0) {
    return NextResponse.json(
      {
        error:
          "You already have an active transfer request for one of the selected apps.",
      },
      { status: 409 },
    );
  }

  const contactMethods = toContactMethods(parsed.data);
  const transferRequest = await createTransferRequest({
    userId: user.id,
    rentConsoleId: parsed.data.rent_console_id,
    developerAccountId: parsed.data.developer_account_id,
    transactionId: parsed.data.transaction_id,
    appNames: selectedAppNames,
    packageNames: selectedPackages,
    ...contactMethods,
  });

  await updateUserContactMethods(user.id, contactMethods);

  await sendTransferRequestEmail({
    requestCode: transferRequest.request_code,
    developerAccountId: parsed.data.developer_account_id,
    transactionId: parsed.data.transaction_id,
    appNames: selectedAppNames,
    packageNames: selectedPackages,
    ...contactMethods,
    userEmail: profile?.email ?? user.email ?? undefined,
    consoleName: consoleItem.name,
    consoleUrl: consoleItem.console_url,
    rentConsoleId: consoleItem.id,
  });

  return NextResponse.json({ ok: true });
}
