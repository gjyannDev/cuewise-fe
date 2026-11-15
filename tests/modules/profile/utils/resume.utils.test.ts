import { describe, expect, it } from "vitest";

import { GENERIC_ERROR_MESSAGE } from "@/lib/config/api.helper";
import { RESUME_UPLOAD_UNCONFIRMED_MESSAGE } from "@/modules/profile/constants";
import { getResumeUploadErrorResult } from "@/modules/profile/utils/resume.utils";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

describe("getResumeUploadErrorResult", () => {
  it.each([
    [413, "RESUME_TOO_LARGE", "That file is too large. Please upload a PDF or Word résumé of up to 2 MB and 5 pages."],
    [415, "RESUME_UNSUPPORTED", "That file isn't a PDF or Word document. Please upload a PDF or .docx résumé."],
    [422, "RESUME_UNREADABLE", "We couldn't read a résumé from that file."],
    [502, "PROFILE_EXTRACTION_FAILED", "We couldn't read your résumé right now. Please try again in a moment."],
    [503, "PROFILE_UNAVAILABLE", "The résumé feature isn't available right now. Please try again later."],
  ])("a %i %s is an alert with the backend's message (EC5-EC9)", (status, code, message) => {
    expect(getResumeUploadErrorResult(axiosErrorWith(status, errorBody(code, message)))).toEqual({
      kind: "alert",
      message,
    });
  });

  it("a 429 is a toast with the backend's retry hint (EC10)", () => {
    const error = axiosErrorWith(429, errorBody("RATE_LIMITED", "Too many uploads. Try again in a minute."));
    expect(getResumeUploadErrorResult(error)).toEqual({
      kind: "toast",
      message: "Too many uploads. Try again in a minute.",
    });
  });

  it("no response at all is unconfirmed: the backend may have stored the profile (EC11)", () => {
    expect(getResumeUploadErrorResult(networkError())).toEqual({
      kind: "unconfirmed",
      message: RESUME_UPLOAD_UNCONFIRMED_MESSAGE,
    });
  });

  it("the forwarder's own 503 is unconfirmed, not PROFILE_UNAVAILABLE (EC11)", () => {
    const error = axiosErrorWith(503, errorBody("SERVICE_UNAVAILABLE", "Something went wrong, please try again"));
    expect(getResumeUploadErrorResult(error).kind).toBe("unconfirmed");
  });

  it("an unexpected body is an alert with the generic message, never the raw error", () => {
    expect(getResumeUploadErrorResult(axiosErrorWith(500, "<html>boom</html>"))).toEqual({
      kind: "alert",
      message: GENERIC_ERROR_MESSAGE,
    });
  });

  it("a 422 validation error from a malformed upload is an alert with the backend's message (EC30 of 8c)", () => {
    const error = axiosErrorWith(422, errorBody("VALIDATION_ERROR", "Invalid request", [{ field: "body.file", issue: "Field required" }]));
    expect(getResumeUploadErrorResult(error)).toEqual({ kind: "alert", message: "Invalid request" });
  });
});
