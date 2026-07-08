"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type RentRequestDialogProps = {
  rentConsoleId: string;
  consoleName: string;
  isLoggedIn: boolean;
  initialWhatsappNumber?: string | null;
};

type SubmissionState = "idle" | "pending" | "success" | "error";

const fieldClassName =
  "h-12 rounded-full border border-black/15 px-5 outline-none transition focus:border-black";

export function RentRequestDialog({
  rentConsoleId,
  consoleName,
  isLoggedIn,
  initialWhatsappNumber,
}: RentRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

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

    setState("pending");
    setMessage("");

    const response = await fetch("/api/rent-requests", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Request failed. Please try again.");
      return;
    }

    form.reset();
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
                aria-label="Close rent request form"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="shrink-0 border-b border-black/10 px-6 pt-6 pb-4">
                <p className="pr-12 text-4xl leading-none">Rent Request</p>
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
                      title="App name"
                      description="This is how your app will appear on Google Play"
                    >
                      <input
                        name="app_name"
                        required
                        maxLength={30}
                        className={fieldClassName}
                      />
                    </FieldLabel>

                    <FieldLabel title="Package name">
                      <input
                        name="package_name"
                        required
                        className={fieldClassName}
                        placeholder="com.example.app"
                      />
                    </FieldLabel>
                  </section>

                  <section className="grid gap-6 rounded-[22px] bg-white p-5">
                    <RadioGroup
                      title="App or game"
                      name="submission_type"
                      options={[
                        { label: "App", value: "app" },
                        { label: "Game", value: "game" },
                      ]}
                    />

                    <RadioGroup
                      title="Free or paid"
                      name="pricing_type"
                      options={[
                        { label: "Free", value: "free" },
                        { label: "Paid", value: "paid" },
                      ]}
                    />
                  </section>

                  <section className="grid gap-5 rounded-[22px] bg-white p-5">
                    <FieldLabel
                      title="Email"
                      description="This is for you to get Full Draft Access and Permissions on your app/game"
                    >
                      <input
                        name="gmail"
                        type="email"
                        required
                        className={fieldClassName}
                        placeholder="name@example.com"
                      />
                    </FieldLabel>

                    <div className="rounded-[20px] bg-neutral-50 p-4 text-sm leading-6 text-black/65">
                      Do you want us to publish your app/game for you? Please
                      contact{" "}
                      <a
                        className="text-black underline"
                        href="mailto:rent@consolemark.com"
                      >
                        rent@consolemark.com
                      </a>
                      .
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
                    disabled={state === "pending"}
                    className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60"
                  >
                    {state === "pending" ? "Submitting..." : "Submit Request"}
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
                Your rent request has been submitted successfully. We will
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
        Rent Now
      </button>

      {dialog}
      {successDialog}
    </>
  );
}

function RadioGroup({
  title,
  name,
  options,
}: {
  title: string;
  name: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-base leading-none">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-12 items-center gap-3 rounded-full border border-black/15 px-5"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              required
              className="h-4 w-4 rounded-full accent-black"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
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
