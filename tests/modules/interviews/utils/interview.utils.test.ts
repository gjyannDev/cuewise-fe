import { describe, expect, it } from "vitest";

import type { Interview } from "@/modules/interviews/types/interviews.types";
import { getInterviewStep, getStartErrorResult, parseSessionParam } from "@/modules/interviews/utils/interview.utils";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

const ID = "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f";

describe("parseSessionParam", () => {
  it.each([undefined, ""])("treats %j as no session", (raw) => {
    expect(parseSessionParam(raw)).toEqual({ kind: "none" });
  });

  it("accepts a UUID", () => {
    expect(parseSessionParam(ID)).toEqual({ kind: "valid", id: ID });
  });

  it("accepts the UUID v7 ids cuewise-be issues", () => {
    const v7 = "01a181db-fb0e-7386-9cf3-50c73a9c44f3";

    expect(parseSessionParam(v7)).toEqual({ kind: "valid", id: v7 });
  });

  it.each(["abc", "42", `${ID}x`])("marks %j as invalid", (raw) => {
    expect(parseSessionParam(raw)).toEqual({ kind: "invalid" });
  });

  it("marks a repeated param as invalid", () => {
    expect(parseSessionParam([ID, ID])).toEqual({ kind: "invalid" });
  });
});

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

const session: Interview["session"] = {
  id: "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f",
  role: "data",
  level: "mid",
  interview_type: "behavioral",
  question_count: 3,
  job_description: null,
  status: "in_progress",
  created_at: "2026-10-28T09:00:00Z",
};
const question: NonNullable<Interview["current_question"]> = {
  id: "6f5e4d3c-2b1a-4f9e-8d7c-6b5a4f3e2d1c",
  position: 2,
  text: "Tell me about a project you led.",
  category: "behavioral",
  question_kind: "main",
  main_number: 2,
};

describe("getInterviewStep", () => {
  it("is the question step while the interview is in progress", () => {
    expect(getInterviewStep({ session, current_question: question })).toEqual({ kind: "question", question });
  });

  it("is the completed step once the backend reports completed with no question", () => {
    expect(getInterviewStep({ session: { ...session, status: "completed" }, current_question: null })).toEqual({
      kind: "completed",
    });
  });

  it("is the completed step whenever there is no current question, whatever the status says", () => {
    expect(getInterviewStep({ session, current_question: null })).toEqual({ kind: "completed" });
  });

  it("is the ended step for an abandoned session, even if it still has a question (answering would only 409)", () => {
    expect(getInterviewStep({ session: { ...session, status: "abandoned" }, current_question: question })).toEqual({
      kind: "ended",
    });
  });
});
