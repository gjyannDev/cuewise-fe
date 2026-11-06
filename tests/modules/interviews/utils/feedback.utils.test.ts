import { describe, expect, it } from "vitest";

import { ApiResponseError, NoResponseError } from "@/lib/config/api.helper";
import type { FeedbackErrorResult, FeedbackViewInput } from "@/modules/interviews/types/interviews.types";
import {
  FeedbackLostError,
  formatOverall,
  getFeedbackErrorResult,
  getFeedbackView,
  parseFeedbackStartParam,
  questionScores,
  scorePercent,
  shouldStartOnArrival,
} from "@/modules/interviews/utils/feedback.utils";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";
import { emptyFeedback, feedback, feedbackQuestion } from "@tests/helpers/interviews";

describe("scorePercent", () => {
  it.each([
    [1, 20],
    [3, 60],
    [5, 100],
  ])("fills the bar for %i / 5 to %i%%", (score, percent) => {
    expect(scorePercent(score)).toBe(percent);
  });
});

describe("formatOverall", () => {
  it.each([
    [3.6, "3.6"],
    [4, "4.0"],
    [1, "1.0"],
  ])("shows %s as %s, one decimal as the backend stores it (AC4)", (overall, shown) => {
    expect(formatOverall(overall)).toBe(shown);
  });
});

describe("questionScores", () => {
  it("lists a question's criteria in rubric order with their labels (AC5)", () => {
    const question = feedbackQuestion({ scores: { outcome: 2, structure: 4, ownership: 5, specificity: 3 } });

    expect(questionScores(question)).toEqual([
      { criterion: "structure", label: "Structure", score: 4 },
      { criterion: "specificity", label: "Specific detail", score: 3 },
      { criterion: "ownership", label: "Your own role", score: 5 },
      { criterion: "outcome", label: "Outcome", score: 2 },
    ]);
  });

  it("shows only the criteria the question has (EC23)", () => {
    const question = feedbackQuestion({ category: "technical", scores: { trade_offs: 2, correctness: 4 } });

    expect(questionScores(question).map((row) => row.label)).toEqual(["Correctness", "Trade-offs"]);
  });
});

const response = (status: number, code: string) => axiosErrorWith(status, errorBody(code, "Backend text"));

describe("getFeedbackErrorResult", () => {
  it.each([
    ["no response (browser timeout or network drop)", networkError()],
    ["a fetch that got no response", new NoResponseError()],
    ["the forwarder's 503 when it gave up", response(503, "SERVICE_UNAVAILABLE")],
    ["409 FEEDBACK_IN_PROGRESS", response(409, "FEEDBACK_IN_PROGRESS")],
  ])("reads the stored feedback after %s (AC7, EC10, EC12)", (_case, error) => {
    expect(getFeedbackErrorResult(error)).toEqual({ kind: "poll" });
  });

  it("sends an unfinished interview to the continue card (EC3)", () => {
    expect(getFeedbackErrorResult(response(409, "INTERVIEW_NOT_COMPLETED"))).toEqual({ kind: "notCompleted" });
  });

  it("treats a plain 404 as an interview that isn't the caller's (EC2)", () => {
    expect(getFeedbackErrorResult(response(404, "NOT_FOUND"))).toEqual({ kind: "notFound" });
  });

  it("maps 502 FEEDBACK_FAILED to the failed card (EC14)", () => {
    expect(getFeedbackErrorResult(response(502, "FEEDBACK_FAILED"))).toEqual({ kind: "failed" });
  });

  it("maps a lost generation (no response, nothing stored) to the failed card (EC11)", () => {
    expect(getFeedbackErrorResult(new FeedbackLostError())).toEqual({ kind: "failed" });
  });

  it("maps 503 FEEDBACK_UNAVAILABLE to the unavailable card (EC15)", () => {
    expect(getFeedbackErrorResult(response(503, "FEEDBACK_UNAVAILABLE"))).toEqual({ kind: "unavailable" });
  });

  it("only toasts a 429 (EC16)", () => {
    expect(getFeedbackErrorResult(response(429, "RATE_LIMITED"))).toEqual({ kind: "rateLimited" });
  });

  it.each([
    ["403 (no permission)", response(403, "FORBIDDEN")],
    ["a 500", response(500, "INTERNAL_ERROR")],
    ["a fetch error response", new ApiResponseError(418, null)],
    ["a response that failed the contract", new Error("zod")],
  ])("treats %s as unknown, never showing its text (EC18, EC20)", (_case, error) => {
    expect(getFeedbackErrorResult(error)).toEqual({ kind: "unknown" });
  });
});

