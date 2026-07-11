import "server-only";

import { z } from "zod";

import { supabaseRest } from "@/lib/admin/supabase-rest";
import {
  createPagedResult,
  getPaginationQuery,
  type PagedResult,
} from "@/lib/pagination";
import {
  type FeedbackStatus,
  type FeedbackType,
  feedbackTypes,
} from "@/lib/feedback-options";

export type Feedback = {
  id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  feedback_type: FeedbackType;
  page_url: string | null;
  message: string;
  user_agent: string | null;
  status: FeedbackStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export const feedbackFormSchema = z.object({
  name: z.string().trim().max(120).optional().transform(emptyToNull),
  email: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: "Use a valid email address.",
    })
    .transform(emptyToNull),
  feedback_type: z.enum(feedbackTypes).default("general"),
  page_url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Use a valid page URL.",
    })
    .transform(emptyToNull),
  message: z.string().trim().min(10).max(5000),
});

const feedbackSelect =
  "id,user_id,name,email,feedback_type,page_url,message,user_agent,status,admin_note,created_at,updated_at";

export async function createFeedback(input: {
  userId?: string | null;
  name: string | null;
  email: string | null;
  feedbackType: FeedbackType;
  pageUrl: string | null;
  message: string;
  userAgent?: string | null;
}) {
  const rows = await supabaseRest<Array<{ id: string; created_at: string }>>(
    "feedbacks",
    {
      method: "POST",
      prefer: "return=representation",
      query: {
        select: "id,created_at",
      },
      body: {
        user_id: input.userId ?? null,
        name: input.name,
        email: input.email,
        feedback_type: input.feedbackType,
        page_url: input.pageUrl,
        message: input.message,
        user_agent: input.userAgent ?? null,
        status: "new",
      },
    },
  );

  return rows[0];
}

export async function getAdminFeedbacks({
  page,
  pageSize,
  status,
  feedbackType,
  query: searchQuery,
}: {
  page: number;
  pageSize: number;
  status?: string;
  feedbackType?: string;
  query?: string;
}): Promise<PagedResult<Feedback>> {
  const query: Record<string, string> = {
    select: feedbackSelect,
    order: "created_at.desc",
    ...getPaginationQuery({ page, pageSize }),
  };

  if (status) {
    query.status = `eq.${status}`;
  }

  if (feedbackType) {
    query.feedback_type = `eq.${feedbackType}`;
  }

  if (searchQuery) {
    const safeQuery = searchQuery.replaceAll("*", "").replaceAll(",", " ");
    query.or = `(name.ilike.*${safeQuery}*,email.ilike.*${safeQuery}*,message.ilike.*${safeQuery}*,page_url.ilike.*${safeQuery}*)`;
  }

  const rows = await supabaseRest<Feedback[]>("feedbacks", { query });

  return createPagedResult({ rows, page, pageSize });
}

function emptyToNull(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
