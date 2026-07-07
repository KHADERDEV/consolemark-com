"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";

type DeleteListingButtonProps = {
  consoleId: string;
  consoleName: string;
};

export function DeleteListingButton({
  consoleId,
  consoleName,
}: DeleteListingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="font-lilita inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm text-white transition hover:bg-[#ff2780]"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 py-4">
          <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 text-center text-black shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#55d3e8] hover:text-black"
              aria-label="Close delete confirmation"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="pr-10 text-4xl leading-none">Delete listing?</p>
            <p className="mt-4 text-sm leading-6 text-black/60">
              This will remove “{consoleName}” when possible. If rent orders are
              already linked to it, the listing will be unpublished instead so
              existing order history stays intact.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="min-h-12 rounded-full border border-black/15 bg-white px-6 text-black transition hover:border-black"
              >
                Cancel
              </button>
              <form
                action={`/api/admin/rent-consoles/${consoleId}`}
                method="post"
              >
                <input type="hidden" name="intent" value="delete" />
                <button
                  type="submit"
                  className="min-h-12 w-full rounded-full bg-[#ff2780] px-6 text-white transition hover:bg-black"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
