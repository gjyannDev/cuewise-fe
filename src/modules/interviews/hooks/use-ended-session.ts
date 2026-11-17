import { useLayoutEffect, useState } from "react";

/**
 * Whether the candidate ended this interview on this screen. Ending is client-only (cuewise-be has no end endpoint, so
 * the session stays in progress), which makes leaving the screen the end of it: Resume from the dashboard or history
 * opens the interview again. With `cacheComponents` a page left behind is hidden in `<Activity>`, not unmounted, so
 * its state survives; the reset runs in a layout-effect cleanup, which fires when the page is hidden.
 */
export function useEndedSession(sessionId: string | undefined) {
  const [endedSessionId, setEndedSessionId] = useState<string>();

  useLayoutEffect(() => () => setEndedSessionId(undefined), []);

  return {
    isEnded: sessionId !== undefined && endedSessionId === sessionId,
    end: () => setEndedSessionId(sessionId),
  };
}
