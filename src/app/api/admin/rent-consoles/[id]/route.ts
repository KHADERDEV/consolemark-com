import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import {
  deleteRentConsole,
  parseRentConsoleForm,
  unpublishRentConsole,
  updateRentConsole,
} from "@/lib/rent-consoles";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/rent-consoles/[id]">,
) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "update");

  if (intent === "delete") {
    let deleteFallback = false;

    try {
      await deleteRentConsole(id);
    } catch {
      await unpublishRentConsole(id);
      deleteFallback = true;
    }

    revalidatePath("/rent-marketplace");
    revalidatePath("/admin/rent-marketplace");

    return NextResponse.redirect(
      new URL(
        deleteFallback
          ? "/admin/rent-marketplace?unpublished=1"
          : "/admin/rent-marketplace?deleted=1",
        request.url,
      ),
      { status: 303 },
    );
  }

  const parsed = parseRentConsoleForm(formData);

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/rent-marketplace?error=update", request.url),
      { status: 303 },
    );
  }

  await updateRentConsole(id, parsed.data);
  revalidatePath("/rent-marketplace");
  revalidatePath("/admin/rent-marketplace");

  return NextResponse.redirect(
    new URL("/admin/rent-marketplace?updated=1", request.url),
    { status: 303 },
  );
}
