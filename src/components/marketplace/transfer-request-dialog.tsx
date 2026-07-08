"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type TransferAppOption = {
  appName: string;
  packageName: string;
};

type TransferRequestDialogProps = {
  rentConsoleId: string;
  consoleName: string;
  isLoggedIn: boolean;
  initialWhatsappNumber?: string | null;
  appOptions: TransferAppOption[];
};

type SubmissionState = "idle" | "pending" | "success" | "error";

const fieldClassName =
  "h-12 rounded-full border border-black/15 px-5 outline-none transition focus:border-black";

export function TransferRequestDialog({
  rentConsoleId,
  consoleName,
  isLoggedIn,
  initialWhatsappNumber,
  appOptions,
}: TransferRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const selectedLabel = useMemo(() => {
    if (selectedPackages.length === 0) {
      return "Select apps";
    }

    return `${selectedPackages.length} app${
      selectedPackages.length === 1 ? "" : "s"
    } selected`;
  }, [selectedPackages]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen && !isSuccessOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, isSuccessOpen]);

  function openDialog() {
    if (!isLoggedIn) {
      window.location.href = `/auth/login?next=${encodeURIComponent("/rent-marketplace")}`;
      return;
    }

    setIsOpen(true);
    setIsSuccessOpen(false);
    setState("idle");
    setMessage("");
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (selectedPackages.length === 0) {
      setState("error");
      setMessage("Select at least one app to transfer.");
      return;
    }

    setState("pending");
    setMessage("");

    const response = await fetch("/api/transfer-requests", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Transfer request failed. Please try again.");
      return;
    }

    form.reset();
    setSelectedPackages([]);
    setState("success");
    setMessage("");
    setIsOpen(false);
    setIsSuccessOpen(true);
  }

  const dialog =
    isOpen && isMounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-hidden bg-black/70 px-4 pt-4 pb-4 sm:items-center">
            <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-white text-black shadow-2xl">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#55d3e8] hover:text-black"
                aria-label="Close transfer request form"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="shrink-0 border-b border-black/10 px-6 pt-6 pb-4">
                <p className="pr-12 text-4xl leading-none">Transfer details</p>
                <p className="mt-2 text-sm text-black/60">{consoleName}</p>
              </div>

              <form
                onSubmit={submitRequest}
                className="flex min-h-0 flex-1 flex-col"
              >
                <input
                  type="hidden"
                  name="rent_console_id"
                  value={rentConsoleId}
                />

                <div className="grid min-h-0 flex-1 gap-5 overscroll-contain overflow-y-auto bg-neutral-50 px-6 py-5">
                  <section className="grid gap-5 rounded-[22px] bg-white p-5">
                    <FieldLabel
                      title="New developer account"
                      description="The developer account the apps will be transferred to"
                    >
                      <input
                        name="developer_account_id"
                        required
                        className={fieldClassName}
                        placeholder="Developer Account ID"
                      />
                    </FieldLabel>

                    <FieldLabel title="New account transaction ID or verification code">
                      <input
                        name="transaction_id"
                        required
                        className={fieldClassName}
                        placeholder="PDS.xxxx-xxxx-xxxx-xxxxx"
                      />
                    </FieldLabel>
                  </section>

                  <section className="grid gap-5 rounded-[22px] bg-white p-5">
                    <div className="grid gap-3">
                      <span className="grid gap-1.5">
                        <span className="text-base leading-none">
                          App(s) to transfer
                        </span>
                        <span className="text-sm leading-5 text-black/50">
                          Select the apps you want to transfer
                        </span>
                      </span>
                      {appOptions.length > 0 ? (
                        <details className="group relative">
                          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-full border border-black/15 bg-white px-5">
                            <span>{selectedLabel}</span>
                            <ChevronDown
                              className="h-4 w-4 transition group-open:rotate-180"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="mt-2 grid max-h-56 gap-2 overflow-y-auto rounded-[22px] border border-black/10 bg-white p-3 shadow-xl">
                            {appOptions.map((app) => (
                              <label
                                key={app.packageName}
                                className="flex cursor-pointer items-start gap-3 rounded-[16px] px-3 py-2 transition hover:bg-neutral-50"
                              >
                                <input
                                  type="checkbox"
                                  name="package_names"
                                  value={app.packageName}
                                  className="mt-1 h-4 w-4 accent-black"
                                  onChange={(event) => {
                                    setSelectedPackages((current) =>
                                      event.target.checked
                                        ? [...current, app.packageName]
                                        : current.filter(
                                            (value) =>
                                              value !== app.packageName,
                                          ),
                                    );
                                  }}
                                />
                                <span className="grid gap-1">
                                  <span>{app.appName}</span>
                                  <span className="break-all text-xs text-black/50">
                                    {app.packageName}
                                  </span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <div className="rounded-[20px] bg-neutral-50 p-4 text-sm leading-6 text-black/60">
                          No approved rented apps are available for transfer
                          from this console yet.
                        </div>
                      )}
                    </div>

                    <FieldLabel
                      title="WhatsApp number"
                      description="In order to contact you"
                    >
                      <input
                        name="whatsapp_number"
                        required
                        pattern="^\+[1-9]\d{7,18}$"
                        defaultValue={initialWhatsappNumber ?? ""}
                        className={fieldClassName}
                        placeholder="+447520603830"
                      />
                    </FieldLabel>
                  </section>

                  {message ? (
                    <p
                      className={`rounded-[20px] px-4 py-3 text-sm ${
                        state === "success"
                          ? "bg-[#02feb7]/20 text-black"
                          : "bg-[#ff2780]/10 text-[#b8004e]"
                      }`}
                    >
                      {message}
                    </p>
                  ) : null}
                </div>

                <div className="grid shrink-0 gap-3 border-t border-black/10 px-6 py-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="min-h-12 rounded-full border border-black/15 bg-white px-6 text-black transition hover:border-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state === "pending" || appOptions.length === 0}
                    className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60"
                  >
                    {state === "pending"
                      ? "Submitting..."
                      : "Submit Transfer Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )
      : null;

  const successDialog =
    isSuccessOpen && isMounted
      ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black/70 px-4 py-4">
            <div className="relative w-full max-w-md rounded-[28px] bg-white p-6 text-center text-black shadow-2xl">
              <button
                type="button"
                onClick={() => setIsSuccessOpen(false)}
                className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#55d3e8] hover:text-black"
                aria-label="Close success message"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <p className="pr-10 text-4xl leading-none">Request Submitted</p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/60">
                Your transfer request has been submitted successfully. We will
                contact you soon.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccessOpen(false)}
                className="mt-6 min-h-12 w-full rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
              >
                Great
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="font-lilita inline-flex min-h-12 items-center justify-center rounded-full bg-black px-5 text-center text-white transition hover:bg-[#55d3e8] hover:text-black"
      >
        Request Transfer
      </button>

      {dialog}
      {successDialog}
    </>
  );
}

function FieldLabel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3">
      <span className="grid gap-1.5">
        <span className="text-base leading-none">{title}</span>
        {description ? (
          <span className="text-sm leading-5 text-black/50">{description}</span>
        ) : null}
      </span>
      {children}
    </div>
  );
}
