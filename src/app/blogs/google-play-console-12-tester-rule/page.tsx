import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";
import { siteConfig } from "@/config/site";

export const metadata = {
  title:
    "Google Play Console 12-Tester Rule: Personal vs Organization Accounts | Console Mark",
  description:
    "A practical guide to Google Play Console closed testing requirements for new personal developer accounts and how organization accounts differ.",
};

const sourceLinks = [
  {
    label:
      "Google Play Help: App testing requirements for new personal developer accounts",
    href: "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },
  {
    label: "Google Play Help: Choose a developer account type",
    href: "https://support.google.com/googleplay/android-developer/answer/13628312?hl=en",
  },
];

export default function GooglePlayConsoleTesterRulePage() {
  return (
    <PublicPageShell
      eyebrow="Google Play Console"
      title="Google Play Console 12-Tester Rule"
      description="What publishers need to understand about new personal developer accounts, closed testing, and organization accounts."
      maxWidth="5xl"
    >
      <article className="mt-10">
        <div className="rounded-[28px] border-2 border-black/10 bg-neutral-50 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-black px-3 py-1 text-white">
              Google Play Console
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-black/55">
              July 8, 2026
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-black/55">
              7 min read
            </span>
          </div>

          <p className="mt-6 text-xl leading-8 text-black/70">
            Google Play changed the path to production access for many new
            personal developer accounts. For publishers, the difference between
            a personal account and an organization account can materially affect
            how quickly an app can move from draft to production.
          </p>
        </div>

        <div className="mt-8 grid gap-8">
          <section className="rounded-[24px] border border-black/10 bg-white p-6">
            <h2 className="text-4xl leading-none">The Rule in Plain Terms</h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-black/65">
              <p>
                Google Play requires newly created personal developer accounts
                to run a closed test before applying for production access. The
                test must include at least 12 testers who have opted in, and
                those testers must stay opted in for 14 continuous days before
                the developer can apply for production access.
              </p>
              <p>
                The rule applies to personal developer accounts created after
                November 13, 2023. It is not just a formality: the account must
                complete the testing requirement before production access can be
                requested.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-black/10 bg-white p-6">
            <h2 className="text-4xl leading-none">
              Why Organization Accounts Are Different
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-black/65">
              <p>
                Google separates developer accounts into personal and
                organization account types. Organization accounts are intended
                for businesses, companies, institutions, and other formal
                entities.
              </p>
              <p>
                The mandatory 12-tester, 14-day closed test is documented for
                new personal developer accounts. Organization accounts follow a
                business verification path instead, and they are not described
                by Google as being subject to that personal-account testing
                requirement.
              </p>
              <p>
                In practice, this is why many publishers prefer business or
                organization structures when they have a legitimate entity and
                want a cleaner production publishing path.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-black/10 bg-white p-6">
            <h2 className="text-4xl leading-none">Personal vs Organization</h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[22px] bg-neutral-50 p-5">
                <h3 className="text-2xl leading-none">Personal Account</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-black/65">
                  <li>Designed for individual developers.</li>
                  <li>
                    New accounts created after November 13, 2023 need a closed
                    test before production access.
                  </li>
                  <li>
                    Requires at least 12 opted-in testers for 14 continuous days
                    before applying for production.
                  </li>
                </ul>
              </div>
              <div className="rounded-[22px] bg-neutral-50 p-5">
                <h3 className="text-2xl leading-none">Organization Account</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-black/65">
                  <li>Designed for verified companies and organizations.</li>
                  <li>Uses business/entity verification.</li>
                  <li>
                    Google does not list organization accounts under the new
                    personal-account closed testing requirement.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-black/10 bg-white p-6">
            <h2 className="text-4xl leading-none">
              What This Means for Publishers
            </h2>
            <div className="mt-5 grid gap-4 text-base leading-8 text-black/65">
              <p>
                If you use a new personal account, plan for the testing window.
                You need real testers, opt-ins, and enough time for the full
                14-day period. Rushing the process usually creates delays.
              </p>
              <p>
                If you publish through an organization account, the primary
                hurdle is different: the account must satisfy Google&apos;s
                business verification requirements. Once verified, the
                publishing flow is generally more direct for production access.
              </p>
              <p>
                Console Mark helps publishers compare available console options,
                submit structured rent requests, manage draft access details,
                and track transfer or payment status from one place.
              </p>
            </div>
          </section>

          <section className="rounded-[24px] border border-black/10 bg-white p-6">
            <h2 className="text-4xl leading-none">Recommended Checklist</h2>
            <ul className="mt-5 space-y-3 text-base leading-8 text-black/65">
              <li>
                Confirm whether the target account is personal or organization.
              </li>
              <li>
                If personal, confirm when the account was created and whether
                production access already exists.
              </li>
              <li>
                If closed testing is required, prepare at least 12 committed
                testers before starting the 14-day window.
              </li>
              <li>
                Keep package name, draft access email, WhatsApp contact, and
                request ID ready for support and order review.
              </li>
              <li>
                Always verify the latest policy inside Google Play Console and
                the official Google Play Help Center.
              </li>
            </ul>
          </section>

          <section className="rounded-[24px] border border-black/10 bg-white p-6">
            <h2 className="text-4xl leading-none">Official Sources</h2>
            <div className="mt-5 grid gap-3">
              {sourceLinks.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[18px] border border-black/10 bg-neutral-50 px-4 py-3 text-sm leading-6 text-black underline decoration-black/30 underline-offset-4 transition hover:border-black hover:decoration-black"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-black p-6 text-white">
            <h2 className="text-4xl leading-none">Need a Console?</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
              Browse available console listings, compare pricing, and submit a
              structured rent request with the app name, package name, and draft
              access email your order needs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={siteConfig.links.rent}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#55d3e8] px-6 text-black transition hover:bg-white"
              >
                Browse Marketplace
              </Link>
              <Link
                href={siteConfig.links.blogs}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                Back to Blogs
              </Link>
            </div>
          </section>
        </div>
      </article>
    </PublicPageShell>
  );
}
