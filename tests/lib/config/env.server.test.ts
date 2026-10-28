import { afterEach, describe, expect, it, vi } from "vitest";

import { getApiUrl } from "@/lib/config/env.server";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getApiUrl", () => {
  it("returns the configured backend URL without a trailing slash", () => {
    vi.stubEnv("API_URL", "http://localhost:8000/api/v1/");

    expect(getApiUrl()).toBe("http://localhost:8000/api/v1");
  });

  it.each([
    ["missing", undefined],
    ["no scheme", "localhost:8000"],
    ["non-http scheme", "ftp://localhost:8000/api/v1"],
  ])("throws a clear configuration error when API_URL is %s", (_, value) => {
    vi.stubEnv("API_URL", value as string);

    expect(() => getApiUrl()).toThrow(/API_URL must be an absolute http\(s\) URL/);
  });
});
