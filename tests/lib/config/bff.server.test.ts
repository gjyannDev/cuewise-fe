import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

import { backendErrorToResponse } from "@/lib/config/bff.server";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("backendErrorToResponse", () => {
  it("passes a backend error body through without logging it", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = backendErrorToResponse(axiosErrorWith(401, errorBody("INVALID_CREDENTIALS", "Nope")));

    expect(response.status).toBe(401);
    expect(log).not.toHaveBeenCalled();
  });

  it("logs the cause of a 503 so it can be diagnosed", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(backendErrorToResponse(networkError()).status).toBe(503);
    expect(log.mock.calls[0][0]).toContain("ECONNREFUSED");
  });

  it("logs the cause of a 502 (e.g. a misconfigured API_URL) instead of hiding it", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    // Same rule as env.server.ts; a plain z.url() would accept "localhost:8000" (scheme "localhost:").
    const misconfigured = z.url({ protocol: /^https?$/ }).safeParse("localhost:8000").error;

    expect(backendErrorToResponse(misconfigured).status).toBe(502);
    expect(log.mock.calls[0][0]).toContain("ZodError");
  });

  it("never logs the Authorization header carried by an axios error", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const headers = new AxiosHeaders({ Authorization: "Bearer secret-token" });
    const error = new AxiosError("socket hang up", "ECONNRESET", { headers });

    backendErrorToResponse(error);

    expect(log.mock.calls.flat().join(" ")).not.toContain("secret-token");
  });
});
