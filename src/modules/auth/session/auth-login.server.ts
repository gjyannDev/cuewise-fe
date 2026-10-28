import "server-only";

import { backendApi } from "@/lib/config/backend.client.server";

import { backendTokenSchema, currentProfileSchema } from "../schemas/auth.schema";
import type { AuthCredentials, CurrentUserProfile } from "../types/auth.types";

/**
 * Exchange credentials for a backend token and load the profile with it.
 * The token is only returned to the caller (a Route Handler) so it can be put in the httpOnly cookie.
 */
export async function signInWithBackend(
  credentials: AuthCredentials,
): Promise<{ token: string; profile: CurrentUserProfile }> {
  const { data } = await backendApi.post("/auth/login", credentials, { _skipAuth: true });
  const token = backendTokenSchema.parse(data).access_token;

  // The cookie isn't on this request yet, so pass the new token explicitly.
  const me = await backendApi.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
    _skipAuth: true,
  });

  return { token, profile: currentProfileSchema.parse(me.data) };
}
