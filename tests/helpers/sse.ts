const encoder = new TextEncoder();

/** One SSE frame as cuewise-be (sse-starlette) writes it: CRLF line endings, JSON data. */
export const sseFrame = (event: string, data: unknown) =>
  `event: ${event}\r\ndata: ${typeof data === "string" ? data : JSON.stringify(data)}\r\n\r\n`;

/** A response body that delivers each given string as its own chunk. */
export function streamOf(...chunks: string[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

/** A body that sends `first`, then stays open until `finish()` is called (for "readable before the end" checks). */
export function openStream(first: string) {
  let finish = () => {};
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(first));
      finish = () => controller.close();
    },
  });
  return { body, finish: () => finish() };
}
