import { describe, expect, it } from "vitest";

import { DEFAULT_START_VALUES } from "@/modules/interviews/constants";
import {
  answerFormSchema,
  interviewSchema,
  sessionParamSchema,
  startInterviewFormSchema,
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

describe("sessionParamSchema", () => {
  it("accepts a UUID and rejects anything else", () => {
    expect(sessionParamSchema.safeParse(SESSION_ID).success).toBe(true);
    expect(sessionParamSchema.safeParse("abc").success).toBe(false);
  });
});
