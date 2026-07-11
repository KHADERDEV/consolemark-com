import { PublicPageShell } from "@/components/layout/public-page-shell";
import { getUserProfile } from "@/lib/rent-requests";
import { createClient } from "@/lib/supabase/server";
import { FeedbackForm } from "./feedback-form";

export const metadata = {
  title: "Feedback | Console Mark",
  description: "Send feedback about Console Mark.",
};

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await getUserProfile(user.id) : null;

  return (
    <PublicPageShell
      eyebrow="Console Mark Feedback"
      title="Send Feedback"
      description="Share an issue, idea, question, or anything that would help us improve the Console Mark experience."
      maxWidth="4xl"
    >
      <FeedbackForm
        initialEmail={profile?.email ?? user?.email}
        initialName={profile?.display_name}
      />
    </PublicPageShell>
  );
}
