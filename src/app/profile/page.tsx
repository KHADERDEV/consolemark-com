import { redirect } from "next/navigation";
import { LinkGoogleButton } from "@/app/profile/link-google-button";
import { ProfileEditor } from "@/app/profile/profile-editor";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { getUserProfile } from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profile | Console Mark",
};

function getMetadataString(
  metadata: Record<string, unknown> | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const value = metadata?.[key];

    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return null;
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const providers = user.identities?.map((identity) => identity.provider) ?? [];
  const hasGoogleLinked = providers.includes("google");
  const hasEmailProvider = providers.includes("email");
  const profile = await getUserProfile(user.id);
  const metadataName = getMetadataString(user.user_metadata, [
    "full_name",
    "name",
  ]);
  const identityAvatar =
    user.identities
      ?.map((identity) =>
        getMetadataString(identity.identity_data ?? undefined, [
          "avatar_url",
          "picture",
        ]),
      )
      .find((value): value is string => Boolean(value)) ?? null;
  const avatarUrl =
    profile?.avatar_url ??
    getMetadataString(user.user_metadata, ["avatar_url", "picture"]) ??
    identityAvatar;
  const displayName =
    profile?.display_name ??
    metadataName ??
    user.email?.split("@")[0] ??
    "Console Mark User";

  return (
    <main className="min-h-screen bg-white text-black">
      <SiteNavbar stable />
      <section className="mx-auto w-full max-w-4xl px-4 pt-36 pb-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl leading-none sm:text-5xl">Profile</h1>
        <ProfileEditor
          email={user.email}
          initialDisplayName={displayName}
          initialWhatsappNumber={profile?.whatsapp_number}
          avatarUrl={avatarUrl}
          isTrusted={profile?.is_trusted ?? false}
          isBlocked={profile?.is_blocked ?? false}
        />

        <div className="mt-6 rounded-[28px] border border-black/10 bg-neutral-50 p-6">
          <p className="text-sm text-black/50">Linked providers</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <span
                  key={provider}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
                >
                  {provider}
                </span>
              ))
            ) : (
              <span className="text-sm text-black/50">No providers found.</span>
            )}
          </div>
          {hasGoogleLinked ? (
            <p className="mt-6 rounded-full bg-[#02feb7]/20 px-5 py-3 text-sm text-black">
              Google account is already linked.
            </p>
          ) : hasEmailProvider ? (
            <LinkGoogleButton />
          ) : (
            <p className="mt-6 rounded-full bg-white px-5 py-3 text-sm text-black/60">
              You are signed in with Google.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
