import { z } from "zod";

import {
  ANSWER_MAX_LENGTH,
  FEEDBACK_CRITERIA,
  FEEDBACK_STATUSES,
  HISTORY_PAGE_SIZES,
  HISTORY_SORT_COLUMNS,
  INTERVIEW_TYPES,
  JOB_DESCRIPTION_MAX_LENGTH,
  JOB_PASTE_FORMATS,
  JOB_URL_MAX_LENGTH,
  LEVELS,
  MAX_QUESTION_COUNT,
  MIN_QUESTION_COUNT,
  QUESTION_CATEGORIES,
  QUESTION_KINDS,
  ROLES,
  SCORE_MAX,
  SCORE_MIN,
  SESSION_STATUSES,
  SORT_DIRECTIONS,
  TRANSCRIPT_KINDS,
  TRANSCRIPT_ROLES,
  TURN_PHASES,
} from "../constants";

export const roleSchema = z.enum(ROLES, { error: "Choose a role" });
export const levelSchema = z.enum(LEVELS, { error: "Choose a level" });
export const interviewTypeSchema = z.enum(INTERVIEW_TYPES, { error: "Choose an interview style" });

const questionCountMessage = `Choose between ${MIN_QUESTION_COUNT} and ${MAX_QUESTION_COUNT} questions`;

/**
 * The setup form. Its output is exactly the POST /interviews body: cuewise-be forbids extra keys and
 * stores a blank job description as null, so a blank one is dropped here instead of sent.
 */
export const startInterviewFormSchema = z.object({
  role: roleSchema,
  level: levelSchema,
  interview_type: interviewTypeSchema,
  question_count: z
    .number({ error: questionCountMessage })
    .int(questionCountMessage)
    .min(MIN_QUESTION_COUNT, questionCountMessage)
    .max(MAX_QUESTION_COUNT, questionCountMessage),
  job_description: z
    .string()
    .trim()
    .max(JOB_DESCRIPTION_MAX_LENGTH, `Keep it under ${JOB_DESCRIPTION_MAX_LENGTH} characters`)
    .transform((value) => value || undefined)
    .optional(),
});

const jobUrlFormatMessage = "Enter a link starting with http:// or https://";

/**
 * The setup form's posting link, checked before any request. Only the shape: whether the server may open it is
 * cuewise-be's decision (it refuses internal addresses, other ports and redirects into them).
 */
export const jobUrlSchema = z
  .string()
  .trim()
  .min(1, "Enter a link")
  .max(JOB_URL_MAX_LENGTH, `Keep the link under ${JOB_URL_MAX_LENGTH} characters`)
  .refine((value) => {
    try {
      const url = new URL(value);
      return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
    } catch {
      return false;
    }
  }, jobUrlFormatMessage);

/** POST /interviews/job-text: a whole posting page the candidate copied from their own browser. */
export const jobTextRequestSchema = z.object({
  content: z.string(),
  format: z.enum(JOB_PASTE_FORMATS),
});

/** POST /interviews/job-url and /job-text: the posting's text, cut to the job description's limit when `truncated`. */
export const jobImportResponseSchema = z.object({
  text: z.string(),
  truncated: z.boolean(),
});

const sessionSchema = z.object({
  id: z.uuid(),
  role: roleSchema,
  level: levelSchema,
  interview_type: interviewTypeSchema,
  question_count: z.number().int(),
  job_description: z.string().nullable(),
  status: z.enum(SESSION_STATUSES),
  created_at: z.string(),
});

/**
 * What every question carries, on its own and on each transcript line about it. `question_kind` says whether it is a
 * main question or a follow-up; `main_number` is the main question it belongs to (what "Question N of M" counts),
 * while `position` only orders the rows (it counts follow-ups too).
 */
const questionKindFields = {
  question_kind: z.enum(QUESTION_KINDS),
  main_number: z.number().int(),
};

const questionSchema = z.object({
  id: z.uuid(),
  position: z.number().int(),
  text: z.string(),
  category: z.enum(QUESTION_CATEGORIES),
  ...questionKindFields,
});

/** GET /interviews/{id} and POST /interviews. `current_question` is null once the interview is completed. */
export const interviewSchema = z.object({
  session: sessionSchema,
  current_question: questionSchema.nullable(),
});

export const answerFormSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, "Write an answer first")
    .max(ANSWER_MAX_LENGTH, `Keep it under ${ANSWER_MAX_LENGTH} characters`),
});

/** The POST /interviews/{id}/messages body. cuewise-be forbids extra keys, so unknown ones are stripped. */
export const answerRequestSchema = answerFormSchema.extend({ question_id: z.uuid() });

/**
 * POST /interviews/{id}/messages. The reaction is a predefined acknowledgement, never an evaluation. It is null when
 * the next question is a follow-up (the interviewer digs deeper instead of moving on); the key is always sent.
 */
