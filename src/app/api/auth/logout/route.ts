import { clearAccessTokenCookie } from "@/modules/auth/session/auth-cookie.server";

// The backend has no logout/revocation: signing out means forgetting the token.
export async function POST() {
  await clearAccessTokenCookie();
  return new Response(null, { status: 204 });
}
