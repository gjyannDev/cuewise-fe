import { NextResponse } from "next/server";

import { backendApi } from "@/lib/config/backend.client.server";
import { backendErrorToResponse, errorResponse, parseJsonBody } from "@/lib/config/bff.server";
import { authCredentialsSchema } from "@/modules/auth/schemas/auth.schema";
import { setAccessTokenCookie } from "@/modules/auth/session/auth-cookie.server";
import { signInWithBackend } from "@/modules/auth/session/auth-login.server";

export async function POST(request: Request) {
  const body = await parseJsonBody(request, authCredentialsSchema);
  if (body.response) {
    return body.response;
  }

  try {
    await backendApi.post("/auth/register", body.data, { _skipAuth: true });
  } catch (error) {
    return backendErrorToResponse(error);
  }

  try {
    const { token, profile } = await signInWithBackend(body.data);
    await setAccessTokenCookie(token);
    return NextResponse.json(profile, { status: 201 });
  } catch {
    // The account exists; only the automatic sign-in failed, so ask the user to sign in themselves.
    return errorResponse(502, "AUTO_LOGIN_FAILED", "Your account was created. Please sign in.");
  }
}
