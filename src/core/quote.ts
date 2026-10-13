import { normalizeForMatch } from "./text";

const ELLIPSIS = /\.{3,}|\u2026/;
const MIN_SEGMENT_LEN = 12;
// Pieces of one quote must sit close together in the source, so two
// unrelated sentences cannot be glued together with "...".
const MAX_GAP = 400;

// Splits a quote at "..." and returns the normalized pieces worth matching.
export function quoteSegments(quote: string): string[] {
  return quote
    .split(ELLIPSIS)
    .map((s) => normalizeForMatch(s).replace(/^[\s,;:.\-]+|[\s,;:.\-]+$/g, ""))
    .filter((s) => s.length >= MIN_SEGMENT_LEN);
}

// True when every segment appears in the source, in order, within MAX_GAP characters.
// A quote without "..." is a single segment, so it still has to match verbatim.
export function quoteInSource(haystack: string, quote: string): boolean {
  const segments = quoteSegments(quote);
  if (segments.length === 0) return false;

  let pos = 0;
  let prevEnd = -1;
  for (const seg of segments) {
    const idx = haystack.indexOf(seg, pos);
    if (idx === -1) return false;
    if (prevEnd !== -1 && idx - prevEnd > MAX_GAP) return false;
    prevEnd = idx + seg.length;
    pos = prevEnd;
  }
  return true;
}
