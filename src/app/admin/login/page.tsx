import Image from "next/image";
import Link from "next/link";

import { AdminLoginForm } from "@/app/admin/login/login-form";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Admin Login | Console Mark",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-black">
      <section className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3">
          <Image
            src={siteConfig.assets.logo}
            alt={`${siteConfig.name} logo`}
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
          <span className="font-lilita text-3xl">{siteConfig.name}</span>
        </Link>

        <div className="mt-10 rounded-[32px] border border-black/10 bg-white p-7 shadow-sm">
          <p className="font-lilita text-3xl">Admin Panel</p>
          <p className="mt-2 text-sm text-black/60">
            Restricted access for the Console Mark owner account.
          </p>
          <AdminLoginForm showError={params.error === "1"} />
        </div>
      </section>
    </main>
  );
}
