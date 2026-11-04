import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/api.client";
import { ApiResponseError, NoResponseError } from "@/lib/config/api.helper";
import { redirectIfSessionEnded } from "@/lib/config/session-redirect";
import { START_TIMEOUT_MS } from "@/modules/interviews/constants";
import { interviewsService } from "@/modules/interviews/services/interviews.services";
import { AnswerStreamError } from "@/modules/interviews/utils/answer-stream-error";
import { errorBody } from "@tests/helpers/axios";
import { sseFrame, streamOf } from "@tests/helpers/sse";

// apiClient already unwraps `res.data`, so the mocks resolve with the payload itself.
vi.mock("@/lib/api/api.client", () => ({ apiClient: { get: vi.fn(), post: vi.fn() } }));
vi.mock("@/lib/config/session-redirect", () => ({ redirectIfSessionEnded: vi.fn() }));

const post = vi.mocked(apiClient.post);
const get = vi.mocked(apiClient.get);

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
    question_kind: "main",
    main_number: 1,
  },
} as const;

describe("interviewsService", () => {
  beforeEach(() => {
    post.mockReset();
    get.mockReset();
  });

  it("start posts the request body to /interviews with the start timeout and returns the parsed interview", async () => {
    post.mockResolvedValue(interview);
    const body = { role: "backend", level: "junior", interview_type: "mixed", question_count: 5 } as const;

    await expect(interviewsService.start(body)).resolves.toEqual(interview);
    expect(post).toHaveBeenCalledWith("/interviews", body, { timeout: START_TIMEOUT_MS });
  });

  it("get requests the interview by id", async () => {
    get.mockResolvedValue(interview);

    await expect(interviewsService.get(ID)).resolves.toEqual(interview);
    expect(get).toHaveBeenCalledWith(`/interviews/${ID}`);
  });

  it("rejects a response that doesn't match the contract", async () => {
    get.mockResolvedValue({ session: { id: ID } });

    await expect(interviewsService.get(ID)).rejects.toThrow();
  });

  describe("answerStream", () => {
    const fetchMock = vi.fn<typeof fetch>();
    const redirect = vi.mocked(redirectIfSessionEnded);
    const QUESTION = interview.current_question.id;
    const nextQuestion = { ...interview.current_question, id: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d", position: 2 };
    const moveOn = {
      session: interview.session,
      reaction: { id: "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b", text: "Thanks for sharing that." },
      current_question: { ...nextQuestion, main_number: 2 },
    };
    const sse = (...chunks: string[]) =>
      new Response(streamOf(...chunks), { status: 200, headers: { "content-type": "text/event-stream" } });
    const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

    async function drain(params = { question_id: QUESTION, answer: "We talked it through." }, signal?: AbortSignal) {
      const events = [];
      for await (const event of interviewsService.answerStream(ID, params, signal)) {
        events.push(event);
      }
      return events;
    }

    beforeEach(() => {
      fetchMock.mockReset();
      redirect.mockReset();
      vi.stubGlobal("fetch", fetchMock);
    });
    afterEach(() => vi.unstubAllGlobals());

    it("posts exactly question_id and the trimmed answer to the stream route (extra keys stripped)", async () => {
      fetchMock.mockResolvedValueOnce(sse(sseFrame("done", moveOn)));

      await drain({ question_id: QUESTION, answer: "  Yes  ", note: "x" } as never);

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(`/api/interviews/${ID}/messages/stream`);
      expect(init?.method).toBe("POST");
      expect(new Headers(init?.headers).get("accept")).toBe("text/event-stream");
      expect(JSON.parse(String(init?.body))).toEqual({ question_id: QUESTION, answer: "Yes" });
    });

    it("yields the events in order and stops after done (AC7)", async () => {
      fetchMock.mockResolvedValueOnce(
        sse(
          sseFrame("status", { phase: "received" }),
          sseFrame("reaction", moveOn.reaction) + sseFrame("question.delta", { text: "Tell " }),
          sseFrame("done", moveOn),
          sseFrame("status", { phase: "writing" }),
        ),
      );

      expect((await drain()).map((e) => e.event)).toEqual(["status", "reaction", "question.delta", "done"]);
    });

    it("yields a follow-up done with reaction null", async () => {
      const followUp = { ...moveOn, reaction: null, current_question: { ...nextQuestion, question_kind: "follow_up" } };
      fetchMock.mockResolvedValueOnce(sse(sseFrame("done", followUp)));

      expect(await drain()).toEqual([{ event: "done", data: followUp }]);
    });

    it("skips an unknown event (EC9)", async () => {
      fetchMock.mockResolvedValueOnce(sse(sseFrame("progress", { pct: 1 }), sseFrame("done", moveOn)));

      expect((await drain()).map((e) => e.event)).toEqual(["done"]);
    });

    it("throws interrupted for a done without a reaction key (EC10)", async () => {
      const broken: Record<string, unknown> = { ...moveOn };
      delete broken.reaction;
      fetchMock.mockResolvedValueOnce(sse(sseFrame("done", broken)));

      await expect(drain()).rejects.toEqual(new AnswerStreamError("interrupted"));
    });

    it.each([
      [409, "QUESTION_NOT_CURRENT"],
      [422, "VALIDATION_ERROR"],
    ])("throws ApiResponseError for a %i before the stream (EC2, EC3)", async (status, code) => {
      fetchMock.mockResolvedValueOnce(json(status, errorBody(code, "Nope")));

      const error = await drain().catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiResponseError);
      expect(error).toMatchObject({ status, body: errorBody(code, "Nope") });
    });

    it("hands a 401 to the shared session redirect before throwing (EC1)", async () => {
      fetchMock.mockResolvedValueOnce(json(401, errorBody("TOKEN_EXPIRED", "Expired")));

      await expect(drain()).rejects.toBeInstanceOf(ApiResponseError);
      expect(redirect).toHaveBeenCalledWith(401, errorBody("TOKEN_EXPIRED", "Expired"));
    });

    it("throws NoResponseError when fetch fails (EC4)", async () => {
      fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(drain()).rejects.toBeInstanceOf(NoResponseError);
    });

    it("rethrows an abort as is (EC17)", async () => {
      const controller = new AbortController();
      controller.abort();
      fetchMock.mockRejectedValueOnce(new DOMException("aborted", "AbortError"));

      await expect(drain(undefined, controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    });
  });

  it("messages requests the session's transcript and returns the parsed items", async () => {
    const transcript = {
      items: [
        {
          id: interview.current_question.id,
          question_id: interview.current_question.id,
          position: 1,
          role: "interviewer",
          kind: "question",
          text: interview.current_question.text,
          created_at: null,
          question_kind: "main",
          main_number: 1,
        },
      ],
    };
    get.mockResolvedValue(transcript);

    await expect(interviewsService.messages(ID)).resolves.toEqual(transcript);
    expect(get).toHaveBeenCalledWith(`/interviews/${ID}/messages`);
  });

  it("messages rejects a transcript that doesn't match the contract", async () => {
    get.mockResolvedValue({ items: [{ id: ID, kind: "question" }] });

    await expect(interviewsService.messages(ID)).rejects.toThrow();
  });
});
