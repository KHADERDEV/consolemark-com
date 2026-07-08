import Link from "next/link";

import { PublicPageShell } from "@/components/layout/public-page-shell";

export const metadata = {
  title: "Blogs | Console Mark",
  description:
    "Console Mark articles for app publishers, Google Play Console access, marketplace operations, and transfer workflows.",
};

const featuredBlog = {
  title:
    "Google Play Console 12-Tester Rule: Personal vs Organization Accounts",
  date: "July 8, 2026",
  category: "Google Play Console",
  href: "/blogs/google-play-console-12-tester-rule",
  readTime: "7 min read",
  summary:
    "New personal developer accounts need a qualifying closed test before production access. Organization accounts follow a different onboarding path.",
};

export default function BlogsPage() {
  return (
    <PublicPageShell
      eyebrow="Console Mark Blog"
      title="Blogs"
      description="Practical notes for publishers using Google Play Console, rent requests, transfer requests, and marketplace workflows."
      maxWidth="6xl"
    >
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={featuredBlog.href}
          className="group flex min-h-[360px] flex-col rounded-[28px] border-2 border-black/10 bg-neutral-50 p-6 shadow-[0_16px_44px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:border-black hover:shadow-[0_22px_60px_rgba(0,0,0,0.1)]"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
              {featuredBlog.category}
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/55">
              {featuredBlog.readTime}
            </span>
          </div>
          <h2 className="mt-5 text-4xl leading-none transition group-hover:text-black/75">
            {featuredBlog.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-black/60">
            {featuredBlog.summary}
          </p>
          <div className="mt-auto pt-8">
            <p className="text-sm text-black/45">{featuredBlog.date}</p>
            <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-sm text-white transition group-hover:bg-[#55d3e8] group-hover:text-black">
              Read Article
            </span>
          </div>
        </Link>
      </div>
    </PublicPageShell>
  );
}
