"use client";

import { Expand, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type RentConsoleImageDialogProps = {
  imageUrl: string;
  name: string;
};

export function RentConsoleImageDialog({
  imageUrl,
  name,
}: RentConsoleImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative block w-full overflow-hidden rounded-t-[26px] bg-neutral-100 text-left"
        aria-label={`Open ${name} image`}
      >
        <Image
          src={imageUrl}
          alt={`${name} Play Console dashboard`}
          width={900}
          height={520}
          loading="eager"
          unoptimized
          className="h-48 w-full object-cover sm:h-52"
        />
        <span className="absolute bottom-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg">
          <Expand className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      {isMounted && isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105"
                aria-label="Close image preview"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <Image
                src={imageUrl}
                alt={`${name} Play Console dashboard enlarged`}
                width={1600}
                height={1000}
                unoptimized
                className="max-h-[82vh] w-full max-w-5xl rounded-[28px] object-contain shadow-2xl"
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
