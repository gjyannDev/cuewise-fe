import { describe, expect, it } from "vitest";

import { getStartErrorResult } from "@/modules/interviews/utils/get-start-error-result";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

describe("getStartErrorResult", () => {
  it("puts a 409 (not enough questions) under the question count", () => {
    // Shape verified against cuewise-be: the code is specific and the details name no form field.
    const error = axiosErrorWith(
      409,
      errorBody("NOT_ENOUGH_QUESTIONS", "Not enough questions for this setup", { requested: 10, available: 7 }),
    );

    expect(getStartErrorResult(error)).toEqual({ question_count: "Not enough questions for this setup" });
  });

  it("maps 422 field errors onto the form fields", () => {
    const error = axiosErrorWith(
      422,
      errorBody("VALIDATION_ERROR", "Invalid input", [
        { field: "body.role", issue: "Input should be 'frontend', 'backend'" },
        { field: "body.question_count", issue: "Input should be less than or equal to 10" },
      ]),
    );

    expect(getStartErrorResult(error)).toEqual({
      role: "Input should be 'frontend', 'backend'",
      question_count: "Input should be less than or equal to 10",
    });
  });

  it("returns null for a 422 that names no form field, so it becomes a toast", () => {
    const error = axiosErrorWith(
      422,
      errorBody("VALIDATION_ERROR", "Invalid input", [{ field: "body.status", issue: "Extra inputs are not permitted" }]),
    );

    expect(getStartErrorResult(error)).toBeNull();
  });

  it.each([
    ["a 500", axiosErrorWith(500, errorBody("INTERNAL_ERROR", "Something broke"))],
    ["a network error", networkError()],
    ["a non-axios error", new Error("boom")],
  ])("returns null for %s", (_, error) => {
    expect(getStartErrorResult(error)).toBeNull();
  });
});
