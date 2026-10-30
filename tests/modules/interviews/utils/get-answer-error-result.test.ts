import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { getAnswerErrorResult } from "@/modules/interviews/utils/get-answer-error-result";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

describe("getAnswerErrorResult", () => {
  // Codes verified against cuewise-be app/core/errors.py.
  it.each([
    ["QUESTION_NOT_CURRENT", "This is not the current question of the interview"],
    ["SESSION_NOT_IN_PROGRESS", "This interview is not in progress"],
  ])("resyncs on a 409 %s", (code, message) => {
    expect(getAnswerErrorResult(axiosErrorWith(409, errorBody(code, message)))).toEqual({ kind: "resync" });
  });

  it("resyncs on a 404 so the refetch shows the not-found state", () => {
    expect(getAnswerErrorResult(axiosErrorWith(404, errorBody("NOT_FOUND", "Interview not found")))).toEqual({
      kind: "resync",
    });
  });

  it("puts a 422 on the answer under the answer field", () => {
    const error = axiosErrorWith(
      422,
      errorBody("VALIDATION_ERROR", "Invalid input", [
        { field: "body.answer", issue: "String should have at most 2000 characters" },
      ]),
    );

    expect(getAnswerErrorResult(error)).toEqual({
      kind: "field",
      message: "String should have at most 2000 characters",
    });
  });

  it.each([
    [
      "a 422 that doesn't name the answer",
      axiosErrorWith(
        422,
        errorBody("VALIDATION_ERROR", "Invalid input", [{ field: "body.extra", issue: "Extra inputs are not permitted" }]),
      ),
    ],
    ["a 409 with another code", axiosErrorWith(409, errorBody("CONFLICT", "Conflict"))],
    ["a 500", axiosErrorWith(500, errorBody("INTERNAL_ERROR", "Something broke"))],
    ["a malformed response (zod error)", new Error("Invalid input: expected object")],
  ])("toasts %s", (_, error) => {
    expect(getAnswerErrorResult(error)).toEqual({ kind: "toast" });
  });

  it.each([
    ["a network error", networkError()],
    ["a timeout", new AxiosError("timeout of 45000ms exceeded", "ECONNABORTED")],
    ["the /api forwarder's 503", axiosErrorWith(503, errorBody("SERVICE_UNAVAILABLE", "Something went wrong"))],
  ])("treats %s as an unknown outcome (the answer may have been saved)", (_, error) => {
    expect(getAnswerErrorResult(error)).toEqual({ kind: "unknown" });
  });
});
