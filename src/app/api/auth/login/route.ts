import { NextResponse } from "next/server";

import { backendErrorToResponse, parseJsonBody } from "@/lib/config/bff.server";
import { authCredentialsSchema } from "@/modules/auth/schemas/auth.schema";
import { setAccessTokenCookie } from "@/modules/auth/session/auth-cookie.server";
import { signInWithBackend } from "@/modules/auth/session/auth-login.server";

export async function POST(request: Request) {
  const body = await parseJsonBody(request, authCredentialsSchema);
  if (body.response) {
    return body.response;
  }

  try {
    const { token, profile } = await signInWithBackend(body.data);
    await setAccessTokenCookie(token);
    return NextResponse.json(profile);
  } catch (error) {
    return backendErrorToResponse(error);
  }
}
