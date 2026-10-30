import { API } from "@/lib/config/axios.client";

import { answerRequestSchema, answerResponseSchema, interviewSchema } from "../schemas/interviews.schema";
import type { AnswerRequest, AnswerResponse, Interview, StartInterviewRequest } from "../types/interviews.types";

/** Goes through the Next.js /api forwarder, which adds the token from the httpOnly cookie. */
class InterviewsService {
  private readonly basePath = "/interviews";

  async start(params: StartInterviewRequest): Promise<Interview> {
    const response = await API.post(this.basePath, params);
    return interviewSchema.parse(response.data);
  }

  async get(id: string): Promise<Interview> {
    const response = await API.get(`${this.basePath}/${encodeURIComponent(id)}`);
    return interviewSchema.parse(response.data);
  }

  async answer(id: string, params: AnswerRequest): Promise<AnswerResponse> {
    // Parsed on the way out too: the body must be exactly question_id + trimmed answer (cuewise-be forbids extras).
    const body = answerRequestSchema.parse(params);
    const response = await API.post(`${this.basePath}/${encodeURIComponent(id)}/messages`, body);
    return answerResponseSchema.parse(response.data);
  }
}

export const interviewsService = new InterviewsService();
