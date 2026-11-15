import { describe, expect, it } from "vitest";

import { RESUME_MAX_BYTES } from "@/modules/profile/constants";
import { profileSchema, resumeFileSchema } from "@/modules/profile/schemas/profile.schema";
import { profile } from "@tests/helpers/profile";

const fileOf = (name: string, size: number) => new File([new Uint8Array(size)], name);

describe("resumeFileSchema", () => {
  it.each(["resume.pdf", "Resume.PDF", "cv.docx", "my.cv.final.DOCX"])("accepts %s (AC3)", (name) => {
    expect(resumeFileSchema.safeParse(fileOf(name, 1024)).success).toBe(true);
  });

  it("accepts a file of exactly the size limit (AC3)", () => {
    expect(resumeFileSchema.safeParse(fileOf("resume.pdf", RESUME_MAX_BYTES)).success).toBe(true);
  });

  it.each(["resume.doc", "resume.docm", "resume.txt", "resume.pdf.exe", "resume", "pdf"])(
    "refuses %s by name, before any request (EC3, EC4)",
    (name) => {
      const result = resumeFileSchema.safeParse(fileOf(name, 1024));
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe("Choose a PDF or .docx file");
    },
  );

  it("refuses a file over 2 MB (EC3)", () => {
    const result = resumeFileSchema.safeParse(fileOf("resume.pdf", RESUME_MAX_BYTES + 1));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Choose a file of up to 2 MB");
  });

  it("refuses an empty file", () => {
    expect(resumeFileSchema.safeParse(fileOf("resume.pdf", 0)).success).toBe(false);
  });

  it("refuses no file at all", () => {
    expect(resumeFileSchema.safeParse(undefined).error?.issues[0]?.message).toBe("Choose your résumé file");
  });
});

describe("profileSchema", () => {
  it("parses the stored profile as GET /profile returns it", () => {
    expect(profileSchema.parse(profile())).toEqual(profile());
  });

  it("parses a profile with only skills (EC21)", () => {
    const onlySkills = profile({ roles: [], projects: [] });
    expect(profileSchema.parse(onlySkills)).toEqual(onlySkills);
  });

  it("rejects a profile without updated_at", () => {
    expect(profileSchema.safeParse({ ...profile(), updated_at: undefined }).success).toBe(false);
  });

  it("rejects a role without a title", () => {
    const role = { organization: "Acme", period: "2021-2024", summary: "Built things." };
    expect(profileSchema.safeParse(profile({ roles: [role as never] })).success).toBe(false);
  });
});
