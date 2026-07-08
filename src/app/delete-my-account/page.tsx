import { Mail } from "lucide-react";

import { PublicPageShell } from "@/components/layout/public-page-shell";

export const metadata = {
  title: "Delete My Account | Console Mark",
  description: "Request deletion of your Console Mark account and data.",
};

export default function DeleteMyAccountPage() {
  return (
    <PublicPageShell
      eyebrow="Account deletion"
      title="Delete My Account"
      description="To delete your Console Mark account, contact our deletion team from the email address connected to your account."
      maxWidth="5xl"
    >
      <div className="mt-10 rounded-[28px] border-2 border-black/10 bg-neutral-50 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.06)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-3xl leading-none">Send Your Request</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-black/60">
          Email us at{" "}
          <a
            href="mailto:delete@consolemark.com"
            className="text-black underline decoration-black/30 underline-offset-4 hover:decoration-black"
          >
            delete@consolemark.com
          </a>{" "}
          and include your Console Mark account email. We may ask you to confirm
          ownership before deleting account data.
        </p>
        <a
          href="mailto:delete@consolemark.com?subject=Console%20Mark%20Account%20Deletion%20Request"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
        >
          Email delete@consolemark.com
        </a>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] border border-black/10 bg-white p-5">
          <h2 className="text-2xl leading-none">What to Include</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-black/60">
            <li>Your account email address.</li>
            <li>Your name or profile name, if different.</li>
            <li>A clear request to delete the account and associated data.</li>
          </ul>
        </div>
        <div className="rounded-[24px] border border-black/10 bg-white p-5">
          <h2 className="text-2xl leading-none">What Happens Next</h2>
          <p className="mt-4 text-sm leading-6 text-black/60">
            We review the request, verify ownership where required, and process
            eligible deletion requests according to applicable law and our data
            retention obligations.
          </p>
        </div>
      </div>
    </PublicPageShell>
  );
}
