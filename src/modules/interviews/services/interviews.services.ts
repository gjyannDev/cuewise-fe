import { apiClient } from "@/lib/api/api.client";
import { readSseStream } from "@/lib/api/sse";
import { ApiResponseError, NoResponseError, parseApiError } from "@/lib/config/api.helper";
import { redirectIfSessionEnded } from "@/lib/config/session-redirect";

import { FEEDBACK_ERROR_CODES, FEEDBACK_TIMEOUT_MS, START_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS } from "../constants";
import {
  answerRequestSchema,
  feedbackSchema,
  interviewListSchema,
  interviewSchema,
  jobImportResponseSchema,
  transcriptionResponseSchema,
  transcriptSchema,
} from "../schemas/interviews.schema";
import type {
  AnswerRequest,
  AnswerStreamEvent,
  Feedback,
  Interview,
  InterviewList,
  InterviewListParams,
  JobImport,
  JobTextRequest,
  StartInterviewRequest,
  Transcript,
  Transcription,
} from "../types/interviews.types";
import { AnswerStreamError, parseAnswerStreamEvent } from "../utils/stream.utils";

const TERMINAL_EVENTS = new Set<AnswerStreamEvent["event"]>(["done", "error"]);

/** cuewise-be checks the declared type against the file itself; the name only makes the upload readable in logs. */
function recordingFileName(type: string): string {
  if (type.startsWith("audio/mp4")) return "answer.mp4";
  if (type.startsWith("audio/ogg")) return "answer.ogg";
  return "answer.webm";
}

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

  /**
   * The text of a job posting, read by cuewise-be from its link (it refuses internal addresses and caps the fetch at
   * 8 s, inside the default timeout). Nothing is stored: the text is for the candidate to review in the setup form.
   */
  async importJobUrl(url: string): Promise<JobImport> {
    const data = await apiClient.post<unknown>(`${this.basePath}/job-url`, { url });
    return jobImportResponseSchema.parse(data);
  }

  /** A whole posting page the candidate copied from their own browser, cleaned by cuewise-be like a fetched page. */
  async importJobText(request: JobTextRequest): Promise<JobImport> {
    const data = await apiClient.post<unknown>(`${this.basePath}/job-text`, request);
    return jobImportResponseSchema.parse(data);
  }

  async get(id: string): Promise<Interview> {
    const data = await apiClient.get<unknown>(`${this.basePath}/${encodeURIComponent(id)}`);
    return interviewSchema.parse(data);
  }

  /** One page of the user's own interviews, newest first (the history table). */
  async list(params: InterviewListParams): Promise<InterviewList> {
    const data = await apiClient.get<unknown>(this.basePath, { params });
    return interviewListSchema.parse(data);
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

  /**
   * Uploads a recorded answer (the browser's own container, as recorded) and returns what was said. Nothing is saved:
   * the text is for the candidate to review, and only becomes an answer through `answerStream`.
   */
  async transcribe(id: string, recording: Blob, signal?: AbortSignal): Promise<Transcription> {
    const form = new FormData();
    form.append("audio", recording, recordingFileName(recording.type));
    const data = await apiClient.post<unknown>(`${this.basePath}/${encodeURIComponent(id)}/transcriptions`, form, {
      timeout: TRANSCRIBE_TIMEOUT_MS,
      signal,
    });
    return transcriptionResponseSchema.parse(data);
  }

  /**
   * The interview's stored feedback in any status, or null when none was requested yet (`FEEDBACK_NOT_FOUND`). Any
   * other error, a 404 for the interview itself included, is thrown as is.
   */
  async getFeedback(id: string): Promise<Feedback | null> {
    try {
      const data = await apiClient.get<unknown>(`${this.basePath}/${encodeURIComponent(id)}/feedback`);
      return feedbackSchema.parse(data);
    } catch (error) {
      if (parseApiError(error).code === FEEDBACK_ERROR_CODES.notFound) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Scores the completed interview, or returns the feedback already stored. cuewise-be answers once both LLM calls are
   * done, so this waits far longer than other requests.
   */
  async generateFeedback(id: string): Promise<Feedback> {
    const data = await apiClient.post<unknown>(`${this.basePath}/${encodeURIComponent(id)}/feedback`, undefined, {
      timeout: FEEDBACK_TIMEOUT_MS,
    });
    return feedbackSchema.parse(data);
  }
}

export const interviewsService = new InterviewsService();
