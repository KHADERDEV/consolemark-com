import { PublicPageShell } from "@/components/layout/public-page-shell";

export const metadata = {
  title: "About Us | Console Mark",
  description:
    "Console Mark helps publishers access Google Play Console publishing capacity through a clean rental marketplace.",
};

const pillars = [
  {
    title: "Marketplace",
    body: "Browse available Play Consoles, compare pricing, and request access from one place.",
  },
  {
    title: "Operations",
    body: "Track rent requests, transfer requests, payments, and admin updates without scattered messages.",
  },
  {
    title: "Publisher Focus",
    body: "Built for app and game publishers who need a practical route from draft access to production outcomes.",
  },
];

export default function AboutUsPage() {
  return (
    <PublicPageShell
      eyebrow="About Console Mark"
      title="About Us"
      description="Console Mark is a focused marketplace for publishers who need practical access to Google Play Console publishing workflows."
      maxWidth="6xl"
    >
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[28px] border-2 border-black/10 bg-neutral-50 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
          >
            <h2 className="text-3xl leading-none">{pillar.title}</h2>
            <p className="mt-4 text-sm leading-6 text-black/60">
              {pillar.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[28px] border border-black/10 bg-black p-6 text-white">
        <h2 className="text-3xl leading-none">What We Do</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/70 sm:text-base">
          We connect developers with console owners, structure requests, surface
          clear order details, and keep communication organized around each app,
          package, payment, and transfer.
        </p>
      </div>
    </PublicPageShell>
  );
}
