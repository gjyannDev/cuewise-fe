import type { SseFrame } from "@/lib/api/sse";

import { answerStreamEventSchemas } from "../schemas/interviews.schema";
import type {
  AnswerResponse,
  AnswerStreamEvent,
  AnswerStreamEventName,
  TranscriptItem,
} from "../types/interviews.types";

/**
 * A streamed answer turn that didn't end with `done`. `event`: cuewise-be sent an `error` event (`code` is its code;
 * nothing was saved). `interrupted`: the stream stopped without a terminal event, carried data that broke the
 * contract, or ran out of time; the backend may or may not have saved the turn, so the screen re-checks.
 */
export class AnswerStreamError extends Error {
  constructor(
    readonly kind: "event" | "interrupted",
    readonly code?: string,
  ) {
    super(kind === "event" ? `Answer stream error: ${code}` : "Answer stream interrupted");
    this.name = "AnswerStreamError";
  }
}

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

type StreamData<Name extends AnswerStreamEvent["event"]> = Extract<AnswerStreamEvent, { event: Name }>["data"];

/** A streamed answer turn as it arrives. Transient: never written to the cache; `done` is the saved turn. */
export type AnswerStreamState = {
  phase?: StreamData<"status">["phase"];
  reaction?: StreamData<"reaction">;
  /** The question text so far (empty after a `reset`). */
  questionText: string;
  /** A reaction means the interview moves on, so the question being written is the next main one. */
  sawReaction: boolean;
  done?: AnswerResponse;
  error?: StreamData<"error">;
};

export const ANSWER_STREAM_START: AnswerStreamState = { questionText: "", sawReaction: false };

/** One event applied to the turn so far. `done` and `error` end it: later events change nothing. */
export function reduceAnswerStream(state: AnswerStreamState, event: AnswerStreamEvent): AnswerStreamState {
  if (state.done || state.error) {
    return state;
  }
  switch (event.event) {
    case "status":
      return { ...state, phase: event.data.phase };
    case "reaction":
      return { ...state, reaction: event.data, sawReaction: true };
    case "question.delta":
      return { ...state, questionText: state.questionText + event.data.text };
    case "reset":
      return { ...state, questionText: "" };
    case "done":
      return { ...state, done: event.data };
    case "error":
      return { ...state, error: event.data };
  }
}

/**
 * Where the question being streamed will sit, before the saved one says so: right after the answered question.
 * After a reaction it is the next main question; without one, a follow-up in the same thread. `done` corrects it in
 * the rare case the backend falls back to a main question.
 */
export function inferStreamingQuestion(
  answered: Pick<TranscriptItem, "position" | "main_number">,
  sawReaction: boolean,
): Pick<TranscriptItem, "position" | "question_kind" | "main_number"> {
  return sawReaction
    ? { position: answered.position + 1, question_kind: "main", main_number: answered.main_number + 1 }
    : { position: answered.position + 1, question_kind: "follow_up", main_number: answered.main_number };
}
