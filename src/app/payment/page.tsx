import Image from "next/image";
import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { CopyValueButton } from "@/components/ui/copy-value-button";
import { siteConfig } from "@/config/site";
import { getActiveCryptoWallets } from "@/lib/crypto-wallets";

export const metadata = {
  title: "Payment | Console Mark",
  description:
    "Use Console Mark crypto wallet addresses for marketplace payments.",
};

export default async function PaymentPage() {
  const wallets = await getActiveCryptoWallets();

  return (
    <PublicPageShell
      eyebrow="Console Mark Payment"
      title="Payment"
      description="Use the correct wallet address and network for your payment. Copy the address directly from the wallet card before sending funds."
      maxWidth="6xl"
    >
      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <article
                key={wallet.id}
                className="overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50 shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
              >
                <div className="grid gap-5 bg-white p-5 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] border border-black/10 bg-neutral-50">
                    <Image
                      src={wallet.image_url}
                      alt={`${wallet.asset_name} ${wallet.network_name}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-4xl leading-none">
                        {wallet.asset_name}
                      </h2>
                      <span className="rounded-full bg-[#55d3e8]/25 px-3 py-1 text-sm text-black">
                        {wallet.network_name}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-black/55">
                      Send only {wallet.asset_name} on {wallet.network_name}.
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-black/45">Wallet address</p>
                  <div className="mt-3 flex items-start gap-3 rounded-[22px] border border-black/10 bg-white p-4">
                    <p className="min-w-0 flex-1 break-all text-xl leading-7">
                      {wallet.wallet_address}
                    </p>
                    <CopyValueButton
                      value={wallet.wallet_address}
                      label={`${wallet.asset_name} wallet address`}
                      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-black px-4 text-sm text-white transition hover:bg-[#55d3e8] hover:text-black"
                      showText
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-6">
              <p className="text-sm text-black/60">
                No active payment wallets are available right now. Contact
                support before sending funds.
              </p>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[28px] border-2 border-black/10 bg-neutral-50 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.06)]">
          <h2 className="text-3xl leading-none">Before You Pay</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-black/60">
            <li>Match the exact asset and network shown on the wallet card.</li>
            <li>Copy the address from the card to avoid typing mistakes.</li>
            <li>Keep your transaction hash or receipt after sending funds.</li>
            <li>Include your request ID when contacting support.</li>
          </ul>
          <Link
            href={siteConfig.links.support}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
          >
            Contact Support
          </Link>
        </aside>
      </div>
    </PublicPageShell>
  );
}
