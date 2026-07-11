import { NextResponse } from "next/server";

import { sendFeedbackEmail } from "@/lib/email/resend";
import { getFeedbackTypeLabel } from "@/lib/feedback-options";
import { createFeedback, feedbackFormSchema } from "@/lib/feedbacks";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = feedbackFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    feedback_type: formData.get("feedback_type") || "general",
    page_url: formData.get("page_url"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid feedback." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userAgent = request.headers.get("user-agent");
  const feedback = await createFeedback({
    userId: user?.id ?? null,
    name: parsed.data.name,
    email: parsed.data.email ?? user?.email ?? null,
    feedbackType: parsed.data.feedback_type,
    pageUrl: parsed.data.page_url,
    message: parsed.data.message,
    userAgent,
  });

  try {
    await sendFeedbackEmail({
      feedbackId: feedback.id,
      feedbackType: getFeedbackTypeLabel(parsed.data.feedback_type),
      name: parsed.data.name,
      email: parsed.data.email ?? user?.email ?? null,
      pageUrl: parsed.data.page_url,
      message: parsed.data.message,
      userId: user?.id ?? null,
      userAgent,
    });
  } catch (error) {
    console.error("Feedback email delivery failed.", error);
  }

  return NextResponse.json({ ok: true });
}
