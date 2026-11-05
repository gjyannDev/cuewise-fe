import type {
  AnswerResponse,
  InterviewListItem,
  InterviewQuestion,
  Reaction,
  TranscriptItem,
} from "@/modules/interviews/types/interviews.types";

export const SESSION_ID = "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f";
export const Q1 = "6f5e4d3c-2b1a-4f9e-8d7c-6b5a4f3e2d1c";
export const Q2 = "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d";
export const Q3 = "9c8b7a6f-5e4d-4c3b-8a9f-8e7d6c5b4a3f";

export const REACTION: NonNullable<Reaction> = { id: "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b", text: "Thanks for sharing that." };

/**
 * A transcript line as GET /interviews/{id}/messages returns it. A main question by default, numbered by its
 * position; pass `question_kind` / `main_number` overrides for a follow-up.
 */
export function transcriptItem(
  kind: TranscriptItem["kind"],
  questionId: string,
  position: number,
  overrides: Partial<TranscriptItem> = {},
): TranscriptItem {
  return {
    id: kind === "question" ? questionId : `${questionId.slice(0, -4)}${kind === "answer" ? "aaaa" : "bbbb"}`,
    question_id: questionId,
    position,
    role: kind === "answer" ? "candidate" : "interviewer",
    kind,
    text: `${kind} ${position}`,
    created_at: kind === "question" ? null : "2026-10-30T09:00:00Z",
    question_kind: "main",
    main_number: position,
    ...overrides,
  };
}

type NextQuestion = Pick<InterviewQuestion, "id" | "position"> & Partial<InterviewQuestion>;

/**
 * A POST /interviews/{id}/messages response; pass no next question for the final answer. The next question is a main
 * question numbered by its position unless overridden; pass `reaction: null` for a follow-up turn.
 */
export function answerResponse(next?: NextQuestion, reaction: Reaction = REACTION): AnswerResponse {
  return {
    session: {
      id: SESSION_ID,
      role: "backend",
      level: "junior",
      interview_type: "behavioral",
      question_count: 2,
      job_description: null,
      status: next ? "in_progress" : "completed",
      created_at: "2026-10-30T09:00:00Z",
    },
    reaction,
    current_question: next
      ? {
          text: `question ${next.position}`,
          category: "behavioral",
          question_kind: "main",
          main_number: next.position,
          ...next,
        }
      : null,
  };
}

/** One row of GET /interviews (the history list): an in-progress backend interview unless overridden. */
export function interviewListItem(overrides: Partial<InterviewListItem> = {}): InterviewListItem {
  return {
    id: SESSION_ID,
    role: "backend",
    level: "junior",
    interview_type: "behavioral",
    status: "in_progress",
    question_count: 5,
    answered_count: 2,
    created_at: "2026-11-04T09:30:00Z",
    ...overrides,
  };
}
