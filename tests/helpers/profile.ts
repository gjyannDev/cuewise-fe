import type { Profile } from "@/modules/profile/types/profile.types";

/** A synthetic profile as GET /profile returns it (no real person's data). */
export function profile(overrides: Partial<Profile> = {}): Profile {
  return {
    skills: ["Python", "FastAPI", "PostgreSQL"],
    roles: [
      {
        title: "Backend Engineer",
        organization: "Example Shop",
        period: "2021-2024",
        summary: "Built the order service.",
      },
    ],
    projects: [
      {
        name: "Payments ledger",
        description: "Rewrote the ledger with idempotent retries.",
        technologies: ["Python", "Redis"],
      },
    ],
    updated_at: "2026-11-15T09:00:00Z",
    ...overrides,
  };
}
