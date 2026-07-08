import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import {
  cryptoWalletFormSchema,
  deleteCryptoWallet,
  updateCryptoWallet,
} from "@/lib/crypto-wallets";

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/admin/crypto-wallets/[id]">,
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
    await deleteCryptoWallet(id);
    revalidatePath("/payment");
    revalidatePath("/admin/crypto-wallets");

    return NextResponse.redirect(
      new URL("/admin/crypto-wallets?deleted=1", request.url),
      { status: 303 },
    );
  }

  const parsed = cryptoWalletFormSchema.safeParse({
    asset_name: formData.get("asset_name"),
    network_name: formData.get("network_name"),
    wallet_address: formData.get("wallet_address"),
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order") || 0,
    is_active: formData.get("is_active") === "on",
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      new URL("/admin/crypto-wallets?error=1", request.url),
      { status: 303 },
    );
  }

  await updateCryptoWallet(id, parsed.data);
  revalidatePath("/payment");
  revalidatePath("/admin/crypto-wallets");

  return NextResponse.redirect(
    new URL("/admin/crypto-wallets?updated=1", request.url),
    { status: 303 },
  );
}
