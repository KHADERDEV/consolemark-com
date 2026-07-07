"use client";

import { ChevronDown, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: siteConfig.links.rent, label: "Marketplace" },
  { href: siteConfig.links.support, label: "Support" },
];

type NavbarUser = {
  email?: string;
  avatarUrl?: string;
  name?: string;
};

type AuthUserForNavbar = {
  id: string;
  email?: string;
  user_metadata: Record<string, unknown>;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }>;
};

function getUserAvatarUrl(user: {
  user_metadata: Record<string, unknown>;
  identities?: Array<{ identity_data?: Record<string, unknown> | null }>;
}) {
  const metadataAvatar =
    user.user_metadata.avatar_url ?? user.user_metadata.picture;

  if (typeof metadataAvatar === "string" && metadataAvatar.length > 0) {
    return metadataAvatar;
  }

  const identityAvatar = user.identities
    ?.map(
      (identity) =>
        identity.identity_data?.avatar_url ?? identity.identity_data?.picture,
    )
    .find(
      (value): value is string => typeof value === "string" && value.length > 0,
    );

  return identityAvatar;
}

function getUserName(user: {
  user_metadata: Record<string, unknown>;
  email?: string;
}) {
  const name = user.user_metadata.full_name ?? user.user_metadata.name;

  return typeof name === "string" && name.length > 0 ? name : user.email;
}

function mapNavbarUser(user: AuthUserForNavbar): NavbarUser {
  return {
    email: user.email,
    avatarUrl: getUserAvatarUrl(user),
    name: getUserName(user),
  };
}

type SiteNavbarProps = {
  stable?: boolean;
  fixed?: boolean;
  transparent?: boolean;
};

export function SiteNavbar({
  stable = false,
  fixed = true,
  transparent = false,
}: SiteNavbarProps) {
  const [hasLeftHero, setHasLeftHero] = useState(false);
  const [user, setUser] = useState<NavbarUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (stable) {
      setHasLeftHero(true);
      return;
    }

    const updateNavbar = () => {
      const hero = document.getElementById("hero");
      const heroHeight = hero?.offsetHeight ?? window.innerHeight;

      setHasLeftHero(window.scrollY > heroHeight - 88);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("resize", updateNavbar);

    return () => {
      window.removeEventListener("scroll", updateNavbar);
      window.removeEventListener("resize", updateNavbar);
    };
  }, [stable]);

  useEffect(() => {
    const supabase = createClient();

    async function loadNavbarUser(authUser: AuthUserForNavbar | null) {
      if (!authUser) {
        setUser(null);
        return;
      }

      const mappedUser = mapNavbarUser(authUser);
      setUser(mappedUser);

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("display_name,avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!profile) {
        return;
      }

      setUser({
        ...mappedUser,
        name: profile.display_name ?? mappedUser.name,
        avatarUrl: profile.avatar_url ?? mappedUser.avatarUrl,
      });
    }

    supabase.auth.getUser().then(({ data }) => {
      loadNavbarUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadNavbarUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 transition-colors duration-300",
        fixed ? "fixed" : "relative",
        transparent
          ? "bg-transparent"
          : hasLeftHero
            ? "border-black/10 border-b bg-white/95 shadow-sm backdrop-blur-md"
            : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 py-4 text-black sm:h-20 sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:py-0 lg:px-8">
        <Link
          href={siteConfig.links.home}
          aria-label={`${siteConfig.name} home`}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <Image
            src={siteConfig.assets.logo}
            alt={`${siteConfig.name} logo`}
            width={44}
            height={44}
            priority
            draggable={false}
            className="h-8 w-8 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <span className="font-lilita whitespace-nowrap text-lg tracking-normal sm:text-2xl">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-lilita whitespace-nowrap rounded-md px-2 py-1.5 text-xs tracking-normal text-black transition-colors hover:bg-black/5 min-[380px]:text-sm sm:px-3 sm:py-2 sm:text-base"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((value) => !value)}
                className="flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2 pr-3 shadow-sm backdrop-blur transition hover:bg-white"
                aria-label="Open profile menu"
              >
                {user.avatarUrl ? (
                  // biome-ignore lint/performance/noImgElement: Google profile photo URLs are external user content and should bypass Next image domain validation.
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? user.email ?? "Profile"}
                    className="h-8 w-8 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle className="h-8 w-8" aria-hidden="true" />
                )}
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
              {isMenuOpen ? (
                <div className="absolute right-0 mt-3 w-64 rounded-[24px] border border-black/10 bg-white p-3 text-black shadow-xl">
                  <div className="border-black/10 border-b px-3 py-3">
                    <p className="truncate text-sm">{user.name ?? "Profile"}</p>
                    <p className="truncate text-xs text-black/50">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="mt-2 block rounded-full px-4 py-3 text-sm hover:bg-black/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/my-rentals"
                    className="block rounded-full px-4 py-3 text-sm hover:bg-black/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Rentals
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSignOutOpen(true);
                    }}
                    className="w-full rounded-full px-4 py-3 text-left text-sm text-[#ff2780] hover:bg-[#ff2780]/10"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="font-lilita whitespace-nowrap rounded-full bg-black px-4 py-2 text-xs tracking-normal text-white transition hover:bg-[#55d3e8] hover:text-black min-[380px]:text-sm sm:text-base"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
      {isSignOutOpen && isMounted
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 py-4">
              <div className="w-full max-w-md rounded-[28px] bg-white p-6 text-center text-black shadow-2xl">
                <p className="text-4xl leading-none">Sign out?</p>
                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/60">
                  Are you sure you want to sign out of your Console Mark
                  account?
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setIsSignOutOpen(false)}
                    className="min-h-12 rounded-full border border-black/15 bg-white px-6 text-black transition hover:border-black"
                  >
                    Cancel
                  </button>
                  <form action="/auth/logout" method="post">
                    <button
                      type="submit"
                      className="min-h-12 w-full rounded-full bg-black px-6 text-white transition hover:bg-[#55d3e8] hover:text-black"
                    >
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
