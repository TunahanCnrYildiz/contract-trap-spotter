import { LlmOutputSchema, RESPONSE_JSON_SCHEMA, type LlmOutput } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

// Set only by the e2e build (see vite.config.ts). Normal builds always use Google.
const BASE = import.meta.env?.VITE_LLM_BASE ?? "https://generativelanguage.googleapis.com";

export type LlmConfig = { apiKey: string; model: string };

export class LlmError extends Error {
  constructor(message: string, readonly status?: number, readonly retryable = false) {
    super(message);
  }
}

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

// Thin client: swap this file to change provider. Everything else only sees LlmOutput.
export async function analyse(sourceText: string, cfg: LlmConfig, fetchImpl: typeof fetch = fetch): Promise<LlmOutput> {
  const url = `${BASE}/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent`;
  let res: Response;
  try {
    res = await fetchImpl(url, {
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
  } catch {
    // No answer at all (offline, timeout): worth another try.
    throw new LlmError("LLM request did not complete", undefined, true);
  }
  if (!res.ok) throw new LlmError(`LLM request failed (${res.status})`, res.status, RETRYABLE_STATUS.has(res.status));

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

const sleepMs = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The model is sometimes overloaded (503) or rate limited (429). Try a few times before giving up.
export async function analyseWithRetry(
  sourceText: string,
  cfg: LlmConfig,
  opts: { delaysMs?: number[]; fetchImpl?: typeof fetch; sleep?: (ms: number) => Promise<unknown> } = {},
): Promise<LlmOutput> {
  const delays = opts.delaysMs ?? [2000, 5000];
  const wait = opts.sleep ?? sleepMs;
  for (let attempt = 0; ; attempt++) {
    try {
      return await analyse(sourceText, cfg, opts.fetchImpl);
    } catch (e) {
      const canRetry = e instanceof LlmError && e.retryable && attempt < delays.length;
      if (!canRetry) throw e;
      await wait(delays[attempt]!);
    }
  }
}

// Short Turkish message for the user. The technical detail stays in the English error.
export function userMessage(e: unknown): string {
  if (!(e instanceof LlmError)) return "Beklenmeyen bir hata oluştu.";
  switch (e.status) {
    case 400: return "İstek reddedildi. Model adını Ayarlar sayfasından kontrol edin.";
    case 401:
    case 403: return "API anahtarı geçersiz veya yetkisiz. Ayarlar sayfasından anahtarı kontrol edin.";
    case 404: return "Model bulunamadı. Ayarlar sayfasından model adını kontrol edin.";
    case 429: return "İstek sınırına ulaşıldı (kota). Biraz bekleyip tekrar deneyin.";
    case 500:
    case 502:
    case 503:
    case 504: return "Model şu an yoğun veya yanıt vermiyor. Birkaç kez denedim; biraz sonra tekrar deneyin.";
  }
  if (e.retryable) return "Modele ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.";
  return "Model beklenen biçimde yanıt vermedi. Tekrar deneyin.";
}