export const answerResponseSchema = interviewSchema.extend({
  reaction: z.object({ id: z.uuid(), text: z.string() }).nullable(),
});

/** One line of GET /interviews/{id}/messages: each shown question, then its answer and reaction once they exist. */
export const transcriptItemSchema = z.object({
  id: z.uuid(),
  question_id: z.uuid(),
  position: z.number().int(),
  role: z.enum(TRANSCRIPT_ROLES),
  kind: z.enum(TRANSCRIPT_KINDS),
  text: z.string(),
  // Null for questions: they are stored when the interview starts, not when they are shown.
  created_at: z.string().nullable(),
  ...questionKindFields,
});

export const transcriptSchema = z.object({ items: z.array(transcriptItemSchema) });

/**
 * The `data` of each event of POST /interviews/{id}/messages/stream, by event name (mirrors cuewise-be's
 * `StreamEvent`; keep in step). `done` carries the saved turn and `error` a generic failure; both end the stream.
 */
export const answerStreamEventSchemas = {
  status: z.object({ phase: z.enum(TURN_PHASES) }),
  reaction: z.object({ id: z.uuid(), text: z.string() }),
  "question.delta": z.object({ text: z.string() }),
  reset: z.object({}),
  done: answerResponseSchema,
  error: z.object({ code: z.string(), message: z.string(), request_id: z.string().nullable() }),
};

/** `?session=` on /interviews. Checked before any request is made. */
export const sessionParamSchema = z.uuid();

/** `?page=` on /history: a positive whole number written plainly (no sign, spaces, decimals or exponent). */
export const historyPageParamSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .transform(Number)
  .refine(Number.isSafeInteger);

/** `?status=` on /history: one session status; anything else means no filter. */
export const historyStatusParamSchema = z.enum(SESSION_STATUSES);

/** `?size=` on /history: one of the offered page sizes, written plainly. */
export const historySizeParamSchema = z
  .enum(HISTORY_PAGE_SIZES.map(String) as [string, ...string[]])
  .transform(Number);

/** `?sort=` and `?order=` on /history: a column cuewise-be can sort by, and its direction. */
export const historySortParamSchema = z.enum(HISTORY_SORT_COLUMNS);
export const historyOrderParamSchema = z.enum(SORT_DIRECTIONS);

/** POST /interviews/{id}/transcriptions: what the candidate said, for them to review. It is not saved as an answer. */
export const transcriptionResponseSchema = z.object({ text: z.string() });

const criterionSchema = z.enum(FEEDBACK_CRITERIA);

/** One main question's result. `scores` holds exactly its category's four criteria (cuewise-be checks that). */
export const feedbackQuestionSchema = z.object({
  main_number: z.number().int(),
  category: z.enum(QUESTION_CATEGORIES),
  question: z.string(),
  // Partial: an enum-keyed record would demand all eight criteria, and a question only has four.
  scores: z.partialRecord(criterionSchema, z.number().int().min(SCORE_MIN).max(SCORE_MAX)),
  note: z.string().nullable(),
  // The quote is verified by cuewise-be: these exact words appear in the candidate's answers to this question.
  evidence: z.array(z.object({ criterion: criterionSchema, quote: z.string(), reason: z.string() })),
});

/**
 * GET and POST /interviews/{id}/feedback. Scores and text only once `generated`; `enough_evidence` false means there
 * was too little to assess (no scores, the message is in `summary`). `generating` and `failed` rows are empty.
 */
export const feedbackSchema = z.object({
  id: z.uuid(),
  interview_id: z.uuid(),
  status: z.enum(FEEDBACK_STATUSES),
  enough_evidence: z.boolean().nullable(),
  overall: z.number().min(SCORE_MIN).max(SCORE_MAX).nullable(),
  summary: z.string().nullable(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  next_steps: z.array(z.string()),
  questions: z.array(feedbackQuestionSchema),
  rubric_version: z.string(),
  created_at: z.iso.datetime({ offset: true }),
});

/**
 * One row of GET /interviews (the history table). No job description or interview content: the backend leaves them
 * out. `answered_count` counts main questions finished (follow-ups don't count), 0..question_count.
 */
export const interviewListItemSchema = z.object({
  id: z.uuid(),
  role: roleSchema,
  level: levelSchema,
  interview_type: interviewTypeSchema,
  status: z.enum(SESSION_STATUSES),
  question_count: z.number().int(),
  answered_count: z.number().int(),
  // A real timestamp, so formatting it can't fail while the table renders.
  created_at: z.iso.datetime({ offset: true }),
});

/** GET /interviews: one page of the user's interviews, newest first. `total` counts every match of the filter. */
export const interviewListSchema = z.object({
  items: z.array(interviewListItemSchema),
  total: z.number().int(),
  limit: z.number().int(),
  offset: z.number().int(),
});
