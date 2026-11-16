"use client";

import { useSyncExternalStore } from "react";

import type { LevelSource } from "@/lib/media";
import { cn } from "@/lib/utils";

type LevelMeterProps = {
  /** The microphone's live level (the recorder's `level`). */
  source: LevelSource;
  className?: string;
};

/** Each bar lights from this share of the level up, so a quiet voice moves the first bars and a loud one all five. */
const BAR_STEPS = [0.04, 0.15, 0.3, 0.45, 0.6];

const noLevel = () => 0;

/**
 * A small microphone level meter (five bars, like a call app's): shows the candidate they are being heard. Decorative,
 * so screen readers get the text beside it instead; its own file because the lobby's mic test and the stage's recording
 * chip both use it, and it alone re-renders on every level reading.
 */
export function LevelMeter({ source, className }: LevelMeterProps) {
  const level = useSyncExternalStore(source.subscribe, source.get, noLevel);

  return (
    <span aria-hidden data-level={level.toFixed(2)} className={cn("flex h-4 items-end gap-0.5", className)}>
      {BAR_STEPS.map((step, index) => (
        <span
          key={step}
          data-active={level >= step}
          className="w-1 rounded-full bg-current opacity-30 transition-[height,opacity] duration-75 data-[active=true]:opacity-100 motion-reduce:transition-none"
          style={{ height: `${40 + index * 15}%` }}
        />
      ))}
    </span>
  );
}
