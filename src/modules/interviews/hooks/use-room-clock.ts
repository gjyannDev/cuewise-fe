import { useEffect, useLayoutEffect, useState } from "react";

/**
 * The interview clock: whole seconds since `running` turned on (Join), frozen when it turns off (the interview closed).
 * It starts again from 0 the next time, including after the router hid and showed the page (effects re-run then).
 */
export function useRoomClock(running: boolean): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  // A new run starts from 0: reset when it turns on (adjusting state during render, not in an effect).
  const [wasRunning, setWasRunning] = useState(running);
  if (running !== wasRunning) {
    setWasRunning(running);
    if (running) setElapsed(0);
  }

  // Hidden by the router (`<Activity>` keeps state): a return must not show the old time.
  useLayoutEffect(() => () => setElapsed(0), []);

  return elapsed;
}
