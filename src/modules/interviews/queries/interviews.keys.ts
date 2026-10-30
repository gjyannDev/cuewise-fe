export const interviewKeys = {
  all: ["interviews"] as const,
  start: () => [...interviewKeys.all, "start"] as const,
  detail: (id: string) => [...interviewKeys.all, "detail", id] as const,
  // Under detail(id): invalidating the interview also refetches its conversation.
  messages: (id: string) => [...interviewKeys.detail(id), "messages"] as const,
  answer: (id: string) => [...interviewKeys.detail(id), "answer"] as const,
};
