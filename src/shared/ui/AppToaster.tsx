"use client";

import type { ComponentProps, CSSProperties } from "react";

import { Toaster } from "@/components/ui/sonner";

/**
 * The generated shadcn Toaster points Sonner at `--popover`, `--popover-foreground` and `--border`,
 * but this project's tokens are `--color-*` (globals.css). Those missing variables made the toast
 * lose its background/text/border, and Sonner's hard-coded grey was left on the description.
 * Light theme only, because globals.css defines no dark tokens.
 */
const tokenStyle = {
  "--normal-bg": "var(--color-popover)",
  "--normal-text": "var(--color-popover-foreground)",
  "--normal-border": "var(--color-border)",
  "--border-radius": "var(--radius)",
} as CSSProperties;

type AppToasterProps = ComponentProps<typeof Toaster>;

export function AppToaster(props: AppToasterProps) {
  return (
    <Toaster
      theme="light"
      style={tokenStyle}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          // `!`: Sonner's own description rule is more specific than a utility class.
          description: "text-black-secondary!",
        },
      }}
      {...props}
    />
  );
}
