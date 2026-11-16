// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEVICE_ERROR_MESSAGES, type LevelSource } from "@/lib/media";
import { InterviewLobby } from "@/modules/interviews/components/room/InterviewLobby";
import {
  LOBBY_TIP,
  MIC_CHECK_MESSAGES,
  MIC_TEST_HEARD,
  MIC_TEST_LABEL,
  MIC_TEST_LISTENING,
  MIC_TEST_NOT_HEARD,
} from "@/modules/interviews/constants";

afterEach(cleanup);

const level: LevelSource = { get: () => 0, subscribe: () => () => {} };

function renderLobby(overrides: Partial<ComponentProps<typeof InterviewLobby>> = {}) {
  const props: ComponentProps<typeof InterviewLobby> = {
    summary: "Junior Backend · 3 questions · about 10 min",
    initials: "SA",
    cameraStream: null,
    cameraStarting: false,
    cameraError: null,
    onToggleCamera: vi.fn(),
    mic: "ready",
    onCheckMic: vi.fn(),
    micTest: { listening: false, heard: null, level, onTest: vi.fn() },
    onJoin: vi.fn(),
    ...overrides,
  };
  render(<InterviewLobby {...props} />);
  return props;
}

const devices = () => screen.getByRole("status", { name: "Devices" });

describe("InterviewLobby", () => {
  it("says what the interview is and gives one tip (AC17)", () => {
    renderLobby();
    expect(screen.getByText("Junior Backend · 3 questions · about 10 min")).toBeTruthy();
    expect(screen.getByText(LOBBY_TIP)).toBeTruthy();
  });

  it("offers a mic test that starts on press (AC5)", () => {
    const props = renderLobby();
    fireEvent.click(screen.getByRole("button", { name: MIC_TEST_LABEL }));
    expect(props.micTest?.onTest).toHaveBeenCalled();
  });

  it("shows no mic test where the browser can't read a level (EC1)", () => {
    renderLobby({ micTest: undefined });
    expect(screen.queryByRole("button", { name: MIC_TEST_LABEL })).toBeNull();
    expect(devices().textContent).toContain("Microphone ready");
  });

  it("asks the candidate to speak, with a meter, while the test listens", () => {
    renderLobby({ micTest: { listening: true, heard: null, level, onTest: vi.fn() } });
    expect(devices().textContent).toContain(MIC_TEST_LISTENING);
    expect(devices().querySelector("[data-level]")).not.toBeNull();
    expect(screen.getByRole("button", { name: MIC_TEST_LABEL }).hasAttribute("disabled")).toBe(true);
  });

  it("says the result in the status region when the test ends", () => {
    renderLobby({ micTest: { listening: false, heard: true, level, onTest: vi.fn() } });
    expect(devices().textContent).toContain(MIC_TEST_HEARD);
  });

  it("says when the test heard nothing", () => {
    renderLobby({ micTest: { listening: false, heard: false, level, onTest: vi.fn() } });
    expect(devices().textContent).toContain(MIC_TEST_NOT_HEARD);
  });

  it("shows the microphone problem and its retry instead of the test (EC2)", () => {
    const props = renderLobby({ mic: "denied" });
    expect(devices().textContent).toContain(MIC_CHECK_MESSAGES.denied);
    expect(screen.queryByRole("button", { name: MIC_TEST_LABEL })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Check microphone again" }));
    expect(props.onCheckMic).toHaveBeenCalled();
  });

  it("names the fix when the camera is blocked (EC15)", () => {
    renderLobby({ cameraError: "denied" });
    expect(devices().textContent).toContain(DEVICE_ERROR_MESSAGES.camera.denied);
  });

  it("joins on Join now", () => {
    const props = renderLobby();
    fireEvent.click(screen.getByRole("button", { name: "Join now" }));
    expect(props.onJoin).toHaveBeenCalled();
  });
});
