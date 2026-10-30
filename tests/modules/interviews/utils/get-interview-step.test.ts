import { describe, expect, it } from "vitest";

import type { Interview } from "@/modules/interviews/types/interviews.types";
import { getInterviewStep } from "@/modules/interviews/utils/get-interview-step";

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
});
