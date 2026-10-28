import { API } from "@/lib/config/axios.client";

import { interviewSchema } from "../schemas/interviews.schema";
import type { Interview, StartInterviewRequest } from "../types/interviews.types";

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
}

export const interviewsService = new InterviewsService();
