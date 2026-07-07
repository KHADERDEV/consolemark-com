"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordPanel() {
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      setIsPending(false);
      return;
    }

    setMessage("Password updated. You can now sign in.");
    setIsPending(false);
  }

  return (
    <form
      onSubmit={updatePassword}
      className="grid w-full max-w-md gap-4 rounded-[32px] border border-black/10 bg-white p-7 shadow-sm"
    >
      <p className="text-center text-4xl leading-none">Update Password</p>
      <input
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="New password"
        className="h-12 rounded-full border border-black/15 px-5 outline-none focus:border-black"
      />
      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60"
      >
        Save new password
      </button>
      {message ? (
        <p className="rounded-[20px] bg-neutral-50 px-4 py-3 text-center text-sm text-black/70">
          {message}
        </p>
      ) : null}
    </form>
  );
}