const idle: FeedbackViewInput = {
  stored: null,
  isGenerating: false,
  startRequested: false,
  isStalled: false,
};
const view = (overrides: Partial<FeedbackViewInput>) => getFeedbackView({ ...idle, ...overrides });
const error = (kind: FeedbackErrorResult["kind"]): FeedbackErrorResult => ({ kind });

describe("getFeedbackView", () => {
  it("shows the skeleton while the stored feedback loads", () => {
    expect(view({ stored: undefined })).toEqual({ kind: "loading" });
  });

  it("asks before generating when nothing is stored (AC3, EC4)", () => {
    expect(view({ stored: null })).toEqual({ kind: "none" });
  });

  it("goes straight to generating when the closing card asked for it (AC2, EC5)", () => {
    expect(view({ stored: null, startRequested: true })).toEqual({ kind: "generating" });
  });

  it("shows generating while the POST runs", () => {
    expect(view({ stored: null, isGenerating: true })).toEqual({ kind: "generating" });
  });

  it("shows generating for a stored generating row, e.g. after a reload (EC6, EC12)", () => {
    expect(view({ stored: emptyFeedback("generating") })).toEqual({ kind: "generating" });
  });

  it("offers a new try once a generating row has stalled (EC13)", () => {
    expect(view({ stored: emptyFeedback("generating"), isStalled: true })).toEqual({ kind: "stalled" });
  });

  it("shows the result of a generated feedback (AC4, EC7)", () => {
    const result = feedback();

    expect(view({ stored: result })).toEqual({ kind: "generated", feedback: result });
  });

  it("shows the backend's message when there were too few answers (AC10, EC19)", () => {
    const insufficient = feedback({ enough_evidence: false, overall: null, questions: [], summary: "Answer more." });

    expect(view({ stored: insufficient })).toEqual({ kind: "insufficient", message: "Answer more." });
  });

  it("shows the failed card for a stored failed row (AC9)", () => {
    expect(view({ stored: emptyFeedback("failed") })).toEqual({ kind: "failed" });
  });

  it.each(["notCompleted", "notFound", "failed", "unavailable", "unknown"] as const)(
    "shows the %s screen when the POST failed that way (AC9)",
    (kind) => {
      expect(view({ stored: null, generateError: error(kind) })).toEqual({ kind });
    },
  );

  it("keeps the previous screen after a 429 (EC16)", () => {
    expect(view({ stored: null, generateError: error("rateLimited") })).toEqual({ kind: "none" });
  });

  it("shows the generic error when neither the POST nor the recovery read got an answer (AC7)", () => {
    expect(view({ stored: null, generateError: error("poll") })).toEqual({ kind: "unknown" });
  });

  it("shows not found when the read says the interview isn't the caller's (EC2)", () => {
    expect(view({ stored: undefined, queryError: error("notFound") })).toEqual({ kind: "notFound" });
  });

  it("shows the generic error when the read failed with nothing cached (EC20)", () => {
    expect(view({ stored: undefined, queryError: error("unknown") })).toEqual({ kind: "unknown" });
  });

  it("keeps a stored result when a background refetch fails", () => {
    const result = feedback();

    expect(view({ stored: result, queryError: error("unknown") })).toEqual({ kind: "generated", feedback: result });
  });
});

describe("shouldStartOnArrival", () => {
  it("starts when the card asked and nothing is stored yet (AC2)", () => {
    expect(shouldStartOnArrival({ startFlag: true, stored: null })).toBe(true);
  });

  it.each([
    ["no flag", { startFlag: false, stored: null }],
    ["still loading", { startFlag: true, stored: undefined }],
    ["already generated", { startFlag: true, stored: feedback() }],
    ["already generating", { startFlag: true, stored: emptyFeedback("generating") }],
    ["a failed row (Try again asks)", { startFlag: true, stored: emptyFeedback("failed") }],
  ])("doesn't start with %s (AC3, EC6, EC7)", (_case, input) => {
    expect(shouldStartOnArrival(input)).toBe(false);
  });
});

describe("parseFeedbackStartParam", () => {
  it("is true only for a single ?start=1 from the closing card (AC2)", () => {
    expect(parseFeedbackStartParam("1")).toBe(true);
  });

  it.each([undefined, "", "0", "true", "yes", " 1"])("ignores %j: the page asks before generating (AC3)", (raw) => {
    expect(parseFeedbackStartParam(raw)).toBe(false);
  });

  it("ignores a repeated flag", () => {
    expect(parseFeedbackStartParam(["1", "1"])).toBe(false);
  });
});
