import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import { isNoResponseError, parseApiError } from "@/lib/config/api.helper";

function axiosErrorWith(status: number, data: unknown) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_RESPONSE", config, null, {
    status,
    statusText: "",
    headers: {},
    config,
    data,
  });
}

const body = (code: string, message: string, details: unknown = null) => ({
  error: { code, message, details, request_id: "req-1" },
});

describe("parseApiError", () => {
  it("maps 422 field details (body.<field>) to field errors", () => {
    const error = axiosErrorWith(
      422,
      body("VALIDATION_ERROR", "Request validation failed", [
        { field: "body.email", issue: "value is not a valid email address", type: "value_error" },
        { field: "body.password", issue: "String should have at least 8 characters", type: "string_too_short" },
      ]),
    );

    expect(parseApiError(error)).toEqual({
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      fieldErrors: {
        email: "value is not a valid email address",
        password: "String should have at least 8 characters",
      },
    });
  });

  it("maps a 409 conflict with details.field onto that field", () => {
    const error = axiosErrorWith(409, body("CONFLICT", "Email already registered", { field: "email" }));

    expect(parseApiError(error).fieldErrors).toEqual({ email: "Email already registered" });
  });

  it("keeps code and message for errors without field details", () => {
    const error = axiosErrorWith(401, body("INVALID_CREDENTIALS", "Invalid email or password"));

    expect(parseApiError(error)).toEqual({
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
      fieldErrors: {},
    });
  });

  it("falls back to a generic message for a non-JSON or network error", () => {
    const network = new AxiosError("Network Error", "ERR_NETWORK");

    expect(parseApiError(network)).toEqual({
      status: undefined,
      code: undefined,
      message: "Something went wrong, please try again",
      fieldErrors: {},
    });
    expect(parseApiError(new Error("boom")).message).toBe("Something went wrong, please try again");
  });
});

describe("isNoResponseError (the outcome is unknown: the backend may have done the work)", () => {
  it("is true for a timeout", () => {
    expect(isNoResponseError(new AxiosError("timeout of 45000ms exceeded", "ECONNABORTED"))).toBe(true);
  });

  it("is true for a network drop", () => {
    expect(isNoResponseError(new AxiosError("Network Error", "ERR_NETWORK"))).toBe(true);
  });

  it("is true for the /api forwarder's 503 when it couldn't reach the backend", () => {
    expect(isNoResponseError(axiosErrorWith(503, body("SERVICE_UNAVAILABLE", "Something went wrong")))).toBe(true);
  });

  it.each([
    ["a 500", axiosErrorWith(500, body("INTERNAL_ERROR", "Something went wrong"))],
    ["a 409", axiosErrorWith(409, body("QUESTION_NOT_CURRENT", "Not the current question"))],
    ["a plain Error", new Error("boom")],
  ])("is false for %s: the backend answered, so the outcome is known", (_, error) => {
    expect(isNoResponseError(error)).toBe(false);
  });
});
