export const feedbackTypes = [
  "general",
  "bug",
  "idea",
  "marketplace",
  "payment",
  "account",
  "other",
] as const;

export type FeedbackType = (typeof feedbackTypes)[number];

export const feedbackStatuses = ["new", "reviewed", "archived"] as const;
export type FeedbackStatus = (typeof feedbackStatuses)[number];

export function getFeedbackTypeLabel(type: FeedbackType) {
  const labels: Record<FeedbackType, string> = {
    general: "General",
    bug: "Bug",
    idea: "Idea",
    marketplace: "Marketplace",
    payment: "Payment",
    account: "Account",
    other: "Other",
  };

  return labels[type];
}

export function getFeedbackStatusLabel(status: FeedbackStatus) {
  const labels: Record<FeedbackStatus, string> = {
    new: "New",
    reviewed: "Reviewed",
    archived: "Archived",
  };

  return labels[status];
}

export function getFeedbackStatusClass(status: FeedbackStatus) {
  const classes: Record<FeedbackStatus, string> = {
    new: "bg-[#fdd52e] text-black",
    reviewed: "bg-[#02feb7] text-black",
    archived: "bg-neutral-200 text-black",
  };

  return classes[status];
}
