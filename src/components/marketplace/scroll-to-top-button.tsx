"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setIsVisible(window.scrollY > 520);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Go to top"
      title="Go to top"
      className={`fixed bottom-3 left-3 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-200 hover:bg-[#55d3e8] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:bottom-6 sm:left-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
