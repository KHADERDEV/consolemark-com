import { PublicPageShell } from "@/components/layout/public-page-shell";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms of Service | Console Mark",
  description:
    "Read the Console Mark Terms of Service for marketplace access, requests, payments, and user responsibilities.",
};

const sections = [
  {
    title: "1. Agreement",
    body: [
      "These Terms govern your access to and use of Console Mark, including marketplace browsing, rent requests, transfer requests, payments, support, and related services.",
      "By using Console Mark, you agree to these Terms. If you do not agree, do not use the platform.",
    ],
  },
  {
    title: "2. Eligibility and Account Security",
    body: [
      "You must provide accurate account and request information and keep your login credentials secure.",
      "You are responsible for activity under your account, including rent requests, transfer requests, payment references, and communications submitted through the platform.",
    ],
  },
  {
    title: "3. Marketplace Role",
    body: [
      "Console Mark provides tools to list, discover, request, manage, and track Play Console related services. Console owners and publishers remain responsible for their own compliance obligations.",
      "We may review, approve, reject, cancel, suspend, or remove requests, listings, users, or content where needed for platform quality, compliance, safety, or business reasons.",
    ],
  },
  {
    title: "4. User Responsibilities",
    body: [
      "You must not submit false, misleading, infringing, abusive, unlawful, or unauthorized information.",
      "You must comply with Google Play policies, applicable laws, payment requirements, intellectual property rules, and any instructions shown in request forms or admin updates.",
      "You must not attempt to bypass restrictions, manipulate payments, abuse console access, or interfere with other users or platform operations.",
    ],
  },
  {
    title: "5. Requests, Payments, and Access",
    body: [
      "Submitting a rent or transfer request does not guarantee approval, publishing, transfer completion, account access, production approval, app acceptance, or app store outcomes.",
      "Pricing, payment type, payment status, request status, and admin notes may be displayed in your account pages. You are responsible for reviewing these details before taking action.",
      "Payments may be created, updated, rejected, refunded, or marked complete based on operational review and the applicable order context.",
    ],
  },
  {
    title: "6. Blocking and Trusted Developers",
    body: [
      "Console Mark may mark accounts as trusted based on internal review. Trusted status is informational and may be removed at any time.",
      "Console Mark may block users from submitting new rent or transfer requests for abuse, risk, policy concerns, payment issues, inaccurate information, or other operational reasons.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "Console Mark, its brand assets, interface, content, and platform materials are owned by Console Mark or its licensors.",
      "You retain responsibility for the apps, games, package names, developer account details, and materials you submit.",
    ],
  },
  {
    title: "8. Third-Party Services",
    body: [
      "The platform may integrate with authentication, payment, messaging, hosting, analytics, email, and Google Play related services. Third-party services are governed by their own terms and policies.",
    ],
  },
  {
    title: "9. Disclaimers",
    body: [
      "Console Mark is provided on an as-is and as-available basis. We do not guarantee uninterrupted service, error-free operation, Google Play approval, app approval, publishing results, revenue, ranking, or transfer outcomes.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Console Mark is not liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, lost business, account actions, app rejection, or third-party platform decisions.",
    ],
  },
  {
    title: "11. Changes",
    body: [
      "We may update these Terms from time to time. Continued use of Console Mark after changes means you accept the updated Terms.",
    ],
  },
  {
    title: "12. Contact",
    body: [
      `Questions about these Terms can be sent to ${siteConfig.footer.email}.`,
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <PublicPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms define the rules for using Console Mark, submitting marketplace requests, and managing platform activity."
      maxWidth="5xl"
    >
      <div className="mt-8 rounded-[24px] border border-black/10 bg-neutral-50 p-5 text-sm text-black/55">
        Last updated: July 8, 2026
      </div>
      <div className="mt-6 grid gap-5">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[24px] border border-black/10 bg-white p-6"
          >
            <h2 className="text-3xl leading-none">{section.title}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-black/60">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PublicPageShell>
  );
}
