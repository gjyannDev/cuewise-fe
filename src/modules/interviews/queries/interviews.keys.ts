export const interviewKeys = {
  all: ["interviews"] as const,
  start: () => [...interviewKeys.all, "start"] as const,
  detail: (id: string) => [...interviewKeys.all, "detail", id] as const,
  answer: (id: string) => [...interviewKeys.detail(id), "answer"] as const,
};
