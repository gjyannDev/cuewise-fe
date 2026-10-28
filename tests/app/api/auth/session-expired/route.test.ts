import { getRedirectUrl } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { cookieJar } from "@tests/helpers/cookie-jar";

vi.mock("next/headers", async () => (await import("@tests/helpers/cookie-jar")).nextHeadersMock);

const { GET } = await import("@/app/api/auth/session-expired/route");

const call = async (query: string) => {
  const response = await GET(new NextRequest(`http://localhost/api/auth/session-expired${query}`));
  return new URL(getRedirectUrl(response) ?? "about:blank");
};

beforeEach(() => {
  cookieJar.reset();
  cookieJar.store.set("access_token", { value: "dead-token" });
});

describe("GET /api/auth/session-expired (EC5)", () => {
  it("clears the cookie and redirects to /signin with next and expired=1", async () => {
    const target = await call("?next=%2Finterviews%2F1%3Ftab%3Dnotes");

    expect(cookieJar.store.has("access_token")).toBe(false);
    expect(target.origin).toBe("http://localhost");
    expect(target.pathname).toBe("/signin");
    expect(target.searchParams.get("next")).toBe("/interviews/1?tab=notes");
    expect(target.searchParams.get("expired")).toBe("1");
  });

  it("keeps an admin page as next (the role is unknown once the session is gone)", async () => {
    expect((await call("?next=%2Fadmin%2Fusers")).searchParams.get("next")).toBe("/admin/users");
  });

  it.each(["?next=%2F%2Fevil.com", "?next=https%3A%2F%2Fevil.com", ""])(
    "drops an unsafe or missing next (%s)",
    async (query) => {
      const target = await call(query);

      expect(target.origin).toBe("http://localhost");
      expect(target.searchParams.has("next")).toBe(false);
      expect(target.searchParams.get("expired")).toBe("1");
    },
  );
});
