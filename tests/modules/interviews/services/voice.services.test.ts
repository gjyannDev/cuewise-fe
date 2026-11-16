import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/api.client";
import { SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS } from "@/modules/interviews/constants";
import { voiceService } from "@/modules/interviews/services/voice.services";
import { axiosErrorWith, errorBody } from "@tests/helpers/axios";

// apiClient already unwraps `res.data`, so the mocks resolve with the payload itself.
vi.mock("@/lib/api/api.client", () => ({ apiClient: { post: vi.fn(), downloadBlob: vi.fn() } }));

const post = vi.mocked(apiClient.post);
const downloadBlob = vi.mocked(apiClient.downloadBlob);

const ID = "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f";
const LINE_ID = "019a2b3c-4d5e-7f60-8a9b-0c1d2e3f4a5b";

beforeEach(() => {
  post.mockReset();
  downloadBlob.mockReset();
});

describe("voiceService", () => {
  describe("transcribe", () => {
    const recording = (type: string) => new Blob([new Uint8Array([0x1a, 0x45, 0xdf, 0xa3])], { type });

    it("posts the recording as the multipart part `audio` with the transcription timeout and signal (voice AC14)", async () => {
      post.mockResolvedValue({ text: "I would add an index." });
      const signal = new AbortController().signal;

      await expect(voiceService.transcribe(ID, recording("audio/webm;codecs=opus"), signal)).resolves.toEqual({
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

      await voiceService.transcribe(ID, recording(type));

      expect(((post.mock.calls[0][1] as FormData).get("audio") as File).name).toBe(name);
    });

    it("rejects a response that doesn't match the contract", async () => {
      post.mockResolvedValue({ transcript: "ok" });

      await expect(voiceService.transcribe(ID, recording("audio/webm"))).rejects.toThrow();
    });

    it("lets the backend's error through unchanged", async () => {
      const error = axiosErrorWith(422, errorBody("NO_SPEECH", "No speech"));
      post.mockRejectedValue(error);

      await expect(voiceService.transcribe(ID, recording("audio/webm"))).rejects.toBe(error);
    });
  });

  describe("speak", () => {
    const clip = (type = "audio/mpeg") => new Blob([new Uint8Array([0x49, 0x44, 0x33])], { type });

    it("fetches a question from the questions speech route (interview-room API contract)", async () => {
      downloadBlob.mockResolvedValue(clip());

      await voiceService.speak(ID, { kind: "question", id: LINE_ID });

      expect(downloadBlob.mock.calls[0][0]).toBe(`/interviews/${ID}/questions/${LINE_ID}/speech`);
    });

    it("fetches a reaction from the messages speech route", async () => {
      downloadBlob.mockResolvedValue(clip());

      await voiceService.speak(ID, { kind: "reaction", id: LINE_ID });

      expect(downloadBlob.mock.calls[0][0]).toBe(`/interviews/${ID}/messages/${LINE_ID}/speech`);
    });

    it("returns the clip with the type the backend sent, never assuming MP3", async () => {
      downloadBlob.mockResolvedValue(clip("audio/ogg"));

      const result = await voiceService.speak(ID, { kind: "question", id: LINE_ID });

      expect(result.type).toBe("audio/ogg");
    });

    it("passes the speech timeout and the abort signal on", async () => {
      downloadBlob.mockResolvedValue(clip());
      const signal = new AbortController().signal;

      await voiceService.speak(ID, { kind: "question", id: LINE_ID }, signal);

      expect(downloadBlob.mock.calls[0][1]).toEqual({ timeout: SPEECH_TIMEOUT_MS, signal });
    });

    it("refuses a body that isn't audio", async () => {
      downloadBlob.mockResolvedValue(new Blob(["{}"], { type: "application/json" }));

      await expect(voiceService.speak(ID, { kind: "question", id: LINE_ID })).rejects.toThrow();
    });

    it("lets the backend's error through unchanged", async () => {
      const error = axiosErrorWith(503, errorBody("SPEECH_UNAVAILABLE", "Unavailable"));
      downloadBlob.mockRejectedValue(error);

      await expect(voiceService.speak(ID, { kind: "reaction", id: LINE_ID })).rejects.toBe(error);
    });
  });
});
