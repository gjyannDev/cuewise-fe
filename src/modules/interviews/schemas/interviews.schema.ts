import { z } from "zod";

import {
  ANSWER_MAX_LENGTH,
  INTERVIEW_TYPES,
  JOB_DESCRIPTION_MAX_LENGTH,
  LEVELS,
  MAX_QUESTION_COUNT,
  MIN_QUESTION_COUNT,
  QUESTION_CATEGORIES,
  QUESTION_KINDS,
  ROLES,
  SESSION_STATUSES,
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

/** POST /interviews/{id}/transcriptions: what the candidate said, for them to review. It is not saved as an answer. */
export const transcriptionResponseSchema = z.object({ text: z.string() });
