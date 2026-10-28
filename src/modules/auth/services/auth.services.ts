import { API } from "@/lib/config/axios.client";
import { currentProfileSchema } from "../schemas/auth.schema";
import type { AuthCredentials, CurrentUserProfile } from "../types/auth.types";

/**
 * Auth calls go to this app's Route Handlers (`/api/auth/*`), which set/clear the httpOnly cookie.
 * Responses carry the user's profile only; the token never reaches the browser.
 */
class AuthService {
  private readonly authBasePath = "/auth";

  async login(params: AuthCredentials): Promise<CurrentUserProfile> {
    const response = await API.post(`${this.authBasePath}/login`, params);
    return currentProfileSchema.parse(response.data);
  }

  async register(params: AuthCredentials): Promise<CurrentUserProfile> {
    const response = await API.post(`${this.authBasePath}/register`, params);
    return currentProfileSchema.parse(response.data);
  }

  async logout(): Promise<void> {
    await API.post(`${this.authBasePath}/logout`);
  }

  async me(): Promise<CurrentUserProfile> {
    const response = await API.get(`${this.authBasePath}/me`);
    return currentProfileSchema.parse(response.data);
  }
}

export const authService = new AuthService();
