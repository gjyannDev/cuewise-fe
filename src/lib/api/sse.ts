/** One Server-Sent Event as sent: its name (`message` when the stream gives none) and its data text. */
export type SseFrame = { event: string; data: string };

/**
 * Reads a `text/event-stream` body into frames as bytes arrive. Feature-agnostic: it only knows the SSE format.
 * Handles chunks split anywhere (even inside a multi-byte character or a CRLF), LF / CRLF / CR line endings,
 * comment lines (`:` heartbeats), and multi-line `data:`. A frame still open when the stream ends is dropped, as
 * browsers do. Closing the generator early releases the reader.
 */
export async function* readSseStream(body: ReadableStream<Uint8Array>): AsyncGenerator<SseFrame> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let event = "";
  let data: string[] = [];

  function* lines(final: boolean): Generator<string> {
    for (;;) {
      const end = buffer.search(/\r\n|\r|\n/);
      // A trailing CR may be the first half of a CRLF still in flight.
      if (end < 0 || (!final && end === buffer.length - 1 && buffer[end] === "\r")) {
        return;
      }
      const line = buffer.slice(0, end);
      buffer = buffer.slice(end + (buffer.startsWith("\r\n", end) ? 2 : 1));
      yield line;
    }
  }

  function take(line: string): SseFrame | undefined {
    if (line === "") {
      const frame = data.length ? { event: event || "message", data: data.join("\n") } : undefined;
      event = "";
      data = [];
      return frame;
    }
    if (line.startsWith(":")) {
      return undefined;
    }
    const colon = line.indexOf(":");
    const field = colon < 0 ? line : line.slice(0, colon);
    const value = colon < 0 ? "" : line.slice(colon + 1).replace(/^ /, "");
    if (field === "event") {
      event = value;
    } else if (field === "data") {
      data.push(value);
    }
    return undefined;
  }

  try {
    for (;;) {
      const { value, done } = await reader.read();
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
      for (const line of lines(done)) {
        const frame = take(line);
        if (frame) {
          yield frame;
        }
      }
      if (done) {
        return;
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
