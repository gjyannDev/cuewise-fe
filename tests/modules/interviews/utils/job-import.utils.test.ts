import { describe, expect, it } from "vitest";

import { GENERIC_ERROR_MESSAGE } from "@/lib/config/api.helper";
import {
  JOB_DESCRIPTION_MAX_LENGTH,
  JOB_IMPORT_FAILED_MESSAGE,
  JOB_PASTE_MAX_CHARS,
  JOB_URL_MAX_LENGTH,
} from "@/modules/interviews/constants";
import { jobImportResponseSchema, jobUrlSchema } from "@/modules/interviews/schemas/interviews.schema";
import {
  buildPastePayload,
  getJobImportErrorResult,
  shouldCleanPaste,
} from "@/modules/interviews/utils/job-import.utils";
import { axiosErrorWith, errorBody, networkError } from "@tests/helpers/axios";

describe("shouldCleanPaste", () => {
  it("leaves a paste that fits the job description alone", () => {
    // EC9: up to the limit, the browser pastes as usual, even if the field then overflows.
    expect(shouldCleanPaste("a".repeat(JOB_DESCRIPTION_MAX_LENGTH))).toBe(false);
  });

  it("cleans a paste longer than the job description can hold", () => {
    expect(shouldCleanPaste("a".repeat(JOB_DESCRIPTION_MAX_LENGTH + 1))).toBe(true);
  });

  it("measures the plain text, so a short paste with a big HTML copy is not cleaned", () => {
    expect(shouldCleanPaste("Short snippet")).toBe(false);
  });
});

describe("buildPastePayload", () => {
  const text = "Data Engineer\nWe are looking for…";

  it("sends the HTML copy when the browser has one", () => {
    // EC7: the HTML keeps the structure the server needs to drop menus and footers.
    expect(buildPastePayload({ html: "<main><h1>Data Engineer</h1></main>", text })).toEqual({
      content: "<main><h1>Data Engineer</h1></main>",
      format: "html",
    });
  });

  it.each(["", "   \n "])("falls back to the plain text when the HTML copy is blank (%j)", (html) => {
    // EC8
    expect(buildPastePayload({ html, text })).toEqual({ content: text, format: "text" });
  });

  it("falls back to the plain text when the HTML copy is over the server's limit", () => {
    // Cutting HTML mid-tag would break it; the plain text is the safer copy.
    const html = `<p>${"x".repeat(JOB_PASTE_MAX_CHARS)}</p>`;
    expect(buildPastePayload({ html, text })).toEqual({ content: text, format: "text" });
  });

  it("caps plain text at the server's limit", () => {
    const long = "y".repeat(JOB_PASTE_MAX_CHARS + 10);
    const payload = buildPastePayload({ html: "", text: long });
    expect(payload).toEqual({ content: "y".repeat(JOB_PASTE_MAX_CHARS), format: "text" });
  });
});

describe("jobUrlSchema", () => {
  it("accepts and trims an http(s) link", () => {
    expect(jobUrlSchema.parse("  https://jobs.example.com/posting/42?ref=x  ")).toBe(
      "https://jobs.example.com/posting/42?ref=x",
    );
    expect(jobUrlSchema.parse("http://jobs.example.com/1")).toBe("http://jobs.example.com/1");
  });

  it.each(["", "   "])("asks for a link when it is empty (%j)", (value) => {
    // EC1
    const result = jobUrlSchema.safeParse(value);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Enter a link");
  });

  it.each(["jobs.example.com/1", "ftp://jobs.example.com/x", "javascript:alert(1)", "not a link", "https://"])(
    "refuses a link that isn't http or https (%j)",
    (value) => {
      // EC2
      const result = jobUrlSchema.safeParse(value);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe("Enter a link starting with http:// or https://");
    },
  );

  it("refuses a link over the server's length limit", () => {
    // EC2
    const value = `https://jobs.example.com/${"a".repeat(JOB_URL_MAX_LENGTH)}`;
    expect(jobUrlSchema.safeParse(value).success).toBe(false);
  });
});

describe("jobImportResponseSchema", () => {
  it("parses the server's reply", () => {
    expect(jobImportResponseSchema.parse({ text: "Data Engineer", truncated: true })).toEqual({
      text: "Data Engineer",
      truncated: true,
    });
  });

  it.each([{ text: "x" }, { truncated: false }, { text: 1, truncated: false }])(
    "rejects a malformed reply (%j)",
    (body) => {
      expect(jobImportResponseSchema.safeParse(body).success).toBe(false);
    },
  );
});

describe("getJobImportErrorResult", () => {
  const unreachable = "We couldn't open that link. Please paste the job description instead.";
  const unreadable = "We couldn't read a job description from that page. Please paste the job description instead.";
  const pasteUnreadable =
    "We couldn't find a job description in what you pasted. Please paste just the job description into the box.";

  it.each([
    ["JOB_URL_UNREACHABLE", unreachable],
    ["JOB_URL_UNREADABLE", unreadable],
  ])("shows %s under the link field with the server's message", (code, message) => {
    // EC5, EC6
    expect(getJobImportErrorResult(axiosErrorWith(422, errorBody(code, message)))).toEqual({
      kind: "field",
      target: "url",
      message,
    });
  });

  it("shows JOB_TEXT_UNREADABLE under the job description", () => {
    // EC10
    expect(getJobImportErrorResult(axiosErrorWith(422, errorBody("JOB_TEXT_UNREADABLE", pasteUnreadable)))).toEqual({
      kind: "field",
      target: "jobDescription",
      message: pasteUnreadable,
    });
  });

  it("toasts the server's message when rate limited", () => {
    // EC13
    const message = "Too many job imports. Wait a moment and try again.";
    expect(getJobImportErrorResult(axiosErrorWith(429, errorBody("RATE_LIMITED", message)))).toEqual({
      kind: "toast",
      message,
    });
  });

  it.each([
    ["no response", networkError()],
    ["a 500", axiosErrorWith(500, errorBody("INTERNAL_ERROR", "An unexpected error occurred"))],
    ["a 503 from the forwarder", axiosErrorWith(503, errorBody("SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE))],
    ["a validation error", axiosErrorWith(422, errorBody("VALIDATION_ERROR", "Request validation failed"))],
    ["a body that isn't the API's", axiosErrorWith(502, "<html>Bad gateway</html>")],
    ["something that isn't an HTTP error", new Error("boom")],
  ])("toasts a generic message for %s", (_, error) => {
    // EC14: never a raw or internal message.
    expect(getJobImportErrorResult(error)).toEqual({ kind: "toast", message: JOB_IMPORT_FAILED_MESSAGE });
  });
});
