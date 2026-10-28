import { beforeEach, describe, expect, it, vi } from "vitest";

import { API } from "@/lib/config/axios.client";
import { interviewsService } from "@/modules/interviews/services/interviews.services";
import { ok } from "@tests/helpers/axios";

vi.mock("@/lib/config/axios.client", () => ({ API: { get: vi.fn(), post: vi.fn() } }));

const post = vi.mocked(API.post);
const get = vi.mocked(API.get);

const ID = "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f";
const interview = {
  session: {
    id: ID,
    role: "backend",
    level: "junior",
    interview_type: "mixed",
    question_count: 5,
    job_description: null,
    status: "in_progress",
    created_at: "2026-10-28T09:00:00Z",
  },
  current_question: {
    id: "6f5e4d3c-2b1a-4f9e-8d7c-6b5a4f3e2d1c",
    position: 1,
    text: "Tell me about a time you disagreed with a teammate.",
    category: "behavioral",
  },
} as const;

describe("interviewsService", () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it("start posts the request body to /interviews and returns the parsed interview", async () => {
    post.mockResolvedValue(ok(interview, 201));
    const body = { role: "backend", level: "junior", interview_type: "mixed", question_count: 5 } as const;

    await expect(interviewsService.start(body)).resolves.toEqual(interview);
    expect(post).toHaveBeenCalledWith("/interviews", body);
  });

  it("get requests the interview by id", async () => {
    get.mockResolvedValue(ok(interview));

    await expect(interviewsService.get(ID)).resolves.toEqual(interview);
    expect(get).toHaveBeenCalledWith(`/interviews/${ID}`);
  });

  it("rejects a response that doesn't match the contract", async () => {
    get.mockResolvedValue(ok({ session: { id: ID } }));

    await expect(interviewsService.get(ID)).rejects.toThrow();
  });
});
