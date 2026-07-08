import { NextResponse } from "next/server";

import { sendRentRequestEmail } from "@/lib/email/resend";
import { getPublishedRentConsoles } from "@/lib/rent-consoles";
import {
  createRentRequest,
  getUserProfile,
  rentRequestFormSchema,
  updateUserWhatsapp,
} from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";

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
  const parsed = rentRequestFormSchema.safeParse({
    rent_console_id: formData.get("rent_console_id"),
    app_name: formData.get("app_name"),
    package_name: formData.get("package_name"),
    submission_type: formData.get("submission_type"),
    pricing_type: formData.get("pricing_type"),
    gmail: formData.get("gmail"),
    whatsapp_number: formData.get("whatsapp_number"),
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
          "Your developer account is blocked from submitting new rent requests. Contact support if you believe this is a mistake.",
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

  let rentRequest: { request_code: string };

  try {
    rentRequest = await createRentRequest({
      userId: user.id,
      rentConsoleId: parsed.data.rent_console_id,
      appName: parsed.data.app_name,
      packageName: parsed.data.package_name,
      submissionType: parsed.data.submission_type,
      pricingType: parsed.data.pricing_type,
      gmail: parsed.data.gmail,
      whatsappNumber: parsed.data.whatsapp_number,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message.includes("rent_requests_user_app_package_unique")) {
      return NextResponse.json(
        {
          error:
            "You have already submitted a request for this app name and package name.",
        },
        { status: 409 },
      );
    }

    throw error;
  }

  await updateUserWhatsapp(user.id, parsed.data.whatsapp_number);

  await sendRentRequestEmail({
    requestCode: rentRequest.request_code,
    appName: parsed.data.app_name,
    packageName: parsed.data.package_name,
    submissionType: parsed.data.submission_type,
    pricingType: parsed.data.pricing_type,
    gmail: parsed.data.gmail,
    whatsappNumber: parsed.data.whatsapp_number,
    userEmail: profile?.email ?? user.email ?? undefined,
    consoleName: consoleItem.name,
    consoleUrl: consoleItem.console_url,
    rentConsoleId: consoleItem.id,
  });

  return NextResponse.json({ ok: true });
}
