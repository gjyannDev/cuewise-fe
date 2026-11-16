import { describe, expect, it } from "vitest";

import { NoResponseError } from "@/lib/config/api.helper";
import {
  RECORDING_FAILED_MESSAGE,
  SPEECH_RATE_LIMITED_MESSAGE,
  SPEECH_UNAVAILABLE_MESSAGE,
  TRANSCRIPTION_ERROR_MESSAGES,
  TRANSCRIPTION_UNAVAILABLE_MESSAGE,
} from "@/modules/interviews/constants";
import {
  getSpeechErrorResult,
  getTranscribeErrorResult,
  planSpokenLines,
} from "@/modules/interviews/utils/voice.utils";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";
import { answerResponse, Q2, REACTION } from "@tests/helpers/interviews";

const message = (text: string) => ({ kind: "message", message: text });

describe("getTranscribeErrorResult", () => {
  // Codes and statuses verified against cuewise-be core/errors.py and the transcriptions route.
  it.each([
    [422, "NO_SPEECH", "Didn't catch that. Try again."],
    [422, "AUDIO_TOO_LONG", "Recordings are limited to 2 minutes."],
    [429, "RATE_LIMITED", "Too many recordings. Wait a moment and try again."],
    [413, "AUDIO_TOO_LARGE", RECORDING_FAILED_MESSAGE],
    [415, "UNSUPPORTED_AUDIO", RECORDING_FAILED_MESSAGE],
    [503, "TRANSCRIPTION_UNAVAILABLE", TRANSCRIPTION_UNAVAILABLE_MESSAGE],
  ])("maps a %i %s to its message (EC6, EC12-EC16)", (status, code, text) => {
    expect(getTranscribeErrorResult(axiosErrorWith(status, errorBody(code, "backend text")))).toEqual(message(text));
    expect(TRANSCRIPTION_ERROR_MESSAGES[code]).toBe(text);
  });

  it.each([
    [404, "NOT_FOUND"],
    [409, "SESSION_NOT_IN_PROGRESS"],
  ])("resyncs on a %i %s: the interview moved on or is gone (EC17)", (status, code) => {
    expect(getTranscribeErrorResult(axiosErrorWith(status, errorBody(code, "x")))).toEqual({ kind: "resync" });
  });

  it("shows the unavailable message when there is no response (EC12)", () => {
    expect(getTranscribeErrorResult(networkError())).toEqual(message(TRANSCRIPTION_UNAVAILABLE_MESSAGE));
    expect(getTranscribeErrorResult(new NoResponseError())).toEqual(message(TRANSCRIPTION_UNAVAILABLE_MESSAGE));
  });

  it.each([
    ["an unknown code", axiosErrorWith(500, errorBody("INTERNAL_ERROR", "Boom"))],
    ["a request validation error", axiosErrorWith(422, errorBody("VALIDATION_ERROR", "Invalid"))],
    ["a non-JSON body", axiosErrorWith(502, "<html>Bad gateway</html>")],
    ["a non-HTTP error", new Error("zod said no")],
  ])("never shows backend text for %s", (_, error) => {
    expect(getTranscribeErrorResult(error)).toEqual(message(TRANSCRIPTION_UNAVAILABLE_MESSAGE));
  });
});

describe("planSpokenLines", () => {
  it("speaks the reaction, then the next question (EC10)", () => {
    expect(planSpokenLines(answerResponse({ id: Q2, position: 2 }))).toEqual([
      { kind: "reaction", id: REACTION.id },
      { kind: "question", id: Q2 },
    ]);
  });

  it("speaks only the follow-up when the turn has no reaction (EC10)", () => {
    expect(planSpokenLines(answerResponse({ id: Q2, position: 2, question_kind: "follow_up" }, null))).toEqual([
      { kind: "question", id: Q2 },
    ]);
  });

  it("speaks only the final reaction when the interview completes (EC11)", () => {
    expect(planSpokenLines(answerResponse())).toEqual([{ kind: "reaction", id: REACTION.id }]);
  });
});

describe("getSpeechErrorResult", () => {
  it.each([
    ["no voice configured", axiosErrorWith(503, errorBody("SPEECH_UNAVAILABLE", "backend text"))],
    ["a server error", axiosErrorWith(500, errorBody("INTERNAL_ERROR", "Boom"))],
    ["a network failure", networkError()],
    ["no response", new NoResponseError()],
    ["a non-HTTP error", new Error("not audio")],
  ])("shows the speech message for %s, never backend text (EC3)", (_, error) => {
    expect(getSpeechErrorResult(error)).toEqual({ kind: "message", message: SPEECH_UNAVAILABLE_MESSAGE });
  });

  it("shows the replay limit message on 429 (EC4)", () => {
    expect(getSpeechErrorResult(axiosErrorWith(429, errorBody("RATE_LIMITED", "x")))).toEqual({
      kind: "message",
      message: SPEECH_RATE_LIMITED_MESSAGE,
    });
  });

  it("resyncs on 404: the line isn't speakable for this interview any more", () => {
    expect(getSpeechErrorResult(axiosErrorWith(404, errorBody("NOT_FOUND", "x")))).toEqual({ kind: "resync" });
  });
});
