"use client";

import { type RefObject, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EndInterviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  /** Where focus goes back on "Keep going" (the control that opened the dialog, e.g. the title menu button). */
  returnFocusTo?: RefObject<HTMLElement | null>;
};

/**
 * Confirmation for ending the interview, opened from the title menu. On confirm the dialog closes first and the
 * interview ends once it has: otherwise the dialog's focus return and the closing card's own focus would race.
 */
export function EndInterviewDialog({ open, onOpenChange, onConfirm, returnFocusTo }: EndInterviewDialogProps) {
  const confirmed = useRef(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (confirmed.current) {
            confirmed.current = false;
            onConfirm();
            return;
          }
          // The menu item that opened the dialog is gone, so return focus to the menu's button instead.
          returnFocusTo?.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>End this interview?</DialogTitle>
          <DialogDescription>
            Your answers so far are saved. You&apos;ll leave this interview and can start a new one any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="h-11">
              Keep going
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="h-11"
            onClick={() => {
              confirmed.current = true;
              onOpenChange(false);
            }}
          >
            End interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
