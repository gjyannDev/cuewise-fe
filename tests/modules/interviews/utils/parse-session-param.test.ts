import { describe, expect, it } from "vitest";

import { parseSessionParam } from "@/modules/interviews/utils/parse-session-param";

const ID = "0b7c2f4e-5d1a-4c3b-9e8f-1a2b3c4d5e6f";

describe("parseSessionParam", () => {
  it.each([undefined, ""])("treats %j as no session", (raw) => {
    expect(parseSessionParam(raw)).toEqual({ kind: "none" });
  });

  it("accepts a UUID", () => {
    expect(parseSessionParam(ID)).toEqual({ kind: "valid", id: ID });
  });

  it("accepts the UUID v7 ids cuewise-be issues", () => {
    const v7 = "01a181db-fb0e-7386-9cf3-50c73a9c44f3";

    expect(parseSessionParam(v7)).toEqual({ kind: "valid", id: v7 });
  });

  it.each(["abc", "42", `${ID}x`])("marks %j as invalid", (raw) => {
    expect(parseSessionParam(raw)).toEqual({ kind: "invalid" });
  });

  it("marks a repeated param as invalid", () => {
    expect(parseSessionParam([ID, ID])).toEqual({ kind: "invalid" });
  });
});
