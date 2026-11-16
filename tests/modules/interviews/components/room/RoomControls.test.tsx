// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";
import { RoomControls } from "@/modules/interviews/components/room/RoomControls";
import { CONTROL_LABELS, ROOM_SHORTCUTS } from "@/modules/interviews/constants";

afterEach(cleanup);

function renderControls(overrides: Partial<ComponentProps<typeof RoomControls>> = {}) {
  const props: ComponentProps<typeof RoomControls> = {
    phase: "your-turn",
    canAnswer: true,
    canReplay: true,
    clock: 65,
    muted: false,
    cameraOn: false,
    cameraStarting: false,
    canEnd: true,
    transcriptOpen: false,
    onToggleTranscript: vi.fn(),
    onAnswer: vi.fn(),
    onStop: vi.fn(),
    onCancel: vi.fn(),
    onToggleCamera: vi.fn(),
    onToggleMute: vi.fn(),
    onReplay: vi.fn(),
    onEnd: vi.fn(),
    ...overrides,
  };
  // The app wraps every page in a TooltipProvider (root layout).
  render(
    <TooltipProvider>
      <RoomControls {...props} />
    </TooltipProvider>,
  );
  return props;
}

const button = (name: string | RegExp) => screen.getByRole("button", { name });

describe("RoomControls", () => {
  it.each([CONTROL_LABELS.camera, CONTROL_LABELS.mute, CONTROL_LABELS.replay, CONTROL_LABELS.end, CONTROL_LABELS.transcript, CONTROL_LABELS.shortcuts])(
    "shows a tooltip naming %s on keyboard focus (AC1)",
    async (name) => {
      renderControls();
      act(() => button(name).focus());
      const tooltip = await screen.findByRole("tooltip");
      expect(tooltip.textContent).toBe(name);
    },
  );

  it("names Cancel with a tooltip while recording, and hides replay to keep one row (AC1, AC21)", async () => {
    renderControls({ phase: "recording" });
    act(() => button(CONTROL_LABELS.cancel).focus());
    expect((await screen.findByRole("tooltip")).textContent).toBe(CONTROL_LABELS.cancel);
    expect(screen.queryByRole("button", { name: CONTROL_LABELS.replay })).toBeNull();
  });

  it("toggles the transcript and reports its state (AC2)", () => {
    const props = renderControls({ transcriptOpen: true });
    const toggle = button(CONTROL_LABELS.transcript);
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(toggle);
    expect(props.onToggleTranscript).toHaveBeenCalled();
  });

  it("reports the camera and mute states through aria-pressed", () => {
    renderControls({ cameraOn: true, muted: true });
    expect(button(CONTROL_LABELS.camera).getAttribute("aria-pressed")).toBe("true");
    expect(button(CONTROL_LABELS.mute).getAttribute("aria-pressed")).toBe("true");
  });

  it("shows the interview clock (AC12)", () => {
    renderControls({ clock: 65 });
    expect(screen.getByText("1:05")).toBeTruthy();
  });

  it("lists the keyboard shortcuts in the help popover (AC13)", async () => {
    renderControls();
    fireEvent.click(button(CONTROL_LABELS.shortcuts));
    for (const { action } of ROOM_SHORTCUTS) {
      expect(await screen.findByText(action)).toBeTruthy();
    }
  });

  it("makes Answer prominent on the candidate's turn, with a ring that only moves when motion is allowed (AC14)", () => {
    renderControls({ phase: "your-turn" });
    const answer = button("Answer");
    expect(answer.className).toContain("sm:h-14");
    const ring = answer.parentElement?.querySelector("[aria-hidden]");
    expect(ring?.className).toContain("motion-safe:animate-ping");
  });

  it("is not prominent while the interviewer speaks", () => {
    renderControls({ phase: "speaking" });
    expect(button("Answer").className).not.toContain("sm:h-14");
  });

  describe("review card", () => {
    const review = { text: "I split the work by service.", canSend: true, onSend: vi.fn(), onRerecord: vi.fn() };

    it("shows the answer with Send and Re-record, which act (AC8)", () => {
      const onSend = vi.fn();
      const onRerecord = vi.fn();
      renderControls({ phase: "review", review: { ...review, onSend, onRerecord } });
      expect(screen.getByText(review.text)).toBeTruthy();
      fireEvent.click(button(/^Send/));
      fireEvent.click(button("Re-record"));
      expect(onSend).toHaveBeenCalled();
      expect(onRerecord).toHaveBeenCalled();
      expect(screen.queryByRole("button", { name: "Answer" })).toBeNull();
    });

    it("keeps the answer and Send with a failed send's message (EC12)", () => {
      renderControls({ phase: "review", review: { ...review, fieldError: "Answer is too long." } });
      expect(screen.getByRole("alert").textContent).toBe("Answer is too long.");
      expect(screen.getByText(review.text)).toBeTruthy();
      expect(button(/^Send/).hasAttribute("disabled")).toBe(false);
    });

    it("scrolls a long answer inside the card (EC11)", () => {
      renderControls({ phase: "review", review: { ...review, text: "word ".repeat(400) } });
      expect(screen.getByText(/word word/).className).toContain("overflow-y-auto");
    });

    it("is not shown outside review", () => {
      renderControls({ phase: "your-turn", review });
      expect(screen.queryByRole("button", { name: /^Send/ })).toBeNull();
    });
  });

  it("does not reopen End's tooltip when the End dialog gives focus back (EC13)", async () => {
    renderControls();
    fireEvent.click(button(CONTROL_LABELS.end));
    fireEvent.click(await screen.findByRole("button", { name: "Keep going" }));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
