import {
  DISCLAIMER,
  type Finding,
  type LlmOutput,
  type RejectedFinding,
  type Report,
  type VerifiedFinding,
} from "./schema";
import { detectInjection, looksLikeInstruction } from "./injection";
import { normalizeForMatch } from "./text";
import { quoteInSource, quoteSegments } from "./quote";

const MIN_QUOTE_LEN = 20;

// Chance that one finding on its own should worry the user. Scaled by the model confidence.
const SEVERITY_WEIGHT = { low: 0.05, medium: 0.12, high: 0.25 } as const;

// Score is computed here from verified findings only. The model never sets it.
// Noisy-OR: each finding adds less than the one before, the result stays below 100,
// and the order of findings does not matter. A long list of mild clauses therefore
// cannot saturate the score the way a plain sum would.
export function computeScore(findings: Pick<Finding, "severity" | "confidence">[]): number {
  const calm = findings.reduce(
    (p, f) => p * (1 - SEVERITY_WEIGHT[f.severity] * (0.5 + 0.5 * f.confidence)),
    1,
  );
  return Math.round((1 - calm) * 100);
}

export function levelFor(score: number): Report["level"] {
  if (score >= 55) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function verifyFindings(
  output: LlmOutput,
  sourceText: string,
  opts: { truncated?: boolean } = {},
): Report {
  const haystack = normalizeForMatch(sourceText);
  const seen = new Set<string>();
  const findings: VerifiedFinding[] = [];
  const rejected: RejectedFinding[] = [];

  for (const f of output.findings) {
    const needle = quoteSegments(f.quote).join(" ... ");
    const matched = quoteSegments(f.quote).reduce((n, seg) => n + seg.length, 0);
    if (matched < MIN_QUOTE_LEN) {
      rejected.push({ finding: f, reason: "quote_too_short" });
    } else if (looksLikeInstruction(f.quote)) {
      rejected.push({ finding: f, reason: "quote_is_instruction" });
    } else if (!quoteInSource(haystack, f.quote)) {
      rejected.push({ finding: f, reason: "quote_not_found" });
    } else if (!seen.has(needle)) {
      seen.add(needle);
      findings.push({ ...f, verified: true });
    }
  }

  const score = computeScore(findings);
  return {
    score,
    level: levelFor(score),
    findings,
    rejected,
    injectionWarnings: detectInjection(sourceText),
    truncated: opts.truncated ?? false,
    disclaimer: DISCLAIMER,
  };
}
