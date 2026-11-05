import { describe, expect, it } from "vitest";

import { formatInterviewDate } from "@/modules/interviews/utils/format-interview-date";

// Intl may put a narrow no-break space before AM/PM; compare with plain spaces.
const plain = (text: string) => text.replace(/\s/g, " ");

describe("formatInterviewDate", () => {
  it("shows the date and the time (history AC3)", () => {
    expect(plain(formatInterviewDate("2026-11-04T09:30:00Z", "en-US", "UTC"))).toBe("Nov 4, 2026, 9:30 AM");
  });

  it("uses the given time zone, so the day can change", () => {
    expect(plain(formatInterviewDate("2026-11-04T23:30:00Z", "en-US", "Asia/Manila"))).toBe("Nov 5, 2026, 7:30 AM");
  });

  it("reads the timestamps cuewise-be sends (microseconds and an offset)", () => {
    expect(plain(formatInterviewDate("2026-11-04T18:39:33.167367+00:00", "en-US", "UTC"))).toBe(
      "Nov 4, 2026, 6:39 PM",
    );
  });
});
