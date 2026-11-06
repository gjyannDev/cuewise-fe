import { describe, expect, it } from "vitest";

import { DEFAULT_START_VALUES } from "@/modules/interviews/constants";
import {
  answerFormSchema,
  answerRequestSchema,
  answerResponseSchema,
  feedbackSchema,
  historyOrderParamSchema,
  historySizeParamSchema,
  historySortParamSchema,
  interviewListSchema,
  interviewSchema,
  sessionParamSchema,
  startInterviewFormSchema,
  transcriptionResponseSchema,
  transcriptSchema,
} from "@/modules/interviews/schemas/interviews.schema";
import { emptyFeedback, feedback, feedbackQuestion, interviewListItem } from "@tests/helpers/interviews";

describe("history sort and size params", () => {
  it.each([
    ["10", 10],
    ["20", 20],
    ["50", 50],
  ])("?size=%s is %i rows (R2)", (raw, size) => {
    expect(historySizeParamSchema.parse(raw)).toBe(size);
  });

  it.each(["7", "0", "100", "abc", "", "020", "1e1"])("rejects ?size=%j (R2, E1)", (raw) => {
    expect(historySizeParamSchema.safeParse(raw).success).toBe(false);
  });

  it.each(["created_at", "role", "level", "interview_type", "status"])("accepts ?sort=%s (R3)", (raw) => {
    expect(historySortParamSchema.parse(raw)).toBe(raw);
  });

  it.each(["progress", "actions", "id", "Role", ""])("rejects ?sort=%j (R3, E1)", (raw) => {
    expect(historySortParamSchema.safeParse(raw).success).toBe(false);
  });

  it("accepts asc and desc only (R4, E1)", () => {
    expect(historyOrderParamSchema.parse("asc")).toBe("asc");
    expect(historyOrderParamSchema.parse("desc")).toBe("desc");
    expect(historyOrderParamSchema.safeParse("up").success).toBe(false);
  });
});

const issuesFor = (result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }) =>
  result.error?.issues.map((issue) => issue.path.join(".")) ?? [];

