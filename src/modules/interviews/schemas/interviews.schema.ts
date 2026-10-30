import { z } from "zod";

import {
  ANSWER_MAX_LENGTH,
  INTERVIEW_TYPES,
  JOB_DESCRIPTION_MAX_LENGTH,
  LEVELS,
  MAX_QUESTION_COUNT,
  MIN_QUESTION_COUNT,
  QUESTION_CATEGORIES,
  ROLES,
  SESSION_STATUSES,
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

const questionSchema = z.object({
  id: z.uuid(),
  position: z.number().int(),
  text: z.string(),
  category: z.enum(QUESTION_CATEGORIES),
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

/** POST /interviews/{id}/messages. The reaction is a predefined acknowledgement, never an evaluation. */
export const answerResponseSchema = interviewSchema.extend({
  reaction: z.object({ id: z.uuid(), text: z.string() }),
});

/** `?session=` on /interviews. Checked before any request is made. */
export const sessionParamSchema = z.uuid();
