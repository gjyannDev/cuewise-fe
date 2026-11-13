import type { InterviewListParams } from "../types/interviews.types";

export const interviewKeys = {
  all: ["interviews"] as const,
  start: () => [...interviewKeys.all, "start"] as const,
  // Job description import (setup form): mutations only, nothing is cached or stored.
  importJobUrl: () => [...interviewKeys.all, "import", "url"] as const,
  importJobText: () => [...interviewKeys.all, "import", "text"] as const,
  // History pages, one per page/filter; a sibling of detail(id), so invalidating one never touches the other.
  lists: () => [...interviewKeys.all, "list"] as const,
  list: (params: InterviewListParams) => [...interviewKeys.lists(), params] as const,
  detail: (id: string) => [...interviewKeys.all, "detail", id] as const,
  // Under detail(id): invalidating the interview also refetches its conversation.
  messages: (id: string) => [...interviewKeys.detail(id), "messages"] as const,
  answer: (id: string) => [...interviewKeys.detail(id), "answer"] as const,
  transcribe: (id: string) => [...interviewKeys.detail(id), "transcribe"] as const,
  // Under detail(id): the end-of-interview feedback belongs to the interview.
  feedback: (id: string) => [...interviewKeys.detail(id), "feedback"] as const,
  generateFeedback: (id: string) => [...interviewKeys.feedback(id), "generate"] as const,
};
