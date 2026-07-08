import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";

export type CryptoWallet = {
  id: string;
  asset_name: string;
  network_name: string;
  wallet_address: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const cryptoWalletFormSchema = z.object({
  asset_name: z.string().trim().min(1).max(80),
  network_name: z.string().trim().min(1).max(120),
  wallet_address: z.string().trim().min(8).max(240),
  image_url: z.url().max(500),
  sort_order: z.coerce.number().int().min(0).max(10_000).default(0),
  is_active: z.boolean(),
});

const walletSelect =
  "id,asset_name,network_name,wallet_address,image_url,sort_order,is_active,created_at,updated_at";

export async function getActiveCryptoWallets() {
  return supabaseRest<CryptoWallet[]>("crypto_wallets", {
    query: {
      select: walletSelect,
      is_active: "eq.true",
      order: "sort_order.asc,created_at.asc",
    },
  });
}

export async function getAdminCryptoWallets() {
  return supabaseRest<CryptoWallet[]>("crypto_wallets", {
    query: {
      select: walletSelect,
      order: "sort_order.asc,created_at.asc",
    },
  });
}

export async function createCryptoWallet(
  data: z.infer<typeof cryptoWalletFormSchema>,
) {
  await supabaseRest("crypto_wallets", {
    method: "POST",
    prefer: "return=minimal",
    body: data,
  });
}

export async function updateCryptoWallet(
  id: string,
  data: z.infer<typeof cryptoWalletFormSchema>,
) {
  await supabaseRest("crypto_wallets", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
    body: data,
  });
}

export async function deleteCryptoWallet(id: string) {
  await supabaseRest("crypto_wallets", {
    method: "DELETE",
    query: {
      id: `eq.${id}`,
    },
    prefer: "return=minimal",
  });
}
