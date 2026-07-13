import Image from "next/image";

import { RentConsoleImageDialog } from "@/components/marketplace/rent-console-image-dialog";
import { RentRequestDialog } from "@/components/marketplace/rent-request-dialog";
import { TransferRequestDialog } from "@/components/marketplace/transfer-request-dialog";
import {
  formatMoney,
  getAvailabilityLabel,
  getConsoleTypeLabel,
  type RentConsole,
} from "@/lib/rent-consoles";

type RentConsoleCardProps = {
  consoleItem: RentConsole;
  isLoggedIn: boolean;
  initialWhatsappNumber?: string | null;
  initialTelegramUsername?: string | null;
  initialTelegramNumber?: string | null;
  initialDraftAccessEmail?: string | null;
  transferAppOptions?: Array<{ appName: string; packageName: string }>;
};

const availabilityClasses = {
  available_for_rent: "bg-[#02feb7] text-black",
  not_available_for_rent: "bg-[#ff2780] text-white",
  fully_rented: "bg-[#fdd52e] text-black",
};

function StatusPill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "green" | "pink" | "yellow";
}) {
  const classes = {
    green: "bg-[#02feb7] text-black",
    pink: "bg-[#ff2780] text-white",
    yellow: "bg-[#fdd52e] text-black",
  };

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs ${classes[tone]}`}
    >
      {children}
    </span>
  );
}

export function RentConsoleCard({
  consoleItem,
  isLoggedIn,
  initialWhatsappNumber,
  initialTelegramUsername,
  initialTelegramNumber,
  initialDraftAccessEmail,
  transferAppOptions = [],
}: RentConsoleCardProps) {
  const showCents = consoleItem.show_price_cents;
  const livePrice = formatMoney(consoleItem.live_price, showCents);
  const weeklyPrice = formatMoney(consoleItem.weekly_price, showCents);
  const transferPrice = formatMoney(consoleItem.transfer_apps_price, showCents);

  return (
    <article className="font-lilita group flex h-full flex-col overflow-hidden rounded-[28px] border-2 border-black/15 bg-white shadow-[0_16px_44px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-[0_24px_64px_rgba(0,0,0,0.14)]">
      <RentConsoleImageDialog
        imageUrl={consoleItem.image_url}
        name={consoleItem.name}
      />

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-lilita break-words text-3xl leading-none tracking-normal sm:text-4xl">
              {consoleItem.highlight_marker_color ? (
                <span
                  className="-mx-1 box-decoration-clone rounded-full px-1"
                  style={{
                    WebkitBoxDecorationBreak: "clone",
                    backgroundImage: `linear-gradient(to bottom, transparent 48%, ${consoleItem.highlight_marker_color} 48%, ${consoleItem.highlight_marker_color} 82%, transparent 82%)`,
                  }}
                >
                  {consoleItem.name}
                </span>
              ) : (
                consoleItem.name
              )}
            </h2>
            <p className="mt-2 text-sm text-black/55">
              {consoleItem.country_code} Console • Created{" "}
              {consoleItem.creation_year}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
              {consoleItem.country_code}
            </span>
            <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
              {getConsoleTypeLabel(consoleItem.console_type)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs ${availabilityClasses[consoleItem.availability_status]}`}
          >
            {getAvailabilityLabel(consoleItem.availability_status)}
          </span>
          <StatusPill
            tone={consoleItem.draft_access_available ? "green" : "pink"}
          >
            Draft Access{" "}
            {consoleItem.draft_access_available ? "Available" : "Not Available"}
          </StatusPill>
          <StatusPill
            tone={consoleItem.transfer_apps_available ? "green" : "pink"}
          >
            Transfer Apps{" "}
            {consoleItem.transfer_apps_available
              ? "Available"
              : "Not Available"}
          </StatusPill>
        </div>

        <div className="grid gap-4 rounded-[22px] bg-neutral-50 p-5 text-base">
          <div className="flex flex-col gap-1 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between min-[380px]:gap-3">
            <span className="text-black/55">Live Price</span>
            <strong className="text-xl leading-none text-black">
              {livePrice}
            </strong>
          </div>
          <div className="flex flex-col gap-1 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between min-[380px]:gap-3">
            <span className="text-black/55">Weekly Price</span>
            <strong className="text-xl leading-none text-black">
              {weeklyPrice}
            </strong>
          </div>
          {consoleItem.transfer_apps_available ? (
            <div className="flex flex-col gap-1 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between min-[380px]:gap-3">
              <span className="text-black/55">Transfer Apps Price</span>
              <strong className="text-xl leading-none text-black">
                {transferPrice ?? (showCents ? "$0.00" : "$0")}
              </strong>
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white">
            <Image
              src="/consolemark-logo-black.png"
              alt="Console Mark owner mark"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-black/50">Owner</p>
            <p className="break-words text-sm">{consoleItem.owner_name}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <RentRequestDialog
            rentConsoleId={consoleItem.id}
            consoleName={consoleItem.name}
            isLoggedIn={isLoggedIn}
            initialWhatsappNumber={initialWhatsappNumber}
            initialTelegramUsername={initialTelegramUsername}
            initialTelegramNumber={initialTelegramNumber}
            initialDraftAccessEmail={initialDraftAccessEmail}
          />
          <TransferRequestDialog
            rentConsoleId={consoleItem.id}
            consoleName={consoleItem.name}
            isLoggedIn={isLoggedIn}
            initialWhatsappNumber={initialWhatsappNumber}
            initialTelegramUsername={initialTelegramUsername}
            initialTelegramNumber={initialTelegramNumber}
            appOptions={transferAppOptions}
          />
          <a
            href={consoleItem.console_url}
            target="_blank"
            rel="noreferrer"
            className="font-lilita inline-flex min-h-12 items-center justify-center rounded-full bg-black px-5 text-center text-white transition hover:bg-[#55d3e8] hover:text-black"
          >
            Show Console
          </a>
        </div>
      </div>
    </article>
  );
}
