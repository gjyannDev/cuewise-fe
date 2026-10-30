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

  it("answer posts exactly question_id and answer to the session's messages and returns the parsed turn", async () => {
    const turn = {
      session: interview.session,
      reaction: { id: "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b", text: "Thanks for sharing that." },
      current_question: { ...interview.current_question, id: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d", position: 2 },
    };
    post.mockResolvedValue(ok(turn, 201));
    const body = { question_id: interview.current_question.id, answer: "We talked it through." };

    await expect(interviewsService.answer(ID, body)).resolves.toEqual(turn);
    expect(post).toHaveBeenCalledWith(`/interviews/${ID}/messages`, body);
  });

  it("answer sends a trimmed answer and no extra keys (cuewise-be rejects them)", async () => {
    post.mockResolvedValue(
      ok({ session: interview.session, reaction: { id: ID, text: "Got it, thanks." }, current_question: null }, 201),
    );
    const params = { question_id: interview.current_question.id, answer: "  Yes  ", note: "x" };

    await interviewsService.answer(ID, params);

    expect(post).toHaveBeenCalledWith(`/interviews/${ID}/messages`, {
      question_id: interview.current_question.id,
      answer: "Yes",
    });
  });

  it("answer rejects a turn without a reaction", async () => {
    post.mockResolvedValue(ok({ session: interview.session, current_question: null }, 201));

    await expect(
      interviewsService.answer(ID, { question_id: interview.current_question.id, answer: "Yes" }),
    ).rejects.toThrow();
  });
});
