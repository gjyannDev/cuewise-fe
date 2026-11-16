import { useLayoutEffect, useRef } from "react";

import { useSidebar } from "@/components/ui/sidebar";

/**
 * Collapses the app sidebar while a live interview is on screen (the lobby and the room), for a focused, call-like
 * page, and puts it back the way it was on entry when the interview closes, the screen unmounts, or the router hides the
 * page in `<Activity>` (a layout-effect cleanup runs then too). A sidebar the candidate reopens by hand stays open until
 * then. On a phone the sidebar is a sheet that is already closed, so nothing is touched.
 */
export function useRoomSidebar(active: boolean) {
  const { open, setOpen, isMobile } = useSidebar();
  // shadcn's `setOpen` changes identity whenever `open` does; read both through refs so a hand toggle doesn't re-run
  // the collapse below.
  const latest = useRef({ open, setOpen });
  useLayoutEffect(() => {
    latest.current = { open, setOpen };
  });

  useLayoutEffect(() => {
    if (!active || isMobile) return;
    const entryOpen = latest.current.open;
    latest.current.setOpen(false);
    return () => latest.current.setOpen(entryOpen);
  }, [active, isMobile]);
}
