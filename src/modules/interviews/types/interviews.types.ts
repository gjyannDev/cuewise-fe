import type { z } from "zod";

import type {
  answerFormSchema,
  interviewSchema,
  interviewTypeSchema,
  levelSchema,
  roleSchema,
  startInterviewFormSchema,
} from "../schemas/interviews.schema";

export type Role = z.infer<typeof roleSchema>;
export type Level = z.infer<typeof levelSchema>;
export type InterviewType = z.infer<typeof interviewTypeSchema>;

/** What the setup form edits (role and level may still be unset). */
export type StartInterviewFormValues = z.input<typeof startInterviewFormSchema>;
/** The POST /interviews body, produced by the setup form's schema. */
export type StartInterviewRequest = z.output<typeof startInterviewFormSchema>;

export type Interview = z.infer<typeof interviewSchema>;
export type InterviewSession = Interview["session"];
export type InterviewQuestion = Interview["current_question"];

export type AnswerFormValues = z.input<typeof answerFormSchema>;

/** The `?session=` param after validation; plain data so a Server Component can pass it to a client one. */
export type SessionParam = { kind: "none" } | { kind: "invalid" } | { kind: "valid"; id: string };

/** Field errors the setup form should show after a failed start. */
export type StartInterviewFieldErrors = Partial<Record<keyof StartInterviewFormValues, string>>;
