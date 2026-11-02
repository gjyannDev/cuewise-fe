import { describe, expect, it } from "vitest";

import { readSseStream, type SseFrame } from "@/lib/api/sse";
import { streamOf } from "@tests/helpers/sse";

const encoder = new TextEncoder();

async function collect(body: ReadableStream<Uint8Array>): Promise<SseFrame[]> {
  const frames: SseFrame[] = [];
  for await (const frame of readSseStream(body)) {
    frames.push(frame);
  }
  return frames;
}

/** The same bytes, delivered as the given byte-sized pieces. */
function bytesIn(text: string, cuts: number[]): ReadableStream<Uint8Array> {
  const bytes = encoder.encode(text);
  const edges = [0, ...cuts, bytes.length];
  return new ReadableStream({
    start(controller) {
      for (let i = 0; i < edges.length - 1; i++) {
        controller.enqueue(bytes.slice(edges[i], edges[i + 1]));
      }
      controller.close();
    },
  });
}

const SAMPLE = 'event: status\r\ndata: {"phase":"received"}\r\n\r\n: ping\r\n\r\nevent: question.delta\r\ndata: {"text":"Café ☕?"}\r\n\r\n';
const EXPECTED = [
  { event: "status", data: '{"phase":"received"}' },
  { event: "question.delta", data: '{"text":"Café ☕?"}' },
];

describe("readSseStream", () => {
  it("reads one LF frame", async () => {
    expect(await collect(streamOf("event: reset\ndata: {}\n\n"))).toEqual([{ event: "reset", data: "{}" }]);
  });

  it("reads several frames from one chunk, with CRLF and CR endings", async () => {
    expect(await collect(streamOf(SAMPLE))).toEqual(EXPECTED);
    expect(await collect(streamOf(SAMPLE.replaceAll("\r\n", "\r")))).toEqual(EXPECTED);
  });

  it("yields the same frames whichever byte the stream is cut at, multi-byte characters included (AC6, EC15)", async () => {
    const length = encoder.encode(SAMPLE).length;
    for (let cut = 1; cut < length; cut++) {
      expect(await collect(bytesIn(SAMPLE, [cut]))).toEqual(EXPECTED);
    }
  });

  it("ignores comment-only frames such as heartbeats (EC16)", async () => {
    expect(await collect(streamOf(": ping\n\n: ping\n\n"))).toEqual([]);
  });

  it("joins multi-line data and defaults the name to message", async () => {
    expect(await collect(streamOf("data: a\ndata: b\n\n"))).toEqual([{ event: "message", data: "a\nb" }]);
  });

  it("drops a frame the stream ended inside", async () => {
    expect(await collect(streamOf("event: reset\ndata: {}\n\nevent: done\ndata: {"))).toEqual([
      { event: "reset", data: "{}" },
    ]);
  });

  it("cancels the body when the reader stops early", async () => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("event: reset\ndata: {}\n\n"));
      },
      cancel() {
        cancelled = true;
      },
    });

    for await (const frame of readSseStream(body)) {
      expect(frame.event).toBe("reset");
      break;
    }

    expect(cancelled).toBe(true);
  });
});
