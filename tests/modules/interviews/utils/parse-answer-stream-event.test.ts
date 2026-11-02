import { describe, expect, it } from "vitest";

import { parseAnswerStreamEvent } from "@/modules/interviews/utils/parse-answer-stream-event";
import { answerResponse, Q2, REACTION } from "@tests/helpers/interviews";

const frame = (event: string, data: unknown) => ({ event, data: typeof data === "string" ? data : JSON.stringify(data) });

describe("parseAnswerStreamEvent", () => {
  it.each([
    ["status", { phase: "deciding" }],
    ["reaction", REACTION],
    ["question.delta", { text: "Tell me " }],
    ["reset", {}],
    ["done", answerResponse({ id: Q2, position: 2 })],
    ["error", { code: "INTERNAL_ERROR", message: "An unexpected error occurred", request_id: "r1" }],
  ])("parses a %s event (AC5)", (event, data) => {
    expect(parseAnswerStreamEvent(frame(event, data))).toEqual({ kind: "event", event: { event, data } });
  });

  it("ignores extra fields", () => {
    expect(parseAnswerStreamEvent(frame("question.delta", { text: "Hi", extra: 1 }))).toEqual({
      kind: "event",
      event: { event: "question.delta", data: { text: "Hi" } },
    });
  });

  it("reports an unknown event name as unknown (EC9)", () => {
    expect(parseAnswerStreamEvent(frame("progress", { pct: 3 }))).toEqual({ kind: "unknown" });
  });

  it.each([
    ["status", "{not json"],
    ["status", { phase: "thinking" }],
    ["question.delta", {}],
    ["error", { code: "X" }],
  ])("reports bad %s data as invalid (EC10)", (event, data) => {
    expect(parseAnswerStreamEvent(frame(event, data))).toEqual({ kind: "invalid" });
  });

  it("accepts a follow-up done (reaction null) but not a done without a reaction key (EC10)", () => {
    const followUp = answerResponse({ id: Q2, position: 2, question_kind: "follow_up", main_number: 1 }, null);
    expect(parseAnswerStreamEvent(frame("done", followUp)).kind).toBe("event");

    const noReaction: Record<string, unknown> = { ...followUp };
    delete noReaction.reaction;
    expect(parseAnswerStreamEvent(frame("done", noReaction))).toEqual({ kind: "invalid" });
  });
});
