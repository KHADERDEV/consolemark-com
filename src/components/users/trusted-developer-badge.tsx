import Image from "next/image";

type TrustedDeveloperBadgeProps = {
  size?: "base" | "sm";
};

export function TrustedDeveloperBadge({
  size = "base",
}: TrustedDeveloperBadgeProps) {
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[#02feb7]/50 bg-[#02feb7]/20 text-black ${
        isSmall ? "min-h-6 px-2 py-0.5 text-xs" : "min-h-8 px-3 py-1 text-sm"
      }`}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-[#02feb7] ${
          isSmall ? "h-5 w-5" : "h-6 w-6"
        }`}
      >
        <Image
          src="/consolemark-logo-00e5ff.png"
          alt=""
          width={isSmall ? 14 : 18}
          height={isSmall ? 14 : 18}
          draggable={false}
          className={`object-contain brightness-0 ${
            isSmall ? "h-3.5 w-3.5" : "h-[18px] w-[18px]"
          }`}
        />
      </span>
      <span>Trusted</span>
    </span>
  );
}
