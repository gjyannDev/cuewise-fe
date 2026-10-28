import "server-only";

import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE, ACCESS_TOKEN_MAX_AGE_SECONDS } from "./auth-session";

/** The only code that reads, writes or deletes the token cookie. Writes work only in Route Handlers. */

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function setAccessTokenCookie(token: string) {
  (await cookies()).set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
}

export async function clearAccessTokenCookie() {
  (await cookies()).delete(ACCESS_TOKEN_COOKIE);
}
