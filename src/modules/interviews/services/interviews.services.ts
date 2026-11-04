import { apiClient } from "@/lib/api/api.client";
import { readSseStream } from "@/lib/api/sse";
import { ApiResponseError, NoResponseError } from "@/lib/config/api.helper";
import { redirectIfSessionEnded } from "@/lib/config/session-redirect";

import { START_TIMEOUT_MS } from "../constants";
import { answerRequestSchema, interviewSchema, transcriptSchema } from "../schemas/interviews.schema";
import type {
  AnswerRequest,
  AnswerStreamEvent,
  Interview,
  StartInterviewRequest,
  Transcript,
} from "../types/interviews.types";
import { AnswerStreamError } from "../utils/answer-stream-error";
import { parseAnswerStreamEvent } from "../utils/parse-answer-stream-event";

const TERMINAL_EVENTS = new Set<AnswerStreamEvent["event"]>(["done", "error"]);

async function jsonOrNull(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/** Goes through the Next.js /api forwarder, which adds the token from the httpOnly cookie. */
class InterviewsService {
  private readonly basePath = "/interviews";

  async start(params: StartInterviewRequest): Promise<Interview> {
    const data = await apiClient.post<unknown>(this.basePath, params, { timeout: START_TIMEOUT_MS });
    return interviewSchema.parse(data);
  }

  async get(id: string): Promise<Interview> {
    const data = await apiClient.get<unknown>(`${this.basePath}/${encodeURIComponent(id)}`);
    return interviewSchema.parse(data);
  }

  /**
   * Sends an answer and yields the turn's events as cuewise-be streams them, ending after `done` or `error`. Uses
   * fetch, not axios: axios can't read a response as it arrives. Before the stream opens it fails like the other
   * calls (`ApiResponseError`, `NoResponseError`, the expired-session redirect); after, a stream that ends early or
   * breaks the contract throws `AnswerStreamError("interrupted")`. An abort (`signal`) is rethrown as is.
   */
  async *answerStream(id: string, params: AnswerRequest, signal?: AbortSignal): AsyncGenerator<AnswerStreamEvent> {
    // Parsed on the way out too: the body must be exactly question_id + trimmed answer (cuewise-be forbids extras).
    const body = answerRequestSchema.parse(params);
    let response: Response;
    try {
      response = await fetch(`/api${this.basePath}/${encodeURIComponent(id)}/messages/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify(body),
        signal,
      });
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      throw new NoResponseError({ cause: error });
    }

    if (!response.ok || !response.body) {
      const errorBody = await jsonOrNull(response);
      redirectIfSessionEnded(response.status, errorBody);
      throw new ApiResponseError(response.status, errorBody);
    }

    for await (const frame of readSseStream(response.body)) {
      const parsed = parseAnswerStreamEvent(frame);
      if (parsed.kind === "unknown") {
        continue;
      }
      if (parsed.kind === "invalid") {
        throw new AnswerStreamError("interrupted");
      }
      yield parsed.event;
      if (TERMINAL_EVENTS.has(parsed.event.event)) {
        return;
      }
    }
  }

  async messages(id: string): Promise<Transcript> {
    const data = await apiClient.get<unknown>(`${this.basePath}/${encodeURIComponent(id)}/messages`);
    return transcriptSchema.parse(data);
  }
}

export const interviewsService = new InterviewsService();
