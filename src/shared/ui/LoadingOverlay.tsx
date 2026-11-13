"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ReactNode } from "react";

import { Dialog, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingOverlayProps = {
  /** Shown while work that the screen must wait for is running. */
  open: boolean;
  /** What is happening, e.g. "Starting your interview…". Read out by screen readers as the dialog's name. */
  title: string;
  description?: ReactNode;
  className?: string;
};

/**
 * A full-screen, non-dismissible loading state: a dark backdrop over the page, a spinner and a short message.
 * Use it while the user must wait for a request before doing anything else (starting an interview, importing a
 * posting). It is built on the shadcn Dialog (Radix), so it blocks clicks and keyboard focus on the page beneath, is
 * announced as a modal, and can't be closed with Escape or a click outside: it closes when `open` turns false.
 *
 * It never moves focus when it closes: the caller decides where focus goes once the work is done.
 */
export function LoadingOverlay({ open, title, description, className }: LoadingOverlayProps) {
  return (
    <Dialog open={open}>
      <DialogPortal>
        {/* Darker than a regular dialog's backdrop: the page behind is unavailable, not just in the background. */}
        <DialogOverlay className="bg-black/60" />
        <DialogPrimitive.Content
          data-slot="loading-overlay"
          aria-busy="true"
          // Without a description, tell Radix there is none (it warns otherwise).
          {...(description ? {} : { "aria-describedby": undefined })}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className={cn(
            "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-xl bg-popover p-6 text-center text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-none sm:max-w-sm",
            "duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
        >
          {/* The title already says what is loading; the spinner is decoration for assistive technology. */}
          <Spinner aria-hidden role="presentation" className="size-8 text-primary motion-reduce:animate-none" />
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
