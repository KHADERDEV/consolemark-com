type AdminLoginFormProps = {
  showError?: boolean;
};

export function AdminLoginForm({ showError = false }: AdminLoginFormProps) {
  return (
    <form
      action="/api/admin/login"
      method="post"
      className="mt-8 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label className="font-lilita text-sm" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-12 rounded-full border border-black/15 bg-white px-5 text-sm outline-none transition focus:border-black"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-lilita text-sm" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 rounded-full border border-black/15 bg-white px-5 text-sm outline-none transition focus:border-black"
        />
      </div>

      {showError ? (
        <p className="rounded-full bg-red-50 px-4 py-3 text-sm text-red-700">
          Invalid admin credentials.
        </p>
      ) : null}

      <button
        type="submit"
        className="font-lilita mt-2 h-12 rounded-full bg-black px-6 text-white transition hover:bg-black/85"
      >
        Sign in
      </button>
    </form>
  );
}
