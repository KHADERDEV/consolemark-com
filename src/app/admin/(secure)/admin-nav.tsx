"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/rent-marketplace", label: "Rent Marketplace" },
  { href: "/admin/rent-orders", label: "Rent Orders" },
  { href: "/admin/transfer-orders", label: "Transfer Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/crypto-wallets", label: "Crypto Wallets" },
  { href: "/admin/feedbacks", label: "Feedbacks" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:mt-8 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "font-lilita shrink-0 rounded-full px-5 py-3 text-sm transition",
              isActive
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
