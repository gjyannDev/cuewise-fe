import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/api.client";
import { ApiResponseError, NoResponseError } from "@/lib/config/api.helper";
import { redirectIfSessionEnded } from "@/lib/config/session-redirect";
import { FEEDBACK_TIMEOUT_MS, START_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS } from "@/modules/interviews/constants";
import { interviewsService } from "@/modules/interviews/services/interviews.services";
import { AnswerStreamError } from "@/modules/interviews/utils/stream.utils";
import { axiosErrorWith, errorBody } from "@tests/helpers/axios";
import { feedback, interviewListItem } from "@tests/helpers/interviews";
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

  describe("list", () => {
    const page = { items: [interviewListItem()], total: 1, limit: 10, offset: 20 };

    it("requests one page of /interviews with the query params and returns the parsed page (history AC2)", async () => {
      get.mockResolvedValue(page);

      await expect(interviewsService.list({ limit: 10, offset: 20, status: "completed" })).resolves.toEqual(page);
      expect(get).toHaveBeenCalledWith("/interviews", { params: { limit: 10, offset: 20, status: "completed" } });
    });

    it("sends no status without a filter (history AC2)", async () => {
      get.mockResolvedValue(page);

      await interviewsService.list({ limit: 10, offset: 0 });

      expect(get).toHaveBeenCalledWith("/interviews", { params: { limit: 10, offset: 0 } });
    });

    it("forwards a sort to the backend (R4)", async () => {
      get.mockResolvedValue(page);

      await interviewsService.list({ limit: 20, offset: 40, sort_by: "role", sort_dir: "asc" });

      expect(get).toHaveBeenCalledWith("/interviews", {
        params: { limit: 20, offset: 40, sort_by: "role", sort_dir: "asc" },
      });
    });

    it("rejects a page that doesn't match the contract (history EC10)", async () => {
      get.mockResolvedValue({ ...page, items: [interviewListItem({ status: "paused" as never })] });

      await expect(interviewsService.list({ limit: 10, offset: 0 })).rejects.toThrow();
    });

    it("lets the backend's error through unchanged", async () => {
      const failure = axiosErrorWith(503, errorBody("SERVICE_UNAVAILABLE", "Try again"));
      get.mockRejectedValue(failure);

      await expect(interviewsService.list({ limit: 10, offset: 0 })).rejects.toBe(failure);
    });
  });

  describe("transcribe", () => {
    const recording = (type: string) => new Blob([new Uint8Array([0x1a, 0x45, 0xdf, 0xa3])], { type });

    it("posts the recording as the multipart part `audio` with the transcription timeout and signal (voice AC14)", async () => {
      post.mockResolvedValue({ text: "I would add an index." });
      const signal = new AbortController().signal;

      await expect(interviewsService.transcribe(ID, recording("audio/webm;codecs=opus"), signal)).resolves.toEqual({
        text: "I would add an index.",
      });

      const [url, body, config] = post.mock.calls[0];
      expect(url).toBe(`/interviews/${ID}/transcriptions`);
      expect(config).toEqual({ timeout: TRANSCRIBE_TIMEOUT_MS, signal });
      const file = (body as FormData).get("audio") as File;
      expect(file.type).toBe("audio/webm;codecs=opus");
      expect(file.name).toBe("answer.webm");
    });

    it.each([
      ["audio/mp4", "answer.mp4"],
      ["audio/ogg;codecs=opus", "answer.ogg"],
    ])("names a %s recording %s", async (type, name) => {
      post.mockResolvedValue({ text: "ok" });

      await interviewsService.transcribe(ID, recording(type));

      expect(((post.mock.calls[0][1] as FormData).get("audio") as File).name).toBe(name);
    });

    it("rejects a response that doesn't match the contract", async () => {
      post.mockResolvedValue({ transcript: "ok" });

      await expect(interviewsService.transcribe(ID, recording("audio/webm"))).rejects.toThrow();
    });

    it("lets the backend's error through unchanged", async () => {
      const error = axiosErrorWith(422, errorBody("NO_SPEECH", "No speech"));
      post.mockRejectedValue(error);

      await expect(interviewsService.transcribe(ID, recording("audio/webm"))).rejects.toBe(error);
    });
  });

  describe("feedback", () => {
    it("getFeedback reads the stored feedback and parses it (AC2)", async () => {
      get.mockResolvedValue(feedback());

      await expect(interviewsService.getFeedback(ID)).resolves.toEqual(feedback());
      expect(get).toHaveBeenCalledWith(`/interviews/${ID}/feedback`);
    });

    it("getFeedback returns null when none was requested yet (AC3, EC4)", async () => {
      get.mockRejectedValue(axiosErrorWith(404, errorBody("FEEDBACK_NOT_FOUND", "No feedback")));

      await expect(interviewsService.getFeedback(ID)).resolves.toBeNull();
    });

    it("getFeedback lets a 404 for the interview itself through (EC2)", async () => {
      const notFound = axiosErrorWith(404, errorBody("NOT_FOUND", "Interview not found"));
      get.mockRejectedValue(notFound);

      await expect(interviewsService.getFeedback(ID)).rejects.toBe(notFound);
    });

    it("generateFeedback posts with the feedback timeout and parses the result (AC6)", async () => {
      post.mockResolvedValue(feedback());

      await expect(interviewsService.generateFeedback(ID)).resolves.toEqual(feedback());
      expect(post).toHaveBeenCalledWith(`/interviews/${ID}/feedback`, undefined, { timeout: FEEDBACK_TIMEOUT_MS });
    });

    it.each([
      ["getFeedback", () => get, () => interviewsService.getFeedback(ID)],
      ["generateFeedback", () => post, () => interviewsService.generateFeedback(ID)],
    ] as const)("%s rejects a body that breaks the contract (AC11, EC20)", async (_name, mock, call) => {
      mock().mockResolvedValue(feedback({ status: "queued" as never }));

      await expect(call()).rejects.toThrow();
    });
  });

  describe("job description import", () => {
    const imported = { text: "Data Engineer\nWe are looking for…", truncated: false };

    it("importJobUrl posts only the link to /interviews/job-url and returns the parsed text (AC2)", async () => {
      post.mockResolvedValue(imported);

      await expect(interviewsService.importJobUrl("https://jobs.example.com/42")).resolves.toEqual(imported);
      expect(post).toHaveBeenCalledWith("/interviews/job-url", { url: "https://jobs.example.com/42" });
    });

    it("importJobText posts the content and its format to /interviews/job-text (AC5)", async () => {
      post.mockResolvedValue({ ...imported, truncated: true });

      await expect(
        interviewsService.importJobText({ content: "<main>Data Engineer</main>", format: "html" }),
      ).resolves.toEqual({ ...imported, truncated: true });
      expect(post).toHaveBeenCalledWith("/interviews/job-text", { content: "<main>Data Engineer</main>", format: "html" });
    });

    it.each([
      ["importJobUrl", () => interviewsService.importJobUrl("https://jobs.example.com/42")],
      ["importJobText", () => interviewsService.importJobText({ content: "text", format: "text" })],
    ] as const)("%s rejects a reply that breaks the contract", async (_name, call) => {
      post.mockResolvedValue({ text: "x" });

      await expect(call()).rejects.toThrow();
    });

    it.each([
      ["importJobUrl", () => interviewsService.importJobUrl("https://jobs.example.com/42")],
      ["importJobText", () => interviewsService.importJobText({ content: "text", format: "text" })],
    ] as const)("%s passes an API error through unchanged, for the error mapper", async (_name, call) => {
      const blocked = axiosErrorWith(422, errorBody("JOB_URL_UNREACHABLE", "We couldn't open that link."));
      post.mockRejectedValue(blocked);

      await expect(call()).rejects.toBe(blocked);
    });
  });
});
