import "server-only";

import axios from "axios";
import { NextResponse } from "next/server";
import type { z } from "zod";

import { apiErrorBodySchema, GENERIC_ERROR_MESSAGE } from "@/lib/config/api.helper";

/** Helpers for Next.js Route Handlers that sit in front of cuewise-be (BFF). */

export function errorResponse(status: number, code: string, message: string, details: unknown = null) {
  return NextResponse.json({ error: { code, message, details, request_id: null } }, { status });
}

/**
 * Pass a backend error to the browser unchanged (same status, same `{error}` body).
 * No response (backend down, timeout) -> 503; anything unexpected -> 502. Never leaks raw errors
 * to the client, but logs a summary server-side so a 502/503 can be diagnosed.
 */
export function backendErrorToResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      logBffError("backend unreachable", error);
      return errorResponse(503, "SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE);
    }
    const body = apiErrorBodySchema.safeParse(error.response.data);
    if (body.success) {
      return NextResponse.json(body.data, { status: error.response.status });
    }
  }
  logBffError("unexpected error calling the backend", error);
  return errorResponse(502, "BAD_GATEWAY", GENERIC_ERROR_MESSAGE);
}

/** Name, message, code and status only: never the error object (axios errors carry the Authorization header). */
function logBffError(context: string, error: unknown) {
  const summary =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          code: axios.isAxiosError(error) ? error.code : undefined,
          status: axios.isAxiosError(error) ? error.response?.status : undefined,
        }
      : { value: typeof error };
  console.error(`[bff] ${context}: ${JSON.stringify(summary)}`);
}

/** A request body that failed our zod schema, reported in the same shape the backend uses for 422. */
export function validationErrorResponse(issues: z.core.$ZodIssue[]) {
  const details = issues.map((issue) => ({
    field: ["body", ...issue.path.map(String)].join("."),
    issue: issue.message,
    type: issue.code,
  }));
  return errorResponse(422, "VALIDATION_ERROR", "Request validation failed", details);
}

/** Parse a JSON request body with a schema; returns the data or a ready 422 response. */
export async function parseJsonBody<T extends z.ZodType>(request: Request, schema: T) {
  const json: unknown = await request.json().catch(() => undefined);
  const parsed = schema.safeParse(json);
  return parsed.success
    ? ({ data: parsed.data as z.infer<T>, response: null } as const)
    : ({ data: null, response: validationErrorResponse(parsed.error.issues) } as const);
}
