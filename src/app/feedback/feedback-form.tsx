"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { feedbackTypes, getFeedbackTypeLabel } from "@/lib/feedback-options";

type FeedbackFormProps = {
  initialEmail?: string | null;
  initialName?: string | null;
};

type DialogState =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

export function FeedbackForm({ initialEmail, initialName }: FeedbackFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [dialog, setDialog] = useState<DialogState>(null);

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    setIsPending(true);
    const response = await fetch("/api/feedback", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as { error?: string };
    setIsPending(false);

    if (!response.ok) {
      setDialog({
        type: "error",
        message: payload.error ?? "Feedback could not be sent.",
      });
      return;
    }

    form.reset();
    setDialog({
      type: "success",
      message: "Your feedback has been sent. Thank you for helping us improve.",
    });
  }

  return (
    <>
      <form
        onSubmit={submitFeedback}
        className="mt-10 grid gap-5 rounded-[28px] border-2 border-black/10 bg-neutral-50 p-5 shadow-[0_16px_44px_rgba(0,0,0,0.06)] sm:p-6"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-black/55">Name</span>
            <input
              name="name"
              defaultValue={initialName ?? ""}
              maxLength={120}
              className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-black/55">Email</span>
            <input
              name="email"
              type="email"
              defaultValue={initialEmail ?? ""}
              className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
              placeholder="name@example.com"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <label className="grid gap-2">
            <span className="text-sm text-black/55">Feedback type</span>
            <select
              name="feedback_type"
              defaultValue="general"
              className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
            >
              {feedbackTypes.map((type) => (
                <option key={type} value={type}>
                  {getFeedbackTypeLabel(type)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-black/55">Page URL</span>
            <input
              name="page_url"
              type="url"
              className="h-12 rounded-full border border-black/15 bg-white px-5 outline-none transition focus:border-black"
              placeholder="https://www.consolemark.com/rent-marketplace"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm text-black/55">Feedback</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            className="min-h-52 rounded-[24px] border border-black/15 bg-white p-5 outline-none transition focus:border-black"
            placeholder="Tell us what happened, what could be better, or what you would like us to add."
          />
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60 sm:w-fit"
        >
          {isPending ? "Sending..." : "Send Feedback"}
        </button>
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
              {dialog.type === "success" ? "Feedback Sent" : "Sending Failed"}
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
