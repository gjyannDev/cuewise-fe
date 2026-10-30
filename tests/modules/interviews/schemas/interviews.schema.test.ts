import { describe, expect, it } from "vitest";

import { DEFAULT_START_VALUES } from "@/modules/interviews/constants";
import {
  answerFormSchema,
  answerRequestSchema,
  answerResponseSchema,
  interviewSchema,
  sessionParamSchema,
  startInterviewFormSchema,
  transcriptSchema,
} from "@/modules/interviews/schemas/interviews.schema";

const issuesFor = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((issue) => issue.path.join(".")) ?? [];

const SESSION_ID = "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f";
const QUESTION_ID = "6f5e4d3c-2b1a-4f9e-8d7c-6b5a4f3e2d1c";

describe("startInterviewFormSchema", () => {
  const valid = { ...DEFAULT_START_VALUES, role: "backend", level: "junior" };

  it("accepts the defaults once a role and level are chosen", () => {
    expect(startInterviewFormSchema.safeParse(valid).success).toBe(true);
  });

  it("defaults to a mixed interview of 5 questions with no role or level", () => {
    expect(DEFAULT_START_VALUES).toEqual({
      role: undefined,
      level: undefined,
      interview_type: "mixed",
      question_count: 5,
      job_description: "",
    });
  });

  it("puts errors on role and level when they are missing", () => {
    const result = startInterviewFormSchema.safeParse(DEFAULT_START_VALUES);

    expect(issuesFor(result).sort()).toEqual(["level", "role"]);
  });

  it("rejects a role the backend doesn't know", () => {
    expect(issuesFor(startInterviewFormSchema.safeParse({ ...valid, role: "devops" }))).toEqual(["role"]);
  });

  it.each([0, 11, 2.5])("rejects a question count of %s", (question_count) => {
    expect(issuesFor(startInterviewFormSchema.safeParse({ ...valid, question_count }))).toEqual([
      "question_count",
    ]);
  });

  it.each([1, 10])("accepts a question count of %s", (question_count) => {
    expect(startInterviewFormSchema.safeParse({ ...valid, question_count }).success).toBe(true);
  });

  it("rejects a job description over 2000 characters and accepts exactly 2000", () => {
    const tooLong = startInterviewFormSchema.safeParse({ ...valid, job_description: "a".repeat(2001) });
    const atLimit = startInterviewFormSchema.safeParse({ ...valid, job_description: "a".repeat(2000) });

    expect(issuesFor(tooLong)).toEqual(["job_description"]);
    expect(atLimit.success).toBe(true);
  });

  it("outputs exactly the request body, dropping a blank job description", () => {
    expect(startInterviewFormSchema.parse({ ...valid, job_description: "   " })).toEqual({
      role: "backend",
      level: "junior",
      interview_type: "mixed",
      question_count: 5,
    });
  });

  it("trims a job description that has text", () => {
    expect(startInterviewFormSchema.parse({ ...valid, job_description: "  Go and Postgres  " }).job_description).toBe(
      "Go and Postgres",
    );
  });

  it("strips keys the backend would reject", () => {
    expect(startInterviewFormSchema.parse({ ...valid, status: "in_progress" })).not.toHaveProperty("status");
  });
});

describe("interviewSchema", () => {
  const response = {
    session: {
      id: SESSION_ID,
      role: "backend",
      level: "junior",
      interview_type: "mixed",
      question_count: 5,
      job_description: null,
      status: "in_progress",
      created_at: "2026-10-28T09:00:00Z",
    },
    current_question: {
      id: QUESTION_ID,
      position: 1,
      text: "Explain the difference between a process and a thread.",
      category: "technical",
    },
  };

  it("parses a POST /interviews response", () => {
    expect(interviewSchema.parse(response)).toEqual(response);
  });

  it("rejects a non-UUID session id and an unknown role", () => {
    const result = interviewSchema.safeParse({
      ...response,
      session: { ...response.session, id: "42", role: "devops" },
    });

    expect(issuesFor(result).sort()).toEqual(["session.id", "session.role"]);
  });

  it("parses a completed interview, which has no current question", () => {
    const completed = { session: { ...response.session, status: "completed" }, current_question: null };

    expect(interviewSchema.parse(completed)).toEqual(completed);
  });
});

