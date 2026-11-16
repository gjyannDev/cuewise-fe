import { apiClient } from "@/lib/api/api.client";

import { SPEECH_TIMEOUT_MS, TRANSCRIBE_TIMEOUT_MS } from "../constants";
import { transcriptionResponseSchema } from "../schemas/interviews.schema";
import type { InterviewerLine, Transcription } from "../types/interviews.types";

/** cuewise-be checks the declared type against the file itself; the name only makes the upload readable in logs. */
function recordingFileName(type: string): string {
  if (type.startsWith("audio/mp4")) return "answer.mp4";
  if (type.startsWith("audio/ogg")) return "answer.ogg";
  return "answer.webm";
}

/** Route segment per line kind: questions and reactions are stored in different tables (interview-room API contract). */
const SPEECH_ROUTE: Record<InterviewerLine["kind"], string> = { question: "questions", reaction: "messages" };

/**
 * The interview's voice calls: the candidate's recordings to text, and the interviewer's lines to audio. The only
 * interview code that calls a speech route (interview-room AC17). Goes through the /api forwarder like every service.
 */
class VoiceService {
  private readonly basePath = "/interviews";

  /**
   * Uploads a recorded answer (the browser's own container, as recorded) and returns what was said. Nothing is saved:
   * the text is for the candidate to review, and only becomes an answer when it is sent.
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
   * One stored interviewer line, spoken, as a whole clip. The Blob's `type` is the response's Content-Type (MP3 by
   * default, but never assumed); a body that isn't audio is refused rather than played as noise.
   */
  async speak(id: string, line: InterviewerLine, signal?: AbortSignal): Promise<Blob> {
    const clip = await apiClient.downloadBlob(
      `${this.basePath}/${encodeURIComponent(id)}/${SPEECH_ROUTE[line.kind]}/${encodeURIComponent(line.id)}/speech`,
      { timeout: SPEECH_TIMEOUT_MS, signal },
    );
    if (!clip.type.startsWith("audio/")) {
      throw new Error(`Speech response is not audio (${clip.type || "no type"})`);
    }
    return clip;
  }
}

export const voiceService = new VoiceService();
