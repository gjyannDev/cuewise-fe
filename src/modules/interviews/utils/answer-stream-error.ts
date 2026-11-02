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
