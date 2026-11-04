import { apiClient } from "@/lib/api/api.client";

import { currentProfileSchema } from "../schemas/auth.schema";
import type { AuthCredentials, CurrentUserProfile } from "../types/auth.types";

/**
 * Auth calls go to this app's Route Handlers (`/api/auth/*`), which set/clear the httpOnly cookie.
 * Responses carry the user's profile only; the token never reaches the browser.
 */
class AuthService {
  private readonly authBasePath = "/auth";

  async login(params: AuthCredentials): Promise<CurrentUserProfile> {
    const data = await apiClient.post<unknown>(`${this.authBasePath}/login`, params);
    return currentProfileSchema.parse(data);
  }

  async register(params: AuthCredentials): Promise<CurrentUserProfile> {
    const data = await apiClient.post<unknown>(`${this.authBasePath}/register`, params);
    return currentProfileSchema.parse(data);
  }

  async logout(): Promise<void> {
    await apiClient.post<unknown>(`${this.authBasePath}/logout`, undefined);
  }

  async me(): Promise<CurrentUserProfile> {
    const data = await apiClient.get<unknown>(`${this.authBasePath}/me`);
    return currentProfileSchema.parse(data);
  }
}

export const authService = new AuthService();
