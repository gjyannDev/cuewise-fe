"use client";

import { useEffect } from "react";
import { toast } from "sonner";

/** Shown on /signin?expired=1. The fixed toast id keeps it to one toast even if effects run twice. */
export function SessionExpiredNotice() {
  useEffect(() => {
    toast.info("Your session expired, please sign in again", { id: "session-expired" });
  }, []);

  return null;
}
