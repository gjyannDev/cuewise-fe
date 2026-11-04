import { describe, expect, it } from "vitest";

import { appendTranscript } from "@/modules/interviews/utils/append-transcript";

describe("appendTranscript", () => {
  it("fills an empty box with the transcript alone", () => {
    expect(appendTranscript("", "I'd use a queue.")).toBe("I'd use a queue.");
  });

  it("treats a box of only whitespace as empty", () => {
    expect(appendTranscript("  \n ", "I'd use a queue.")).toBe("I'd use a queue.");
  });

  it("adds the transcript after the typed text with one space (EC7)", () => {
    expect(appendTranscript("First, I'd profile it.", "Then I'd add a cache.")).toBe(
      "First, I'd profile it. Then I'd add a cache.",
    );
  });

  it("starts right after a trailing line break, without an extra space", () => {
    expect(appendTranscript("My plan:\n", "profile, then cache.")).toBe("My plan:\nprofile, then cache.");
  });

  it("doesn't double up trailing spaces", () => {
    expect(appendTranscript("First, I'd profile it.   ", "Then cache.")).toBe("First, I'd profile it. Then cache.");
  });

  it("trims the transcript's own edges", () => {
    expect(appendTranscript("A.", "  B.  ")).toBe("A. B.");
  });

  it("keeps everything when the result is over the 2000-character limit (EC8)", () => {
    const typed = "a".repeat(1500);
    const spoken = "b".repeat(800);

    expect(appendTranscript(typed, spoken)).toHaveLength(1500 + 1 + 800);
  });
});
