"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "reset";

export function LoginPanel() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const siteUrl = typeof window === "undefined" ? "" : window.location.origin;
  const nextPath = searchParams.get("next") ?? "/";

  async function signInWithGoogle() {
    setIsPending(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (error) {
      setMessage(error.message);
      setIsPending(false);
    }
  }

  async function submitEmailPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage("");

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/auth/update-password`,
      });
      setMessage(
        error ? error.message : "Password reset email sent. Check your inbox.",
      );
      setIsPending(false);
      return;
    }

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            },
          });

    if (result.error) {
      setMessage(result.error.message);
      setIsPending(false);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Account created. Check your email to confirm your account.");
      setIsPending(false);
      return;
    }

    window.location.href = nextPath;
  }

  return (
    <div className="w-full max-w-md rounded-[32px] border border-black/10 bg-white p-7 shadow-sm">
      <p className="text-center text-4xl leading-none">Welcome Back</p>
      <p className="mt-3 text-center text-sm text-black/60">
        Sign in to manage rentals and link your account providers.
      </p>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isPending}
        className="mt-8 flex min-h-12 w-full items-center justify-center rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60"
      >
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-black/45">
        <span className="h-px flex-1 bg-black/10" />
        <span>Email and password</span>
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={submitEmailPassword} className="grid gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="h-12 rounded-full border border-black/15 px-5 outline-none focus:border-black"
        />
        {mode !== "reset" ? (
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="h-12 rounded-full border border-black/15 px-5 outline-none focus:border-black"
          />
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black disabled:opacity-60"
        >
          {mode === "signin"
            ? "Sign in"
            : mode === "signup"
              ? "Create account"
              : "Send reset link"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 rounded-[20px] bg-neutral-50 px-4 py-3 text-center text-sm text-black/70">
          {message}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="rounded-full px-3 py-1 hover:bg-black/5"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="rounded-full px-3 py-1 hover:bg-black/5"
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode("reset")}
          className="rounded-full px-3 py-1 hover:bg-black/5"
        >
          Reset password
        </button>
      </div>
    </div>
  );
}
