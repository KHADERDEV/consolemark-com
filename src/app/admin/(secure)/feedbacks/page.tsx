import { PagePagination } from "@/components/ui/page-pagination";
import {
  feedbackStatuses,
  feedbackTypes,
  getFeedbackStatusClass,
  getFeedbackStatusLabel,
  getFeedbackTypeLabel,
} from "@/lib/feedback-options";
import { getAdminFeedbacks } from "@/lib/feedbacks";
import { getPageValue } from "@/lib/pagination";

export const metadata = {
  title: "Feedbacks | Console Mark Admin",
};

const PAGE_SIZE = 10;

export default async function AdminFeedbacksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = getPageValue(params.page);
  const feedbackPage = await getAdminFeedbacks({
    page,
    pageSize: PAGE_SIZE,
    status: params.status,
    feedbackType: params.type,
    query: params.q,
  });
  const feedbacks = feedbackPage.items;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <p className="text-3xl sm:text-5xl">Feedbacks</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
        Review feedback sent from the public website. New submissions are also
        emailed to feedback@consolemark.com.
      </p>

      <form className="mt-8 grid gap-3 rounded-[28px] border border-black/10 bg-neutral-50 p-5 lg:grid-cols-[1fr_180px_180px_auto]">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Search feedback"
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        />
        <select
          name="type"
          defaultValue={params.type ?? ""}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        >
          <option value="">All types</option>
          {feedbackTypes.map((type) => (
            <option key={type} value={type}>
              {getFeedbackTypeLabel(type)}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none"
        >
          <option value="">All statuses</option>
          {feedbackStatuses.map((status) => (
            <option key={status} value={status}>
              {getFeedbackStatusLabel(status)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-full bg-black px-5 text-white transition hover:bg-[#55d3e8] hover:text-black"
        >
          Filter
        </button>
      </form>

      <div className="mt-8 grid gap-5">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <details
              key={feedback.id}
              className="group overflow-hidden rounded-[28px] border-2 border-black/10 bg-neutral-50"
            >
              <summary className="grid cursor-pointer list-none gap-4 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black px-3 py-1.5 text-xs text-white">
                      {getFeedbackTypeLabel(feedback.feedback_type)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs ${getFeedbackStatusClass(feedback.status)}`}
                    >
                      {getFeedbackStatusLabel(feedback.status)}
                    </span>
                    <span className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-black/60">
                      {formatFeedbackDate(feedback.created_at)}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-2xl leading-none">
                    {feedback.message}
                  </p>
                </div>
                <span className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/60">
                  Open
                </span>
              </summary>

              <div className="grid gap-5 border-t border-black/10 p-5 lg:grid-cols-[1fr_320px]">
                <div className="rounded-[22px] bg-white p-5">
                  <p className="text-sm text-black/45">Message</p>
                  <p className="mt-3 whitespace-pre-wrap text-lg leading-7">
                    {feedback.message}
                  </p>
                </div>

                <div className="grid gap-3">
                  <AdminDetail label="Name" value={feedback.name} />
                  <AdminDetail label="Email" value={feedback.email} />
                  <AdminDetail label="User ID" value={feedback.user_id} />
                  <AdminDetail label="Page URL" value={feedback.page_url} />
                  <AdminDetail
                    label="Created"
                    value={formatFeedbackDate(feedback.created_at)}
                  />
                  <AdminDetail
                    label="User Agent"
                    value={feedback.user_agent}
                    multiline
                  />
                </div>
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-[28px] border border-black/10 bg-neutral-50 p-8 text-center text-black/55">
            No feedback found.
          </div>
        )}

        <PagePagination
          ariaLabel="Admin feedbacks pagination"
          basePath="/admin/feedbacks"
          currentPage={feedbackPage.page}
          hasNextPage={feedbackPage.hasNextPage}
          hasPreviousPage={feedbackPage.hasPreviousPage}
          searchParams={params}
        />
      </div>
    </div>
  );
}

function AdminDetail({
  label,
  value,
  multiline,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-[18px] bg-white p-4">
      <p className="text-xs text-black/45">{label}</p>
      <p
        className={`mt-1 break-words text-sm leading-5 ${
          multiline ? "whitespace-pre-wrap" : ""
        }`}
      >
        {value ?? "Not provided"}
      </p>
    </div>
  );
}

function formatFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
