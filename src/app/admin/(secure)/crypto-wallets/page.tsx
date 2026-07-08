import Image from "next/image";

import { type CryptoWallet, getAdminCryptoWallets } from "@/lib/crypto-wallets";

export const metadata = {
  title: "Crypto Wallets | Console Mark Admin",
};

function WalletForm({ wallet }: { wallet?: CryptoWallet }) {
  const action = wallet
    ? `/api/admin/crypto-wallets/${wallet.id}`
    : "/api/admin/crypto-wallets";

  return (
    <form
      action={action}
      method="post"
      className="grid gap-3 rounded-[22px] border border-black/10 bg-white p-5"
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <input
          name="asset_name"
          required
          defaultValue={wallet?.asset_name}
          placeholder="Asset, e.g. USDT"
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        />
        <input
          name="network_name"
          required
          defaultValue={wallet?.network_name}
          placeholder="Network, e.g. TRC20 (Tron)"
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        />
      </div>
      <input
        name="wallet_address"
        required
        defaultValue={wallet?.wallet_address}
        placeholder="Wallet address"
        className="h-11 rounded-full border border-black/15 px-4 outline-none"
      />
      <input
        name="image_url"
        required
        type="url"
        defaultValue={wallet?.image_url}
        placeholder="Wallet image URL"
        className="h-11 rounded-full border border-black/15 px-4 outline-none"
      />
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <input
          name="sort_order"
          type="number"
          min="0"
          defaultValue={wallet?.sort_order ?? 0}
          placeholder="Sort order"
          className="h-11 rounded-full border border-black/15 px-4 outline-none"
        />
        <label className="flex min-h-11 items-center justify-between gap-4 rounded-full border border-black/15 px-4">
          <span className="text-sm">Active</span>
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={wallet?.is_active ?? true}
            className="h-5 w-5 accent-[#02feb7]"
          />
        </label>
      </div>
      <button
        type="submit"
        className="h-11 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
      >
        {wallet ? "Save Wallet" : "Add Wallet"}
      </button>
    </form>
  );
}

export default async function AdminCryptoWalletsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const wallets = await getAdminCryptoWallets();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-3xl sm:text-5xl">Crypto Wallets</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
        Manage the crypto wallet addresses shown on the public Payment page.
        Keep the asset, network, and address exact.
      </p>

      {params.created || params.updated || params.deleted ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm">
          Crypto wallet changes saved.
        </div>
      ) : null}

      {params.error ? (
        <div className="mt-6 rounded-full bg-[#ff2780]/10 px-5 py-3 text-sm text-[#b8004e]">
          Wallet form is missing required values or has an invalid image URL.
        </div>
      ) : null}

      <details className="mt-8 rounded-[28px] border border-black/10 bg-neutral-50 p-5">
        <summary className="cursor-pointer list-none text-2xl">
          Add Crypto Wallet
        </summary>
        <div className="mt-5">
          <WalletForm />
        </div>
      </details>

      <div className="mt-8 grid gap-5">
        {wallets.length > 0 ? (
          wallets.map((wallet) => (
            <details
              key={wallet.id}
              className="group overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50"
            >
              <summary className="grid cursor-pointer list-none gap-4 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] border border-black/10 bg-neutral-50">
                    <Image
                      src={wallet.image_url}
                      alt={`${wallet.asset_name} ${wallet.network_name}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-3xl leading-none">
                        {wallet.asset_name}
                      </p>
                      <span className="rounded-full bg-[#55d3e8]/25 px-3 py-1 text-xs">
                        {wallet.network_name}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          wallet.is_active
                            ? "bg-[#02feb7]/20 text-black"
                            : "bg-neutral-200 text-black/60"
                        }`}
                      >
                        {wallet.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-2 break-all text-sm text-black/55">
                      {wallet.wallet_address}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm">
                  Sort {wallet.sort_order}
                </span>
              </summary>
              <div className="grid gap-5 border-t border-black/10 p-5 lg:grid-cols-[1fr_180px]">
                <WalletForm wallet={wallet} />
                <form
                  action={`/api/admin/crypto-wallets/${wallet.id}`}
                  method="post"
                  className="h-fit rounded-[22px] border border-[#ff2780]/20 bg-white p-5"
                >
                  <input type="hidden" name="intent" value="delete" />
                  <p className="text-sm leading-6 text-black/60">
                    Remove this wallet from the payment page and admin list.
                  </p>
                  <button
                    type="submit"
                    className="mt-4 h-11 w-full rounded-full bg-[#ff2780] px-5 text-sm text-white transition hover:bg-black"
                  >
                    Delete Wallet
                  </button>
                </form>
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-6">
            <p className="text-sm text-black/60">
              No crypto wallets have been added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
