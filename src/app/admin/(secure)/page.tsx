export const metadata = {
  title: "Admin Dashboard | Console Mark",
};

const stats = [
  { label: "Admin users", value: "1" },
  { label: "Marketplace status", value: "Setup" },
  { label: "Security mode", value: "Strict" },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-2">
        <p className="font-lilita text-4xl sm:text-5xl">Dashboard</p>
        <p className="max-w-2xl text-sm text-black/60">
          Owner-only Console Mark administration area.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[28px] border border-black/10 bg-neutral-50 p-5"
          >
            <p className="text-sm text-black/55">{stat.label}</p>
            <p className="font-lilita mt-3 text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-[28px] border border-black/10 p-6">
        <p className="font-lilita text-2xl">Admin Panel Ready</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
          The secure login, database-backed sessions, and owner-only access
          guard are active. Marketplace management screens can be connected as
          the marketplace data model is added.
        </p>
      </section>
    </div>
  );
}
