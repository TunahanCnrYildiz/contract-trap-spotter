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

const MIN_QUOTE_LEN = 20;

const SEVERITY_WEIGHT = { low: 8, medium: 18, high: 30 } as const;

// Score is computed here from verified findings only. The model never sets it.
export function computeScore(findings: Pick<Finding, "severity" | "confidence">[]): number {
  const raw = findings.reduce(
    (sum, f) => sum + SEVERITY_WEIGHT[f.severity] * (0.5 + 0.5 * f.confidence),
    0,
  );
  return Math.min(100, Math.round(raw));
}

export function levelFor(score: number): Report["level"] {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
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
    const needle = normalizeForMatch(f.quote);
    if (needle.length < MIN_QUOTE_LEN) {
      rejected.push({ finding: f, reason: "quote_too_short" });
    } else if (looksLikeInstruction(f.quote)) {
      rejected.push({ finding: f, reason: "quote_is_instruction" });
    } else if (!haystack.includes(needle)) {
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
