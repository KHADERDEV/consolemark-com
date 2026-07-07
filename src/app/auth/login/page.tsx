import Link from "next/link";
import { Suspense } from "react";

import { LoginPanel } from "@/app/auth/login/login-panel";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Login | Console Mark",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#55d3e8] bg-[linear-gradient(rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.32)_1px,transparent_1px)] bg-[length:56px_56px] px-4 py-10 text-black">
      <section className="flex w-full flex-col items-center">
        <Link href="/" className="mb-8 text-4xl leading-none">
          {siteConfig.name}
        </Link>
        <Suspense>
          <LoginPanel />
        </Suspense>
      </section>
    </main>
  );
}
