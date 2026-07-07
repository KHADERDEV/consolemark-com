import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = {
  title: "Users | Console Mark Admin",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [params, supabase] = await Promise.all([
    searchParams,
    Promise.resolve(createAdminClient()),
  ]);
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  const users = data?.users ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <p className="text-4xl sm:text-5xl">Users</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
        View Supabase Auth users, linked login providers, and send password
        reset emails.
      </p>

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

            return (
              <section
                key={user.id}
                className="rounded-[28px] border border-black/10 bg-neutral-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-2xl">{user.email ?? "No email"}</p>
                    <p className="mt-2 text-xs text-black/50">{user.id}</p>
                    <p className="mt-3 text-sm text-black/60">
                      Created {new Date(user.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-black/60">
                      Last sign in{" "}
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString()
                        : "Never"}
                    </p>
                  </div>

                  <form
                    action={`/api/admin/users/${user.id}/reset-password`}
                    method="post"
                  >
                    <button
                      type="submit"
                      className="rounded-full bg-black px-5 py-3 text-sm text-white transition hover:bg-[#55d3e8] hover:text-black"
                    >
                      Send Password Reset
                    </button>
                  </form>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-black/50">Linked accounts</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {identities.length > 0 ? (
                      identities.map((identity) => (
                        <span
                          key={identity.id}
                          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
