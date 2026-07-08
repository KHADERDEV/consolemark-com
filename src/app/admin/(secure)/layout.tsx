import Image from "next/image";
import Link from "next/link";
import { AdminAccountCard } from "@/app/admin/(secure)/admin-account-card";
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
        <aside className="flex min-w-0 flex-col border-black/10 border-b bg-neutral-50 px-4 py-5 sm:px-5 lg:min-h-screen lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
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

          <AdminAccountCard email={admin.email} />
        </aside>

        <section className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">
          {children}
        </section>
      </div>
    </main>
  );
}
