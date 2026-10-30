import { useEffect } from "react";

import { isUnloadWarningBypassed } from "@/lib/unload-guard";

/**
 * Shows the browser's own "leave site?" prompt on reload or tab close while `when` is true (e.g. unsent input).
 * Nothing is saved; this only guards against an accidental reload. In-app navigation is not covered. An effect is
 * the right tool here: it subscribes to a browser event for as long as the condition holds.
 */
export function useWarnBeforeUnload(when: boolean) {
  useEffect(() => {
    if (!when) {
      return;
    }
    const warn = (event: BeforeUnloadEvent) => {
      if (isUnloadWarningBypassed()) {
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [when]);
}
