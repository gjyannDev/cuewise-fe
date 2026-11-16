/**
 * Fakes for the browser media APIs the room uses. happy-dom has no real camera, microphone or audio playback, so DOM
 * tests install these instead of relying on its partial implementations. Call `installMediaFakes()` in a test (or a
 * `beforeEach`) and `restore()` afterwards.
 */
import { vi } from "vitest";

export type FakeTrack = { kind: "audio" | "video"; readyState: "live" | "ended"; stop: () => void };

export function fakeTrack(kind: FakeTrack["kind"]): FakeTrack {
  const track: FakeTrack = {
    kind,
    readyState: "live",
    stop: () => {
      track.readyState = "ended";
    },
  };
  return track;
}

export function fakeStream(...tracks: FakeTrack[]): MediaStream {
  return { getTracks: () => tracks } as unknown as MediaStream;
}

/** A DOMException as browsers throw it (`name` is what callers branch on). */
export const domError = (name: string) => new DOMException(name, name);

export type MediaFakes = {
  /** `navigator.mediaDevices.getUserMedia`: resolves a stream with the requested kinds of track by default. */
  getUserMedia: ReturnType<typeof vi.fn>;
  /** Every stream handed out, so tests can check its tracks were stopped. */
  streams: MediaStream[];
  /** `HTMLMediaElement.prototype.play`: resolves by default; make it reject with `domError("NotAllowedError")`. */
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  /** Object URLs created and revoked, so tests can check none leak. */
  created: string[];
  revoked: string[];
  restore: () => void;
};

export function installMediaFakes(): MediaFakes {
  const streams: MediaStream[] = [];
  const created: string[] = [];
  const revoked: string[] = [];

  const getUserMedia = vi.fn(async (constraints: MediaStreamConstraints) => {
    const tracks = [
      ...(constraints.audio ? [fakeTrack("audio")] : []),
      ...(constraints.video ? [fakeTrack("video")] : []),
    ];
    const stream = fakeStream(...tracks);
    streams.push(stream);
    return stream;
  });
  const originalMediaDevices = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });

  const play = vi.fn(async () => undefined);
  const pause = vi.fn();
  const originalPlay = HTMLMediaElement.prototype.play;
  const originalPause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.play = play as unknown as HTMLMediaElement["play"];
  HTMLMediaElement.prototype.pause = pause;

  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  URL.createObjectURL = (() => {
    const url = `blob:fake/${created.length + 1}`;
    created.push(url);
    return url;
  }) as typeof URL.createObjectURL;
  URL.revokeObjectURL = (url: string) => {
    revoked.push(url);
  };

  return {
    getUserMedia,
    streams,
    play,
    pause,
    created,
    revoked,
    restore: () => {
      if (originalMediaDevices) {
        Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
      } else {
        Reflect.deleteProperty(navigator, "mediaDevices");
      }
      HTMLMediaElement.prototype.play = originalPlay;
      HTMLMediaElement.prototype.pause = originalPause;
      URL.createObjectURL = originalCreate;
      URL.revokeObjectURL = originalRevoke;
    },
  };
}

export type AudioLevelFake = {
  /** The amplitude (0 to 1) every analyser reads next: 0 is silence, 0.5 a clear voice. */
  setAmplitude: (amplitude: number) => void;
  /** Audio contexts created, so tests can check they were closed. */
  contexts: { state: "running" | "suspended" | "closed" }[];
  restore: () => void;
};

/**
 * A fake Web Audio graph (`AudioContext` with a mic source and an `AnalyserNode`) for level tests. happy-dom has no
 * Web Audio; without this fake a recorder reports levels as unsupported, which is itself a case worth testing.
 */
export function installAudioLevelFake(): AudioLevelFake {
  let amplitude = 0;
  const contexts: AudioLevelFake["contexts"] = [];
  class FakeAudioContext {
    state: "running" | "suspended" | "closed" = "running";
    constructor() {
      contexts.push(this);
    }
    resume = async () => undefined;
    close = async () => {
      this.state = "closed";
    };
    createMediaStreamSource = () => ({ connect: () => undefined, disconnect: () => undefined });
    createAnalyser = () => ({
      fftSize: 2048,
      getFloatTimeDomainData: (buffer: Float32Array) => {
        for (let i = 0; i < buffer.length; i += 1) buffer[i] = i % 2 ? amplitude : -amplitude;
      },
    });
  }
  const original = Object.getOwnPropertyDescriptor(globalThis, "AudioContext");
  Object.defineProperty(globalThis, "AudioContext", { configurable: true, writable: true, value: FakeAudioContext });
  return {
    setAmplitude: (next) => {
      amplitude = next;
    },
    contexts,
    restore: () => {
      if (original) Object.defineProperty(globalThis, "AudioContext", original);
      else Reflect.deleteProperty(globalThis, "AudioContext");
    },
  };
}

/** A `MediaRecorder` stand-in that records one byte; `instances` counts how many were created. */
export function fakeMediaRecorder() {
  const instances: unknown[] = [];
  class FakeMediaRecorder {
    static isTypeSupported = () => true;
    state: "inactive" | "recording" = "inactive";
    mimeType = "audio/webm";
    ondataavailable: ((event: { data: Blob }) => void) | null = null;
    onstop: (() => void) | null = null;
    constructor() {
      instances.push(this);
    }
    start() {
      this.state = "recording";
    }
    stop() {
      this.state = "inactive";
      this.ondataavailable?.({ data: new Blob(["x"]) });
      this.onstop?.();
    }
  }
  return { FakeMediaRecorder, instances };
}
