import { UpdatePasswordPanel } from "@/app/auth/update-password/update-password-panel";

export const metadata = {
  title: "Update Password | Console Mark",
};

export default function UpdatePasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#55d3e8] bg-[linear-gradient(rgba(255,255,255,0.32)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.32)_1px,transparent_1px)] bg-[length:56px_56px] px-4 py-10 text-black">
      <UpdatePasswordPanel />
    </main>
  );
}
