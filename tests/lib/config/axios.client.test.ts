import { AxiosError, AxiosHeaders, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectIfSessionEnded = vi.fn();
vi.mock("@/lib/config/session-redirect", () => ({ redirectIfSessionEnded }));

const { rejectApiError } = await import("@/lib/config/axios.client");

function errorWith(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const response = { status, statusText: "", headers: {}, config, data } as AxiosResponse;
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, {}, response);
}

const jsonBlob = (body: unknown) => new Blob([JSON.stringify(body)], { type: "application/json" });

beforeEach(() => redirectIfSessionEnded.mockReset());

describe("rejectApiError", () => {
  it("turns a JSON error body that arrived as a Blob back into the parsed object", async () => {
    const error = errorWith(503, jsonBlob({ error: { code: "SPEECH_UNAVAILABLE", message: "Unavailable" } }));

    await expect(rejectApiError(error)).rejects.toBe(error);

    expect(error.response?.data).toEqual({ error: { code: "SPEECH_UNAVAILABLE", message: "Unavailable" } });
  });

  it("lets a session-ending 401 inside a Blob reach the redirect check as JSON", async () => {
    const body = { error: { code: "TOKEN_EXPIRED", message: "Session expired" } };

    await expect(rejectApiError(errorWith(401, jsonBlob(body)))).rejects.toBeInstanceOf(AxiosError);

    expect(redirectIfSessionEnded).toHaveBeenCalledWith(401, body);
  });

  it("leaves a Blob that isn't JSON as it is", async () => {
    const blob = new Blob(["<html>bad gateway</html>"], { type: "text/html" });
    const error = errorWith(502, blob);

    await expect(rejectApiError(error)).rejects.toBe(error);

    expect(error.response?.data).toBe(blob);
    expect(redirectIfSessionEnded).toHaveBeenCalledWith(502, blob);
  });

  it("leaves a Blob that claims JSON but can't be parsed as it is", async () => {
    const blob = new Blob(["{not json"], { type: "application/json" });
    const error = errorWith(500, blob);

    await expect(rejectApiError(error)).rejects.toBe(error);

    expect(error.response?.data).toBe(blob);
  });

  it("passes ordinary JSON errors and network errors through unchanged", async () => {
    const body = { error: { code: "NOT_FOUND", message: "Interview not found" } };
    const jsonError = errorWith(404, body);
    const networkError = new AxiosError("Network Error", "ERR_NETWORK");

    await expect(rejectApiError(jsonError)).rejects.toBe(jsonError);
    await expect(rejectApiError(networkError)).rejects.toBe(networkError);

    expect(jsonError.response?.data).toBe(body);
    expect(redirectIfSessionEnded).toHaveBeenCalledWith(404, body);
    expect(redirectIfSessionEnded).toHaveBeenCalledWith(undefined, undefined);
  });
});
