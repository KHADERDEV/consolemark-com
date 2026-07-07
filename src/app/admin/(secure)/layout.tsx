import Image from "next/image";
import Link from "next/link";
import { AdminNav } from "@/app/admin/(secure)/admin-nav";

import { siteConfig } from "@/config/site";
import { requireAdminSession } from "@/lib/admin/auth";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await requireAdminSession();

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-black/10 border-b bg-neutral-50 px-5 py-5 lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src={siteConfig.assets.logo}
              alt={`${siteConfig.name} logo`}
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
            <span className="font-lilita text-2xl">{siteConfig.name}</span>
          </Link>

          <AdminNav />

          <div className="mt-8 rounded-[24px] border border-black/10 bg-white p-4">
            <p className="font-lilita text-sm">Signed in</p>
            <p className="mt-1 break-all text-xs text-black/55">
              {admin.email}
            </p>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="font-lilita mt-4 rounded-full bg-black px-5 py-2.5 text-sm text-white transition hover:bg-black/85"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <section className="px-5 py-8 sm:px-8 lg:px-10">{children}</section>
      </div>
    </main>
  );
}
