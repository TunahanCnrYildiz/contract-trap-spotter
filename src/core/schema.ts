import { z } from "zod";

// Risk categories the model may use. Anything else is rejected by the validator.
export const CATEGORIES = [
  "auto_renewal",
  "data_sharing",
  "arbitration_waiver",
  "unilateral_change",
  "liability_limit",
  "cancellation_difficulty",
  "data_retention",
  "content_license",
  "tracking",
  "other",
] as const;

export const SEVERITIES = ["low", "medium", "high"] as const;

export const FindingSchema = z.object({
  category: z.enum(CATEGORIES),
  severity: z.enum(SEVERITIES),
  // Verbatim excerpt from the page text. Checked against the source in verify.ts.
  quote: z.string().min(1).max(600),
  // Plain Turkish explanation for the user.
  explanation_tr: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1),
});

export const LlmOutputSchema = z.object({
  findings: z.array(FindingSchema).max(20),
});

export type Finding = z.infer<typeof FindingSchema>;
export type LlmOutput = z.infer<typeof LlmOutputSchema>;

// JSON Schema handed to the model (Gemini responseSchema subset).
// Must stay in sync with the zod schema above; tests check that.
export const RESPONSE_JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    findings: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          category: { type: "STRING", enum: [...CATEGORIES] },
          severity: { type: "STRING", enum: [...SEVERITIES] },
          quote: { type: "STRING" },
          explanation_tr: { type: "STRING" },
          confidence: { type: "NUMBER" },
        },
        required: ["category", "severity", "quote", "explanation_tr", "confidence"],
      },
    },
  },
  required: ["findings"],
} as const;

export type VerifiedFinding = Finding & { verified: true };
export type RejectedFinding = {
  finding: Finding;
  reason: "quote_not_found" | "quote_too_short" | "quote_is_instruction";
};

export type Report = {
  score: number; // 0-100, computed in code, never taken from the model
  level: "low" | "medium" | "high";
  findings: VerifiedFinding[];
  rejected: RejectedFinding[];
  injectionWarnings: string[];
  truncated: boolean;
  disclaimer: string;
};

export const DISCLAIMER =
  "Bu rapor hukuki tavsiye değildir. Otomatik bir ön tarama sonucudur; önemli kararlar için metni kendiniz okuyun veya bir uzmana danışın.";
