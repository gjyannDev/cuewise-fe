import { Activity, type ReactNode } from "react";

/**
 * A `renderHook` wrapper that can hide its hook the way Next.js does with `cacheComponents`: on navigation the page is
 * kept in a hidden `<Activity>` (effects cleaned up, state kept) instead of unmounted. Change the mode, then `rerender()`.
 */
export function activityWrapper() {
  let mode: "visible" | "hidden" = "visible";
  return {
    wrapper: ({ children }: { children: ReactNode }) => <Activity mode={mode}>{children}</Activity>,
    setMode: (next: "visible" | "hidden") => {
      mode = next;
    },
  };
}
