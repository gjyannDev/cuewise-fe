/**
 * When an interview started, as a date and time in the reader's locale and time zone (both overridable, so tests are
 * deterministic). Only called in the browser, so the server never renders a time zone the reader isn't in.
 */
export function formatInterviewDate(iso: string, locale?: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(iso));
}