describe("answerFormSchema", () => {
  it.each(["", "   "])("rejects an empty answer (%j)", (answer) => {
    expect(issuesFor(answerFormSchema.safeParse({ answer }))).toEqual(["answer"]);
  });

  it("accepts 2000 characters and rejects 2001", () => {
    expect(answerFormSchema.safeParse({ answer: "a".repeat(2000) }).success).toBe(true);
    expect(issuesFor(answerFormSchema.safeParse({ answer: "a".repeat(2001) }))).toEqual(["answer"]);
  });
});

describe("answerRequestSchema", () => {
  it("outputs exactly the POST /messages body with the answer trimmed", () => {
    expect(answerRequestSchema.parse({ question_id: QUESTION_ID, answer: "  I would use a queue.  ", extra: 1 })).toEqual({
      question_id: QUESTION_ID,
      answer: "I would use a queue.",
    });
  });

  it.each(["", "   ", "a".repeat(2001)])("rejects an answer the backend would reject (%#)", (answer) => {
    expect(issuesFor(answerRequestSchema.safeParse({ question_id: QUESTION_ID, answer }))).toEqual(["answer"]);
  });

  it("accepts a 2000-character answer and rejects a non-UUID question id", () => {
    expect(answerRequestSchema.safeParse({ question_id: QUESTION_ID, answer: "a".repeat(2000) }).success).toBe(true);
    expect(issuesFor(answerRequestSchema.safeParse({ question_id: "q1", answer: "Yes" }))).toEqual(["question_id"]);
  });
});

describe("answerResponseSchema", () => {
  const session = {
    id: SESSION_ID,
    role: "frontend",
    level: "senior",
    interview_type: "technical",
    question_count: 2,
    job_description: null,
    status: "in_progress",
    created_at: "2026-10-28T09:00:00Z",
  };
  const reaction = { id: "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b", text: "Thanks, that gives me a clear picture." };

  it("parses a mid-interview answer with the next question", () => {
    const response = {
      session,
      reaction,
      current_question: { id: QUESTION_ID, position: 2, text: "How would you cache this?", category: "technical" },
    };

    expect(answerResponseSchema.parse(response)).toEqual(response);
  });

  it("parses the final answer: completed session and no next question", () => {
    const response = { session: { ...session, status: "completed" }, reaction, current_question: null };

    expect(answerResponseSchema.parse(response)).toEqual(response);
  });

  it("rejects a response without a reaction", () => {
    expect(issuesFor(answerResponseSchema.safeParse({ session, current_question: null }))).toEqual(["reaction"]);
  });
});

describe("sessionParamSchema", () => {
  it("accepts a UUID and rejects anything else", () => {
    expect(sessionParamSchema.safeParse(SESSION_ID).success).toBe(true);
    expect(sessionParamSchema.safeParse("abc").success).toBe(false);
  });
});

describe("transcriptSchema", () => {
  const answerId = "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b";
  const reactionId = "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5c";
  const question = {
    id: QUESTION_ID,
    question_id: QUESTION_ID,
    position: 1,
    role: "interviewer",
    kind: "question",
    text: "Tell me about a time you disagreed with a teammate.",
    created_at: "2026-10-30T09:00:00Z",
  };
  const answer = {
    id: answerId,
    question_id: QUESTION_ID,
    position: 1,
    role: "candidate",
    kind: "answer",
    text: "We talked it through.",
    created_at: "2026-10-30T09:01:00Z",
  };
  const reaction = { ...answer, id: reactionId, role: "interviewer", kind: "reaction", text: "Thanks for sharing that." };

  it("parses GET /interviews/{id}/messages: a question, its answer and the reaction", () => {
    const payload = { items: [question, answer, reaction] };

    expect(transcriptSchema.parse(payload)).toEqual(payload);
  });

  it("parses a question with no created_at (cuewise-be stores questions when the interview starts)", () => {
    expect(transcriptSchema.safeParse({ items: [{ ...question, created_at: null }] }).success).toBe(true);
  });

  it("rejects a kind or role the backend doesn't send", () => {
    expect(issuesFor(transcriptSchema.safeParse({ items: [{ ...answer, kind: "feedback" }] }))).toEqual(["items.0.kind"]);
    expect(issuesFor(transcriptSchema.safeParse({ items: [{ ...answer, role: "system" }] }))).toEqual(["items.0.role"]);
  });

  it("rejects a response without items", () => {
    expect(issuesFor(transcriptSchema.safeParse({}))).toEqual(["items"]);
  });
});
