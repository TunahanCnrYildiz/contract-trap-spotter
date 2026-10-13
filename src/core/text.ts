// Text helpers shared by the verifier and the sanitizer.

const ZERO_WIDTH = /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

// Normalize for comparison only: the original text is what we show to the user.
export function normalizeForMatch(s: string): string {
  return s
    .normalize("NFKC")
    .replace(ZERO_WIDTH, "")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("tr");
}

export function stripInvisible(s: string): string {
  return s.replace(ZERO_WIDTH, "");
}
