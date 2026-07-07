"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function LinkGoogleButton() {
  const supabase = createClient();
  const [message, setMessage] = useState("");

  async function linkGoogle() {
    setMessage("");
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={linkGoogle}
        className="mt-6 min-h-12 rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
      >
        Link Google Account
      </button>
      {message ? (
        <p className="mt-3 text-sm text-[#ff2780]">{message}</p>
      ) : null}
    </div>
  );
}
