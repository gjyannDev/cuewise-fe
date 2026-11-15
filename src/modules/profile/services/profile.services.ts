import { apiClient } from "@/lib/api/api.client";
import { parseApiError } from "@/lib/config/api.helper";

import { PROFILE_ERROR_CODES, RESUME_UPLOAD_TIMEOUT_MS } from "../constants";
import { profileSchema } from "../schemas/profile.schema";
import type { Profile } from "../types/profile.types";

/** The signed-in user's own profile; cuewise-be knows who from the token, so no id is ever in a URL. */
class ProfileService {
  private readonly basePath = "/profile";

  /** The stored profile, or null when no résumé was uploaded yet (`PROFILE_NOT_FOUND`). Other errors are thrown. */
  async get(): Promise<Profile | null> {
    try {
      const data = await apiClient.get<unknown>(this.basePath);
      return profileSchema.parse(data);
    } catch (error) {
      if (parseApiError(error).code === PROFILE_ERROR_CODES.notFound) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Sends the résumé and returns the profile cuewise-be built from it (it replaces any earlier one; a refusal keeps
   * it). The file is read and checked by the backend, never by the browser, and it is not stored anywhere.
   */
  async upload(file: File): Promise<Profile> {
    const form = new FormData();
    form.append("file", file);
    const data = await apiClient.post<unknown>(`${this.basePath}/resume`, form, { timeout: RESUME_UPLOAD_TIMEOUT_MS });
    return profileSchema.parse(data);
  }

  /** Deletes the profile for good (204, also when there is none). */
  async remove(): Promise<void> {
    await apiClient.delete<unknown>(this.basePath);
  }
}

export const profileService = new ProfileService();
