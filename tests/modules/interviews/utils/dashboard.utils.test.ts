import { describe, expect, it } from "vitest";

import { completionRate, countThisWeek, getFeedbackSnapshot } from "@/modules/interviews/utils/dashboard.utils";
import { emptyFeedback, feedback, interviewListItem } from "@tests/helpers/interviews";

/** A row started at this local date and time (month is 1-based here, so cases read like a calendar). */
const startedAt = (year: number, month: number, day: number, hours = 12, minutes = 0) =>
  interviewListItem({ created_at: new Date(year, month - 1, day, hours, minutes).toISOString() });

// Wednesday 18 Nov 2026, local time: its week runs from Monday 16 Nov 00:00 to Monday 23 Nov 00:00.
const NOW = new Date(2026, 10, 18, 15, 0);

describe("countThisWeek", () => {
  it("counts nothing when no interview is from this week", () => {
    expect(countThisWeek([startedAt(2026, 11, 10)], 1, NOW)).toEqual({ count: 0, capped: false });
  });

  it("counts only the interviews of this week", () => {
    const items = [startedAt(2026, 11, 18), startedAt(2026, 11, 16, 9), startedAt(2026, 11, 12)];
    expect(countThisWeek(items, 3, NOW)).toEqual({ count: 2, capped: false });
  });

  it("starts the week on Monday 00:00 local time, not on Sunday 23:59 (EC6)", () => {
    const items = [startedAt(2026, 11, 16, 0, 0), startedAt(2026, 11, 15, 23, 59)];
    expect(countThisWeek(items, 2, NOW)).toEqual({ count: 1, capped: false });
  });

  it("counts back to that week's Monday when today is Sunday", () => {
    const sunday = new Date(2026, 10, 22, 20, 0);
    const items = [startedAt(2026, 11, 22, 8), startedAt(2026, 11, 16, 0, 0), startedAt(2026, 11, 15, 22)];
    expect(countThisWeek(items, 3, sunday)).toEqual({ count: 2, capped: false });
  });

  it("is capped when every row is from this week and more interviews exist (EC5)", () => {
    const items = Array.from({ length: 50 }, () => startedAt(2026, 11, 17));
    expect(countThisWeek(items, 51, NOW)).toEqual({ count: 50, capped: true });
  });

  it("is not capped when the rows are all there is", () => {
    const items = Array.from({ length: 50 }, () => startedAt(2026, 11, 17));
    expect(countThisWeek(items, 50, NOW)).toEqual({ count: 50, capped: false });
  });

  it("counts nothing for an empty list", () => {
    expect(countThisWeek([], 0, NOW)).toEqual({ count: 0, capped: false });
  });
});

describe("completionRate", () => {
  it("is null when there is nothing to divide by (EC2)", () => {
    expect(completionRate(0, 0)).toBeNull();
  });

  it("is the completed share of every interview, as a whole percent", () => {
    expect(completionRate(3, 4)).toBe(75);
    expect(completionRate(5, 5)).toBe(100);
    expect(completionRate(0, 2)).toBe(0);
  });

  it("rounds to the nearest whole percent", () => {
    expect(completionRate(1, 3)).toBe(33);
    expect(completionRate(2, 3)).toBe(67);
  });
});

describe("getFeedbackSnapshot", () => {
  it("is pending when no feedback was requested yet (EC8)", () => {
    expect(getFeedbackSnapshot(null)).toEqual({ kind: "pending", reason: "none" });
  });

  it("is pending while the feedback is generating (EC8)", () => {
    expect(getFeedbackSnapshot(emptyFeedback("generating"))).toEqual({ kind: "pending", reason: "generating" });
  });

  it("is pending when generating failed (EC8)", () => {
    expect(getFeedbackSnapshot(emptyFeedback("failed"))).toEqual({ kind: "pending", reason: "failed" });
  });

  it("shows the summary without a score when there was too little to assess (EC9)", () => {
    const lowEvidence = feedback({ enough_evidence: false, overall: null, summary: "Too short to assess." });
    expect(getFeedbackSnapshot(lowEvidence)).toEqual({ kind: "summary", summary: "Too short to assess." });
  });

  it("shows the summary when a generated row has no overall score (code-derived)", () => {
    expect(getFeedbackSnapshot(feedback({ overall: null }))).toEqual({ kind: "summary", summary: feedback().summary });
  });

  it("shows the score and the first improvement as the takeaway", () => {
    expect(getFeedbackSnapshot(feedback())).toEqual({ kind: "score", overall: 3.6, takeaway: "Name the trade-offs" });
  });

  it("falls back to the first next step when there are no improvements (EC10)", () => {
    expect(getFeedbackSnapshot(feedback({ improvements: [] }))).toEqual({
      kind: "score",
      overall: 3.6,
      takeaway: "Practise one system design question.",
    });
  });

  it("has no takeaway when there are neither improvements nor next steps (EC10)", () => {
    expect(getFeedbackSnapshot(feedback({ improvements: [], next_steps: [] }))).toEqual({
      kind: "score",
      overall: 3.6,
      takeaway: null,
    });
  });
});
