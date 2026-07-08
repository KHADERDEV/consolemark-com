import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import {
  createCryptoWallet,
  cryptoWalletFormSchema,
} from "@/lib/crypto-wallets";

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login", request.url), {
      status: 303,
    });
  }

  const formData = await request.formData();
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

  await createCryptoWallet(parsed.data);
  revalidatePath("/payment");
  revalidatePath("/admin/crypto-wallets");

  return NextResponse.redirect(
    new URL("/admin/crypto-wallets?created=1", request.url),
    { status: 303 },
  );
}
