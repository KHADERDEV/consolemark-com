"use client";

import { LogOut, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

type AdminAccountCardProps = {
  email: string;
};

export function AdminAccountCard({ email }: AdminAccountCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const initials = email.slice(0, 1).toUpperCase();

  return (
    <>
      <div className="mt-8 rounded-[24px] border border-black/10 bg-white p-4 shadow-sm lg:mt-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-xl text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-black/45">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Admin profile</span>
            </div>
            <p className="mt-1 truncate text-sm text-black">{email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm text-white transition hover:bg-[#ff2780]"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      {isConfirmOpen
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 py-4">
              <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 text-center text-black shadow-2xl">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#55d3e8] hover:text-black"
                  aria-label="Close sign out confirmation"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
                <p className="pr-10 text-4xl leading-none">Sign out?</p>
                <p className="mt-4 text-sm leading-6 text-black/60">
                  Are you sure you want to sign out of the Console Mark admin
                  panel?
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmOpen(false)}
                    className="min-h-12 rounded-full border border-black/15 bg-white px-6 text-black transition hover:border-black"
                  >
                    Cancel
                  </button>
                  <form action="/api/admin/logout" method="post">
                    <button
                      type="submit"
                      className="min-h-12 w-full rounded-full bg-[#ff2780] px-6 text-white transition hover:bg-black"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
