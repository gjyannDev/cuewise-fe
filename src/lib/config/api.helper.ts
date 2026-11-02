import axios from "axios";
import { z } from "zod";

export const GENERIC_ERROR_MESSAGE = "Something went wrong, please try again";

/** Error body every cuewise-be error uses (and the Next.js /api handlers pass through). */
export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown(),
    request_id: z.string().nullable(),
  }),
});

export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;

/** cuewise-be's 401 codes that mean "the session is gone" (as opposed to wrong credentials). */
const SESSION_ERROR_CODES = new Set(["TOKEN_EXPIRED", "TOKEN_INVALID", "TOKEN_MISSING"]);

export function isSessionErrorCode(code: string | undefined) {
  return code !== undefined && SESSION_ERROR_CODES.has(code);
}

/**
 * A non-2xx response to a `fetch` call (calls axios can't make, e.g. reading a stream). `body` is the parsed JSON,
 * or null when it wasn't JSON. Read by `parseApiError` / `isNoResponseError` like an AxiosError's response.
 */
export class ApiResponseError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`Request failed with status ${status}`);
    this.name = "ApiResponseError";
  }
}

/** A `fetch` call that got no response at all: the backend may still have done the work. */
export class NoResponseError extends Error {
  constructor(options?: { cause?: unknown }) {
    super("No response", options);
    this.name = "NoResponseError";
  }
}

/** Status and body of a failed request, from axios or from `ApiResponseError`. */
function responseOf(error: unknown): { status: number; data: unknown } | undefined {
  if (error instanceof ApiResponseError) {
    return { status: error.status, data: error.body };
  }
  if (axios.isAxiosError(error) && error.response) {
    return { status: error.response.status, data: error.response.data };
  }
  return undefined;
}

/**
 * The request got no answer from cuewise-be (browser timeout, network drop, or the /api forwarder's 503 when it
 * couldn't reach the backend). Unlike a real error response, the backend may still have done the work.
 */
export function isNoResponseError(error: unknown) {
  if (error instanceof NoResponseError || (axios.isAxiosError(error) && !error.response)) {
    return true;
  }
  const response = responseOf(error);
  if (!response) {
    return false;
  }
  const body = apiErrorBodySchema.safeParse(response.data);
  return response.status === 503 && body.success && body.data.error.code === "SERVICE_UNAVAILABLE";
}

export type ApiError = {
  status: number | undefined;
  code: string | undefined;
  message: string;
  /** Field name (without the "body." prefix) -> message, from 422 details or a 409 `details.field`. */
  fieldErrors: Record<string, string>;
};

const validationDetailsSchema = z.array(z.object({ field: z.string(), issue: z.string() }));
const conflictDetailsSchema = z.object({ field: z.string() });

function toFieldErrors(code: string, message: string, details: unknown): Record<string, string> {
  const validation = validationDetailsSchema.safeParse(details);
  if (code === "VALIDATION_ERROR" && validation.success) {
    return Object.fromEntries(
      validation.data.map(({ field, issue }) => [field.replace(/^body\./, ""), issue]),
    );
  }

  const conflict = conflictDetailsSchema.safeParse(details);
  if (conflict.success) {
    return { [conflict.data.field]: message };
  }

  return {};
}

/** Turn any thrown value into the backend's code, message and per-field errors. Never exposes raw errors. */
export function parseApiError(error: unknown): ApiError {
  const response = responseOf(error);
  const status = response?.status;
  const parsed = apiErrorBodySchema.safeParse(response?.data);

  if (!parsed.success) {
    return { status, code: undefined, message: GENERIC_ERROR_MESSAGE, fieldErrors: {} };
  }

  const { code, message, details } = parsed.data.error;
  return { status, code, message, fieldErrors: toFieldErrors(code, message, details) };
}

export type NormalizedError = Error & {
  status?: number;
  original?: unknown;
};

export const normalizeError = (error: unknown): NormalizedError => {
  let message = "Unknown error";
  let status: number | undefined;

  try {
    if (axios.isAxiosError(error)) {
      status = error.response?.status;

      const payload = error.response?.data;

      if (typeof payload === "string") {
        message = payload;
      } else if (payload && typeof payload === "object") {
        if ("detail" in payload) {
          const detail = payload.detail;

          if (typeof detail === "string") {
            message = detail;
          } else if (Array.isArray(detail)) {
            message = detail
              .map((item) => {
                if (
                  item &&
                  typeof item === "object" &&
                  "msg" in item &&
                  typeof item.msg === "string"
                ) {
                  return item.msg;
                }

                return String(item);
              })
              .join(", ");
          } else {
            message = JSON.stringify(detail, null, 2);
          }
        } else if ("message" in payload) {
          message = String(payload.message);
        } else if (
          "error" in payload &&
          typeof payload.error === "object" &&
          payload.error !== null &&
          "message" in payload.error
        ) {
          message = String((payload.error as { message?: unknown }).message);
        } else {
          message = JSON.stringify(payload, null, 2);
        }
      } else {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
  } catch {
    message = error instanceof Error ? error.message : String(error);
  }

  const normalized: NormalizedError = new Error(message);

  normalized.status = status;
  normalized.original = error;

  return normalized;
};
