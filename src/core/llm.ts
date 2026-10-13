import { LlmOutputSchema, RESPONSE_JSON_SCHEMA, type LlmOutput } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

// Set only by the e2e build (see vite.config.ts). Normal builds always use Google.
const BASE = import.meta.env?.VITE_LLM_BASE ?? "https://generativelanguage.googleapis.com";

export type LlmConfig = { apiKey: string; model: string };

export class LlmError extends Error {}

// Thin client: swap this file to change provider. Everything else only sees LlmOutput.
export async function analyse(sourceText: string, cfg: LlmConfig, fetchImpl: typeof fetch = fetch): Promise<LlmOutput> {
  const url = `${BASE}/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent`;
  const res = await fetchImpl(url, {
    method: "POST",
    signal: AbortSignal.timeout(90_000),
    headers: { "Content-Type": "application/json", "x-goog-api-key": cfg.apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(sourceText) }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_JSON_SCHEMA,
      },
    }),
  });
  if (!res.ok) throw new LlmError(`LLM request failed (${res.status})`);

  const data = await res.json();
  const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new LlmError("LLM returned no text");

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new LlmError("LLM output is not valid JSON");
  }
  const result = LlmOutputSchema.safeParse(parsed);
  if (!result.success) throw new LlmError("LLM output does not match schema");
  return result.data;
}
