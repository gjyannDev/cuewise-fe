// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { LevelSource } from "@/lib/media";
import { InterviewRoom } from "@/modules/interviews/components/room/InterviewRoom";
import { SILENCE_HINT } from "@/modules/interviews/constants";
import type { InterviewSession, TranscriptLine } from "@/modules/interviews/types/interviews.types";
import { Q1, Q2, SESSION_ID, transcriptItem } from "@tests/helpers/interviews";

afterEach(cleanup);

const session = {
  id: SESSION_ID,
  role: "backend",
  level: "junior",
  interview_type: "mixed",
  question_count: 3,
  status: "in_progress",
  use_profile: false,
  created_at: "2026-11-16T09:00:00Z",
} as unknown as InterviewSession;

const line = (item: ReturnType<typeof transcriptItem>): TranscriptLine => ({ ...item, key: item.id });
const items = [line(transcriptItem("question", Q1, 1)), line(transcriptItem("answer", Q1, 1)), line(transcriptItem("question", Q2, 2))];
const level: LevelSource = { get: () => 0, subscribe: () => () => {} };

function renderRoom(overrides: Partial<ComponentProps<typeof InterviewRoom>> = {}) {
  const props: ComponentProps<typeof InterviewRoom> = {
    session,
    view: { items, mainNumber: 2 },
    phase: "your-turn",
    initials: "SA",
    transcriptOpen: false,
    onTranscriptOpenChange: vi.fn(),
    footer: null,
    onJump: vi.fn(),
    ...overrides,
  };
  const view = render(<InterviewRoom {...props} />);
  return { ...view, props };
}

const stage = () => screen.getByRole("region", { name: "Stage" });

describe("InterviewRoom", () => {
  it("has exactly one status region in every phase (AC20)", () => {
    for (const phase of ["speaking", "recording", "review", "thinking", "closed"] as const) {
      const { container, unmount } = renderRoom({
        phase,
        silent: true,
        recording: { elapsed: 12, maxSeconds: 120, level },
      });
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
      expect(container.querySelectorAll("[aria-live]:not([aria-live='off'])").length).toBeLessThanOrEqual(2);
      unmount();
    }
  });

  it("shows the interviewer's last line as captions that are not a live region (AC10)", () => {
    renderRoom();
    const captions = screen.getByText("question 2");
    expect(captions.closest("[aria-live]")).toBeNull();
    expect(captions.className).toContain("line-clamp-3");
  });

  it("keeps the captions when the interviewer is muted (EC18)", () => {
    renderRoom({ phase: "your-turn" });
    expect(screen.getByText("question 2")).toBeTruthy();
  });

  it("shows a recording chip with the time and a meter while recording (AC3)", () => {
    renderRoom({ phase: "recording", recording: { elapsed: 12, maxSeconds: 120, level } });
    const timer = screen.getByRole("timer");
    expect(timer.textContent).toBe("0:12 / 2:00");
    expect(timer.parentElement?.querySelector("[data-level]")).not.toBeNull();
  });

  it("says the silence hint in the status region while recording (AC4)", () => {
    renderRoom({ phase: "recording", silent: true, recording: { elapsed: 4, maxSeconds: 120 } });
    expect(screen.getByRole("status").textContent).toContain(SILENCE_HINT);
  });

  it("does not show the silence hint outside a recording", () => {
    renderRoom({ phase: "your-turn", silent: true });
    expect(screen.getByRole("status").textContent).not.toContain(SILENCE_HINT);
  });

  it("names the tiles and rings the interviewer while it speaks, moving only when motion is allowed (AC9, EC16)", () => {
    renderRoom({ phase: "speaking" });
    expect(stage().textContent).toContain("Interviewer");
    expect(stage().textContent).toContain("You");
    const rings = stage().querySelectorAll(".rounded-full.ring-4, .motion-safe\\:animate-ping");
    expect(rings.length).toBe(2);
  });

  it("uses the dark call surface for the stage (AC18)", () => {
    renderRoom();
    expect(stage().querySelector(".dark")).not.toBeNull();
  });

  it("shows the progress as a bar read as Question N of M (AC11)", () => {
    renderRoom();
    const progress = screen.getByRole("progressbar", { name: "Interview progress" });
    expect(progress.getAttribute("aria-valuetext")).toBe("Question 2 of 3");
    expect(screen.queryByText("2 of 3")).toBeNull();
  });

  it("keeps the transcript out of the page while closed, and shows it beside the stage when open (AC2)", () => {
    const { unmount } = renderRoom({ transcriptOpen: false });
    expect(screen.queryByRole("region", { name: "Transcript" })).toBeNull();
    unmount();
    renderRoom({ transcriptOpen: true });
    expect(screen.getByRole("region", { name: "Transcript" })).toBeTruthy();
  });

  it("offers a transcript toggle on the stage once the interview is over", () => {
    renderRoom({ phase: "closed" });
    expect(screen.getByRole("button", { name: "Transcript" })).toBeTruthy();
  });

  it("shows the closing content on the stage in place of the tiles and captions", () => {
    const { container } = renderRoom({ phase: "closed", closing: <h2>Interview ended</h2> });

    expect(stage().textContent).toContain("Interview ended");
    expect(screen.queryByText("question 2")).toBeNull();
    expect(screen.queryByText("You")).toBeNull();
    expect(container.querySelectorAll('[role="status"]')).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Transcript" })).toBeTruthy();
  });
});
