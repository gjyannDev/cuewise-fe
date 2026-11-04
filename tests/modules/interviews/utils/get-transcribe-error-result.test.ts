import { describe, expect, it } from "vitest";

import { NoResponseError } from "@/lib/config/api.helper";
import {
  RECORDING_FAILED_MESSAGE,
  TRANSCRIPTION_ERROR_MESSAGES,
  TRANSCRIPTION_UNAVAILABLE_MESSAGE,
} from "@/modules/interviews/constants";
import { getTranscribeErrorResult } from "@/modules/interviews/utils/get-transcribe-error-result";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

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