/** A copy without the fields cuewise-be added for follow-ups, as an older backend would send it. */
const withoutQuestionKind = (value: object) =>
  Object.fromEntries(Object.entries(value).filter(([key]) => key !== "question_kind" && key !== "main_number"));

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
      question_kind: "main",
      main_number: 1,
    },
  };

  it("parses a POST /interviews response", () => {
    expect(interviewSchema.parse(response)).toEqual(response);
  });

  it("parses a follow-up as the current question", () => {
    const followUp = {
      ...response,
      current_question: { ...response.current_question, position: 2, question_kind: "follow_up", main_number: 1 },
    };

    expect(interviewSchema.parse(followUp)).toEqual(followUp);
  });

  it("rejects a question without question_kind or main_number (no silent defaults)", () => {
    const bare = withoutQuestionKind(response.current_question);

    expect(issuesFor(interviewSchema.safeParse({ ...response, current_question: bare })).sort()).toEqual([
      "current_question.main_number",
      "current_question.question_kind",
    ]);
  });

  it("rejects a question kind the backend doesn't send", () => {
    const result = interviewSchema.safeParse({
      ...response,
      current_question: { ...response.current_question, question_kind: "probe" },
    });

    expect(issuesFor(result)).toEqual(["current_question.question_kind"]);
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
      current_question: {
        id: QUESTION_ID,
        position: 2,
        text: "How would you cache this?",
        category: "technical",
        question_kind: "main",
        main_number: 2,
      },
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

  it("accepts a null reaction (cuewise-be sends none when the next question is a follow-up)", () => {
    expect(answerResponseSchema.safeParse({ session, reaction: null, current_question: null }).success).toBe(true);
  });

  it("parses a follow-up turn: no reaction, a follow-up of the same main question next", () => {
    const response = {
      session,
      reaction: null,
      current_question: {
        id: QUESTION_ID,
        position: 2,
        text: "Which cache would you pick, and why?",
        category: "technical",
        question_kind: "follow_up",
        main_number: 1,
      },
    };

    expect(answerResponseSchema.parse(response)).toEqual(response);
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
    question_kind: "main",
    main_number: 1,
  };
  const answer = {
    id: answerId,
    question_id: QUESTION_ID,
    position: 1,
    role: "candidate",
    kind: "answer",
    text: "We talked it through.",
    created_at: "2026-10-30T09:01:00Z",
    question_kind: "main",
    main_number: 1,
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

  it("parses a follow-up thread: main question and answer with no reaction, then the follow-up", () => {
    const followUp = { ...question, id: answerId, question_id: answerId, position: 2, question_kind: "follow_up" };
    const payload = { items: [question, answer, followUp] };

    expect(transcriptSchema.parse(payload)).toEqual(payload);
  });

  it("rejects an item without question_kind or main_number, or with an unknown question kind", () => {
    const bare = withoutQuestionKind(answer);

    expect(issuesFor(transcriptSchema.safeParse({ items: [bare] })).sort()).toEqual([
      "items.0.main_number",
      "items.0.question_kind",
    ]);
    expect(issuesFor(transcriptSchema.safeParse({ items: [{ ...answer, question_kind: "probe" }] }))).toEqual([
      "items.0.question_kind",
    ]);
  });

  it("rejects a response without items", () => {
    expect(issuesFor(transcriptSchema.safeParse({}))).toEqual(["items"]);
  });
});

describe("transcriptionResponseSchema", () => {
  it("accepts the transcript text (voice AC14)", () => {
    expect(transcriptionResponseSchema.parse({ text: "I would add an index." })).toEqual({
      text: "I would add an index.",
    });
  });

  it.each([[{}], [{ text: null }], [{ text: 42 }]])("rejects %j", (body) => {
    expect(issuesFor(transcriptionResponseSchema.safeParse(body))).toEqual(["text"]);
  });

  it("drops unknown keys", () => {
    expect(transcriptionResponseSchema.parse({ text: "ok", model: "nova-3" })).toEqual({ text: "ok" });
  });
});

describe("interviewListSchema", () => {
  const page = { items: [interviewListItem(), interviewListItem({ status: "abandoned" })], total: 12, limit: 10, offset: 0 };

  it("accepts a page of GET /interviews (history AC2)", () => {
    expect(interviewListSchema.parse(page)).toEqual(page);
  });

  it("accepts an empty page", () => {
    expect(interviewListSchema.parse({ items: [], total: 0, limit: 10, offset: 0 }).items).toEqual([]);
  });

  it("rejects an unknown status rather than rendering it (history EC10)", () => {
    const body = { ...page, items: [interviewListItem({ status: "paused" as never })] };

    expect(issuesFor(interviewListSchema.safeParse(body))).toEqual(["items.0.status"]);
  });

  it.each(["total", "items"])("rejects a page without %s (history EC10)", (field) => {
    const body = Object.fromEntries(Object.entries(page).filter(([key]) => key !== field));

    expect(issuesFor(interviewListSchema.safeParse(body))).toEqual([field]);
  });

  it("rejects a row without answered_count", () => {
    const row = Object.fromEntries(Object.entries(interviewListItem()).filter(([key]) => key !== "answered_count"));

    expect(issuesFor(interviewListSchema.safeParse({ ...page, items: [row] }))).toEqual(["items.0.answered_count"]);
  });

  it("accepts the timestamps cuewise-be sends and rejects one that isn't a date (history EC10)", () => {
    const at = (created_at: string) => interviewListSchema.safeParse({ ...page, items: [interviewListItem({ created_at })] });

    expect(at("2026-11-04T18:39:33.167367Z").success).toBe(true);
    expect(at("2026-11-04T18:39:33.167367+00:00").success).toBe(true);
    expect(issuesFor(at("yesterday"))).toEqual(["items.0.created_at"]);
  });
});

describe("feedbackSchema (GET and POST /interviews/{id}/feedback)", () => {
  const withQuestion = (overrides: Parameters<typeof feedbackQuestion>[0]) =>
    feedback({ questions: [feedbackQuestion(overrides)] });

  it("parses a generated feedback with scores, notes and evidence (AC4, AC5)", () => {
    expect(feedbackSchema.parse(feedback())).toEqual(feedback());
  });

  it("parses the not-enough-answers result: no overall, no questions (EC19)", () => {
    const insufficient = feedback({ enough_evidence: false, overall: null, questions: [], strengths: [], improvements: [], next_steps: [] });

    expect(feedbackSchema.safeParse(insufficient).success).toBe(true);
  });

  it.each(["generating", "failed"] as const)("parses a %s row with nothing in it yet", (status) => {
    expect(feedbackSchema.safeParse(emptyFeedback(status)).success).toBe(true);
  });

  it("accepts a question that only has its own category's four criteria (EC23)", () => {
    const technical = withQuestion({ category: "technical", scores: { correctness: 5, depth: 1, trade_offs: 2, clarity: 3 } });

    expect(feedbackSchema.safeParse(technical).success).toBe(true);
  });

  it("accepts a question with no note and no evidence (EC21, EC22)", () => {
    expect(feedbackSchema.safeParse(withQuestion({ note: null, evidence: [] })).success).toBe(true);
  });

  it("rejects an unknown criterion in the scores or the evidence (EC20)", () => {
    const inScores = withQuestion({ scores: { structure: 3, charisma: 4 } as never });
    const inEvidence = withQuestion({ evidence: [{ criterion: "charisma" as never, quote: "I set up the meeting myself", reason: "x" }] });

    expect(feedbackSchema.safeParse(inScores).success).toBe(false);
    expect(feedbackSchema.safeParse(inEvidence).success).toBe(false);
  });

  it.each([0, 6, 3.5])("rejects the score %s (EC20)", (score) => {
    expect(feedbackSchema.safeParse(withQuestion({ scores: { structure: score } })).success).toBe(false);
  });

  it("rejects an unknown status or category (EC20)", () => {
    expect(feedbackSchema.safeParse(feedback({ status: "queued" as never })).success).toBe(false);
    expect(feedbackSchema.safeParse(withQuestion({ category: "design" as never })).success).toBe(false);
  });
});
