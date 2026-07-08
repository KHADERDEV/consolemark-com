import { PublicPageShell } from "@/components/layout/public-page-shell";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy | Console Mark",
  description:
    "Read the Console Mark Privacy Policy, including what data we collect, why we use it, and how to contact us.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "Account information, including email address, profile name, avatar, linked authentication provider, and WhatsApp number when provided.",
      "Marketplace request information, including console listing selected, app name, package name, pricing type, draft access email, transfer details, payment status, request notes, and timestamps.",
      "Operational information, including admin updates, support communications, payment references, fraud prevention signals, and technical logs required to operate the service.",
    ],
  },
  {
    title: "2. How We Use Information",
    body: [
      "To create and manage user accounts, profiles, rent requests, transfer requests, payments, and support communications.",
      "To notify administrators and users about request status, payment status, transfer status, and account support matters.",
      "To protect the platform, prevent abuse, investigate suspicious activity, enforce our terms, and comply with legal obligations.",
    ],
  },
  {
    title: "3. Legal Bases",
    body: [
      "We process data to perform our agreement with users, operate requested services, respond to support requests, comply with legal obligations, and pursue legitimate interests such as fraud prevention and platform security.",
    ],
  },
  {
    title: "4. Sharing Information",
    body: [
      "We share information only where needed to operate Console Mark, including with hosting, authentication, payment, email, analytics, and support providers.",
      "We may disclose information if required by law, court order, regulatory request, dispute process, or to protect Console Mark, users, and third parties.",
      "We do not sell personal information.",
    ],
  },
  {
    title: "5. Cookies and Authentication",
    body: [
      "We use cookies and similar technologies for login sessions, security, routing, and service functionality. Disabling essential cookies may prevent parts of the platform from working.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "We retain account, request, payment, and support data for as long as needed to provide the service, resolve disputes, enforce agreements, maintain business records, and meet legal obligations.",
      "When data is no longer required, we delete it or anonymize it where reasonably possible.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      "Depending on your location, you may request access, correction, deletion, restriction, portability, or objection to certain processing.",
      "To request deletion of your account, email delete@consolemark.com from the account email address.",
    ],
  },
  {
    title: "8. Security",
    body: [
      "We use administrative, technical, and organizational safeguards designed to protect personal information. No internet service can guarantee absolute security.",
    ],
  },
  {
    title: "9. International Processing",
    body: [
      "Console Mark may process and store information in countries different from your own. Where required, we rely on appropriate safeguards for cross-border transfers.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      `For privacy questions, contact ${siteConfig.footer.email}. For deletion requests, contact delete@consolemark.com.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PublicPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description="This policy explains how Console Mark collects, uses, stores, and protects information when you use the platform."
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
