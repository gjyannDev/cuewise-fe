import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How one `play` ended: it played through, `stop` (or a newer `play`) cut it short, the browser couldn't play it, or
 * the browser's autoplay rules refused it (`NotAllowedError`; usually iOS without a fresh tap).
 */
export type PlaybackEnd = "ended" | "stopped" | "failed" | "blocked";

/**
 * One audio element for every clip, so a single user gesture (`unlock`) is enough for every later automatic play.
 * One clip plays at a time: a new `play` stops the current one. Clips come in as Blobs; the player keeps one object
 * URL per key (so a replay costs nothing) and revokes them all when it unmounts.
 */
export function useAudioPlayer() {
  const element = useRef<HTMLAudioElement | null>(null);
  const urls = useRef(new Map<string, string>());
  // Settles the promise of the clip that is playing now.
  const settle = useRef<((end: PlaybackEnd) => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audio = useCallback(() => {
    element.current ??= new Audio();
    return element.current;
  }, []);

  const finish = useCallback((end: PlaybackEnd) => {
    const done = settle.current;
    settle.current = null;
    setIsPlaying(false);
    done?.(end);
  }, []);

  /**
   * Call inside a user gesture (the Join click). `play()` on an element without a source never settles until a source
   * is set, so it is deliberately not awaited: awaiting it would hang the click handler (found in the Step 4 check).
   */
  const unlock = useCallback(() => {
    audio()
      .play()
      .catch(() => undefined);
  }, [audio]);

  const stop = useCallback(() => {
    element.current?.pause();
    finish("stopped");
  }, [finish]);

  /** Plays `url` from the start and resolves once it has ended, been stopped, failed or been blocked. */
  const play = useCallback(
    (url: string) => {
      finish("stopped");
      const el = audio();
      el.pause();
      el.src = url;
      el.currentTime = 0;
      return new Promise<PlaybackEnd>((resolve) => {
        settle.current = resolve;
        setIsPlaying(true);
        el.onended = () => finish("ended");
        el.onerror = () => finish("failed");
        el.play().catch((error: unknown) => {
          // A newer play or a stop already settled this one.
          if (settle.current !== resolve) return;
          finish(error instanceof DOMException && error.name === "NotAllowedError" ? "blocked" : "failed");
        });
      });
    },
    [audio, finish],
  );

  /** The object URL for this clip, made once per key and reused for replays. */
  const urlFor = useCallback((key: string, clip: Blob) => {
    const known = urls.current.get(key);
    if (known) return known;
    const url = URL.createObjectURL(clip);
    urls.current.set(key, url);
    return url;
  }, []);

  /** Whether a clip for this key is already cached (a replay needs no network then). */
  const has = useCallback((key: string) => urls.current.has(key), []);

  // Unmounting, or Next.js hiding the page (its state is kept), stops the clip and lets go of every URL; the clips stay
  // in the caller's cache, so a return makes fresh URLs.
  useEffect(() => {
    const owned = urls.current;
    return () => {
      element.current?.pause();
      finish("stopped");
      owned.forEach((url) => URL.revokeObjectURL(url));
      owned.clear();
    };
  }, [finish]);

  return { unlock, play, stop, urlFor, has, isPlaying };
}
