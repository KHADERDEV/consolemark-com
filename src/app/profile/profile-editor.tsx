"use client";

import { Check, UserCircle, X } from "lucide-react";
import { useState } from "react";

import { TrustedDeveloperBadge } from "@/components/users/trusted-developer-badge";

type ProfileEditorProps = {
  email?: string | null;
  initialDisplayName: string;
  initialWhatsappNumber?: string | null;
  initialTelegramUsername?: string | null;
  initialTelegramNumber?: string | null;
  avatarUrl?: string | null;
  isTrusted: boolean;
  isBlocked: boolean;
};

type DialogState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function ProfileEditor({
  email,
  initialDisplayName,
  initialWhatsappNumber,
  initialTelegramUsername,
  initialTelegramNumber,
  avatarUrl,
  isTrusted,
  isBlocked,
}: ProfileEditorProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialWhatsappNumber ?? "",
  );
  const [telegramUsername, setTelegramUsername] = useState(
    initialTelegramUsername ?? "",
  );
  const [telegramNumber, setTelegramNumber] = useState(
    initialTelegramNumber ?? "",
  );
  const [isPending, setIsPending] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    const response = await fetch("/api/profile", {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const payload = (await response.json()) as {
      error?: string;
      profile?: {
        display_name?: string;
        whatsapp_number?: string | null;
        telegram_username?: string | null;
        telegram_number?: string | null;
      };
    };

    setIsPending(false);

    if (!response.ok) {
      setDialog({
        type: "error",
        message: payload.error ?? "Profile update failed. Please try again.",
      });
      return;
    }

    setDisplayName(payload.profile?.display_name ?? displayName);
    setWhatsappNumber(payload.profile?.whatsapp_number ?? "");
    setTelegramUsername(payload.profile?.telegram_username ?? "");
    setTelegramNumber(payload.profile?.telegram_number ?? "");
    setDialog({
      type: "success",
      message: "Your profile has been updated successfully.",
    });
  }

  return (
    <>
      <form
        onSubmit={updateProfile}
        className="mt-8 overflow-hidden rounded-[28px] border border-black/10 bg-neutral-50"
      >
        <div className="grid gap-6 border-b border-black/10 bg-white p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-neutral-50">
            {avatarUrl ? (
              // biome-ignore lint/performance/noImgElement: Google profile photo URLs are external user content and should bypass Next image domain validation.
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <UserCircle className="h-16 w-16 text-black/35" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-4xl leading-none">{displayName}</p>
              {isTrusted ? <TrustedDeveloperBadge /> : null}
            </div>
            <p className="mt-2 truncate text-sm text-black/55">{email}</p>
            {isBlocked ? (
              <p className="mt-3 rounded-full bg-[#ff2780]/15 px-4 py-2 text-sm text-[#b8004e]">
                Your account is currently blocked from submitting new rent or
                transfer requests.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 p-6">
          <label className="grid gap-2">
            <span className="text-sm text-black/55">Profile name</span>
            <input
              name="display_name"
              required
              maxLength={80}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
              placeholder="Your name"
            />
          </label>

          <section className="grid gap-4 rounded-[24px] border border-black/10 bg-white p-5">
            <div className="grid gap-1">
              <p className="text-xl leading-none">Contact methods</p>
              <p className="text-sm leading-5 text-black/50">
                Save the contact details you want us to use for rent and
                transfer requests.
              </p>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">WhatsApp number</span>
              <input
                name="whatsapp_number"
                value={whatsappNumber}
                onChange={(event) => setWhatsappNumber(event.target.value)}
                pattern="^\+[1-9]\d{7,18}$"
                className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
                placeholder="+32465272955"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Telegram username</span>
              <input
                name="telegram_username"
                value={telegramUsername}
                onChange={(event) => setTelegramUsername(event.target.value)}
                className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
                placeholder="@ConsoleMark_com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-black/55">Telegram number</span>
              <input
                name="telegram_number"
                value={telegramNumber}
                onChange={(event) => setTelegramNumber(event.target.value)}
                pattern="^\+[1-9]\d{7,18}$"
                className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
                placeholder="+32465272955"
              />
            </label>

            <p className="text-xs leading-5 text-black/45">
              Phone numbers must include the country code. Telegram username can
              include or omit the @ symbol.
            </p>
          </section>

          <button
            type="submit"
            disabled={isPending}
            className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60 sm:w-fit"
          >
            {isPending ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>

      {dialog ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 py-4">
          <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 text-center text-black shadow-2xl">
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#55d3e8] hover:text-black"
              aria-label="Close message"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <span
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                dialog.type === "success"
                  ? "bg-[#02feb7] text-black"
                  : "bg-[#ff2780] text-white"
              }`}
            >
              <Check className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 pr-8 text-4xl leading-none">
              {dialog.type === "success" ? "Profile Updated" : "Update Failed"}
            </p>
            <p className="mt-4 text-sm leading-6 text-black/60">
              {dialog.message}
            </p>
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="mt-6 min-h-12 w-full rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
            >
              Great
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
