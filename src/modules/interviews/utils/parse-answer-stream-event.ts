import type { SseFrame } from "@/lib/api/sse";

import { answerStreamEventSchemas } from "../schemas/interviews.schema";
import type { AnswerStreamEvent, AnswerStreamEventName } from "../types/interviews.types";

export type ParsedStreamEvent = { kind: "event"; event: AnswerStreamEvent } | { kind: "unknown" } | { kind: "invalid" };

const isKnown = (name: string): name is AnswerStreamEventName => Object.hasOwn(answerStreamEventSchemas, name);

/**
 * A raw SSE frame as a typed answer-stream event. An unknown name is `unknown` (cuewise-be may add events; the turn
 * goes on). Bad JSON or data that breaks a known event's contract is `invalid` (the turn can't be trusted).
 */
export function parseAnswerStreamEvent({ event, data }: SseFrame): ParsedStreamEvent {
  if (!isKnown(event)) {
    return { kind: "unknown" };
  }
  let json: unknown;
  try {
    json = JSON.parse(data);
  } catch {
    return { kind: "invalid" };
  }
  const parsed = answerStreamEventSchemas[event].safeParse(json);
  return parsed.success ? { kind: "event", event: { event, data: parsed.data } as AnswerStreamEvent } : { kind: "invalid" };
}
