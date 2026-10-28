import { describe, expect, it } from "vitest";

import { getInitials } from "@/shared/sidebar/utils/get-initials";

describe("getInitials", () => {
  it("uses the first letters of a separated local part", () => {
    expect(getInitials("jane.doe@example.com")).toBe("JD");
    expect(getInitials("jane_doe-smith@example.com")).toBe("JD");
  });

  it("uses the first letter of a single-word local part", () => {
    expect(getInitials("jane@example.com")).toBe("J");
  });

  it("falls back for empty or odd input", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("@example.com")).toBe("?");
    expect(getInitials("..@example.com")).toBe("?");
  });
});
