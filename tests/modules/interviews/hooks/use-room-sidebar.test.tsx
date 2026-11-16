// @vitest-environment happy-dom
import { act, render } from "@testing-library/react";
import { Activity } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useRoomSidebar } from "@/modules/interviews/hooks/use-room-sidebar";

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * The room inside an `<Activity>` (how Next 16 hides a left page), with a probe outside it reading the sidebar, like
 * AppShell's sidebar outside the hidden page.
 */
function renderRoomSidebar(active: boolean, { defaultOpen = true } = {}) {
  let sidebar: ReturnType<typeof useSidebar> | undefined;
  let mode: "visible" | "hidden" = "visible";
  let show = true;
  const Probe = () => {
    sidebar = useSidebar();
    return null;
  };
  const Room = ({ isActive }: { isActive: boolean }) => {
    useRoomSidebar(isActive);
    return null;
  };
  const tree = (isActive: boolean) => (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Probe />
      <Activity mode={mode}>{show && <Room isActive={isActive} />}</Activity>
    </SidebarProvider>
  );
  const view = render(tree(active));
  return {
    open: () => sidebar?.open,
    setOpen: (next: boolean) => act(() => sidebar?.setOpen(next)),
    rerender: (isActive: boolean) => view.rerender(tree(isActive)),
    hide: (isActive: boolean) => {
      mode = "hidden";
      view.rerender(tree(isActive));
    },
    reveal: (isActive: boolean) => {
      mode = "visible";
      view.rerender(tree(isActive));
    },
    unmountRoom: () => {
      show = false;
      view.rerender(tree(active));
    },
  };
}

describe("useRoomSidebar", () => {
  it("collapses the sidebar while the room is active (AC16)", () => {
    expect(renderRoomSidebar(true).open()).toBe(false);
  });

  it("leaves the sidebar alone while inactive (a finished interview, EC8)", () => {
    expect(renderRoomSidebar(false).open()).toBe(true);
  });

  it("restores the sidebar when the interview closes (EC19)", () => {
    const room = renderRoomSidebar(true);
    room.rerender(false);
    expect(room.open()).toBe(true);
  });

  it("restores a sidebar that was already collapsed as collapsed", () => {
    const room = renderRoomSidebar(true, { defaultOpen: false });
    expect(room.open()).toBe(false);
    room.rerender(false);
    expect(room.open()).toBe(false);
  });

  it("restores the sidebar when the room unmounts", () => {
    const room = renderRoomSidebar(true);
    room.unmountRoom();
    expect(room.open()).toBe(true);
  });

  it("restores the sidebar when the page is hidden by the router, and collapses it again on return (EC14)", () => {
    const room = renderRoomSidebar(true);
    room.hide(true);
    expect(room.open()).toBe(true);

    room.reveal(true);
    expect(room.open()).toBe(false);
  });

  it("keeps a sidebar the candidate reopened by hand open, and restores the entry state on close (EC7)", () => {
    const room = renderRoomSidebar(true, { defaultOpen: false });
    room.setOpen(true);
    expect(room.open()).toBe(true);

    room.rerender(false);
    expect(room.open()).toBe(false);
  });

  it("does nothing on a phone, where the sidebar is a sheet (EC9)", () => {
    vi.stubGlobal(
      "matchMedia",
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    expect(renderRoomSidebar(true).open()).toBe(true);
  });
});
