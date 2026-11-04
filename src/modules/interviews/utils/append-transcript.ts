/**
 * The answer box's text after a transcript is added: after what was typed, never instead of it. One space between
 * them (none after a line break, so a new paragraph stays one), and nothing is cut, even past the answer limit: the
 * composer's counter and validation say so, and the candidate decides what to trim.
 */
export function appendTranscript(existing: string, transcript: string): string {
  const spoken = transcript.trim();
  if (existing.trim() === "") {
    return spoken;
  }
  const typed = existing.replace(/[ \t]+$/, "");
  return typed.endsWith("\n") ? `${typed}${spoken}` : `${typed} ${spoken}`;
}
