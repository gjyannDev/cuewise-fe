"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EndInterviewDialogProps = {
  onConfirm: () => void;
};

/** The End interview button plus its confirmation. Radix traps focus and returns it to the button on cancel. */
export function EndInterviewDialog({ onConfirm }: EndInterviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11 w-full">
          End interview
        </Button>
      </DialogTrigger>
      <DialogContent>
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
          <Button variant="destructive" className="h-11" onClick={onConfirm}>
            End interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
