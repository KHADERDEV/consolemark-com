"use client";

import { Check, Copy } from "lucide-react";
import type React from "react";
import { useState } from "react";

type CopyValueButtonProps = {
  value: string;
  label: string;
  className?: string;
  showText?: boolean;
};

export function CopyValueButton({
  value,
  label,
  className,
  showText = false,
}: CopyValueButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className={
        className ??
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-black hover:bg-[#55d3e8]"
      }
      aria-label={`Copy ${label}`}
      title={copied ? "Copied" : `Copy ${label}`}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {showText ? <span>{copied ? "Copied" : "Copy"}</span> : null}
    </button>
  );
}
