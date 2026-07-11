import { ChevronDown, ShieldCheck, ShieldOff, UserCircle } from "lucide-react";

import { CopyButton } from "@/app/admin/(secure)/rent-orders/copy-button";
import { PagePagination } from "@/components/ui/page-pagination";
import { TrustedDeveloperBadge } from "@/components/users/trusted-developer-badge";
import { supabaseRest } from "@/lib/admin/supabase-rest";
import { getPageValue } from "@/lib/pagination";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Users | Console Mark Admin",
};

type UserProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  whatsapp_number: string | null;
  telegram_username: string | null;
  telegram_number: string | null;
  is_trusted: boolean;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
};

const PAGE_SIZE = 10;

function formatDate(value?: string | null) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [params, supabase] = await Promise.all([
    searchParams,
    Promise.resolve(createAdminClient()),
  ]);
  const page = getPageValue(params.page);
  const { data, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: PAGE_SIZE + 1,
  });

  const fetchedUsers = data?.users ?? [];
  const users = fetchedUsers.slice(0, PAGE_SIZE);
  const hasNextPage = fetchedUsers.length > PAGE_SIZE;
  const hasPreviousPage = page > 1;
  const profiles = await supabaseRest<UserProfile[]>("user_profiles", {
    query: {
      select:
        "id,email,display_name,avatar_url,whatsapp_number,telegram_username,telegram_number,is_trusted,is_blocked,created_at,updated_at",
      order: "created_at.desc",
    },
  });
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-3xl sm:text-5xl">Users</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        Review developer accounts, linked login providers, profile details,
        trust status, and request blocking controls.
      </p>

      {params.updated ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm text-black">
          User profile status updated.
        </div>
      ) : null}
      {params.reset ? (
        <div className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm text-black">
          Password reset email sent.
        </div>
      ) : null}
      {params.error ? (
        <div className="mt-6 rounded-full bg-[#ff2780]/15 px-5 py-3 text-sm text-[#b8004e]">
          User action failed. Check the user email and provider state.
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-[28px] border border-black/10 bg-neutral-50 p-6">
          <p className="text-sm text-[#ff2780]">{error.message}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5">
          {users.map((user) => {
            const identities = user.identities ?? [];
            const profile = profileById.get(user.id);
            const displayName =
              profile?.display_name ??
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              user.email?.split("@")[0] ??
              "Console Mark User";
            const avatarUrl =
              profile?.avatar_url ??
              user.user_metadata?.avatar_url ??
              user.user_metadata?.picture;
            const isTrusted = profile?.is_trusted ?? false;
            const isBlocked = profile?.is_blocked ?? false;

            return (
              <details
                key={user.id}
                className="group overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50 shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
              >
                <summary className="grid cursor-pointer list-none gap-5 border-b border-black/10 bg-white p-5 transition hover:bg-neutral-50 xl:grid-cols-[1fr_auto] xl:items-start">
                  <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-neutral-50">
                      {typeof avatarUrl === "string" && avatarUrl ? (
                        // biome-ignore lint/performance/noImgElement: User avatar URLs can come from OAuth providers outside the Next image allowlist.
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-12 w-12 text-black/35" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="break-words text-4xl leading-none">
                          {displayName}
                        </h2>
                        {isTrusted ? <TrustedDeveloperBadge /> : null}
                      </div>
                      <p className="mt-2 break-all text-base text-black/65">
                        {user.email ?? profile?.email ?? "No email stored"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="break-all rounded-full bg-black px-3 py-1.5 text-xs text-white">
                          User ID: {user.id}
                        </span>
                        <CopyButton value={user.id} label="user ID" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    <span
                      className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-sm ${
                        isTrusted
                          ? "bg-[#02feb7]/20 text-black"
                          : "bg-neutral-100 text-black/60"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      {isTrusted ? "Trusted developer" : "Not trusted"}
                    </span>
                    <span
                      className={`inline-flex min-h-9 items-center gap-2 rounded-full px-4 text-sm ${
                        isBlocked
                          ? "bg-[#ff2780]/15 text-[#b8004e]"
                          : "bg-[#02feb7]/20 text-black"
                      }`}
                    >
                      <ShieldOff className="h-4 w-4" aria-hidden="true" />
                      {isBlocked ? "Blocked from requests" : "Can submit"}
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition group-open:rotate-180">
                      <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </summary>

                <div className="grid gap-5 p-5 xl:grid-cols-[1fr_360px]">
                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-[18px] bg-white p-4">
                      <p className="text-xs text-black/45">Created</p>
                      <p className="mt-1 text-base leading-5">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-white p-4">
                      <p className="text-xs text-black/45">Last sign in</p>
                      <p className="mt-1 text-base leading-5">
                        {formatDate(user.last_sign_in_at)}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-white p-4">
                      <p className="text-xs text-black/45">WhatsApp</p>
                      <p className="mt-1 break-words text-base leading-5">
                        {profile?.whatsapp_number ?? "Not stored"}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-white p-4">
                      <p className="text-xs text-black/45">Telegram username</p>
                      <p className="mt-1 break-words text-base leading-5">
                        {profile?.telegram_username ?? "Not stored"}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-white p-4">
                      <p className="text-xs text-black/45">Telegram number</p>
                      <p className="mt-1 break-words text-base leading-5">
                        {profile?.telegram_number ?? "Not stored"}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-black/10 bg-white p-5 lg:col-span-3">
                      <p className="text-sm text-black/45">Linked accounts</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {identities.length > 0 ? (
                          identities.map((identity) => (
                            <span
                              key={identity.id}
                              className="rounded-full border border-black/10 bg-neutral-50 px-4 py-2 text-sm"
                            >
                              {identity.provider}
                              {identity.identity_data?.email
                                ? ` • ${identity.identity_data.email}`
                                : ""}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-black/50">
                            No linked providers.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <form
                      action={`/api/admin/users/${user.id}/profile-flags`}
                      method="post"
                      className="rounded-[22px] border border-black/10 bg-white p-5"
                    >
                      <p className="text-sm text-black/45">
                        Developer controls
                      </p>
                      <label className="mt-4 flex items-center justify-between gap-4 rounded-[18px] border border-black/10 bg-neutral-50 px-4 py-3">
                        <span>
                          <span className="block text-base">Trusted</span>
                          <span className="block text-xs text-black/45">
                            Show trusted badge in profile and orders.
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          name="is_trusted"
                          defaultChecked={isTrusted}
                          className="h-5 w-5 accent-[#02feb7]"
                        />
                      </label>
                      <label className="mt-3 flex items-center justify-between gap-4 rounded-[18px] border border-black/10 bg-neutral-50 px-4 py-3">
                        <span>
                          <span className="block text-base">
                            Block requests
                          </span>
                          <span className="block text-xs text-black/45">
                            Prevent new rent and transfer submissions.
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          name="is_blocked"
                          defaultChecked={isBlocked}
                          className="h-5 w-5 accent-[#ff2780]"
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-4 h-12 w-full rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
                      >
                        Save User Status
                      </button>
                    </form>

                    <form
                      action={`/api/admin/users/${user.id}/reset-password`}
                      method="post"
                    >
                      <button
                        type="submit"
                        className="h-12 w-full rounded-full border border-black/10 bg-white px-5 text-sm text-black transition hover:border-black hover:bg-black hover:text-white"
                      >
                        Send Password Reset
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            );
          })}
          <PagePagination
            ariaLabel="Admin users pagination"
            basePath="/admin/users"
            currentPage={page}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            searchParams={params}
          />
        </div>
      )}
    </div>
  );
}
