import { describe, expect, it } from "vitest";
import { analyseWithRetry, LlmError, userMessage } from "../src/core/llm";

const cfg = { apiKey: "k", model: "m" };
const ok = () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ findings: [] }) }] } }] }), { status: 200 });
const status = (n: number) => new Response("{}", { status: n });
const noSleep = () => Promise.resolve();

function sequence(...items: (Response | Error)[]) {
  let i = 0;
  const calls = { n: 0 };
  const fetchImpl = (async () => {
    calls.n++;
    const item = items[Math.min(i++, items.length - 1)]!;
    if (item instanceof Error) throw item;
    return item.clone();
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

describe("analyseWithRetry", () => {
  it("retries an overloaded model and then succeeds", async () => {
    const { fetchImpl, calls } = sequence(status(503), status(503), ok());
    const out = await analyseWithRetry("text", cfg, { fetchImpl, sleep: noSleep });
    expect(out.findings).toEqual([]);
    expect(calls.n).toBe(3);
  });

  it("gives up after the configured retries and keeps the status", async () => {
    const { fetchImpl, calls } = sequence(status(503));
    await expect(analyseWithRetry("text", cfg, { fetchImpl, sleep: noSleep })).rejects.toMatchObject({ status: 503 });
    expect(calls.n).toBe(3);
  });

  it("does not retry a wrong key or model", async () => {
    for (const code of [400, 401, 403, 404]) {
      const { fetchImpl, calls } = sequence(status(code));
      await expect(analyseWithRetry("text", cfg, { fetchImpl, sleep: noSleep })).rejects.toBeInstanceOf(LlmError);
      expect(calls.n).toBe(1);
    }
  });

  it("retries a request that never completed", async () => {
    const { fetchImpl, calls } = sequence(new TypeError("network"), ok());
    await analyseWithRetry("text", cfg, { fetchImpl, sleep: noSleep });
    expect(calls.n).toBe(2);
  });

  it("does not retry output that breaks the schema", async () => {
    const bad = new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"findings":"x"}' }] } }] }), { status: 200 });
    const { fetchImpl, calls } = sequence(bad);
    await expect(analyseWithRetry("text", cfg, { fetchImpl, sleep: noSleep })).rejects.toBeInstanceOf(LlmError);
    expect(calls.n).toBe(1);
  });
});

describe("userMessage", () => {
  it("explains common failures in Turkish without leaking the key", () => {
    expect(userMessage(new LlmError("x", 503, true))).toContain("yoğun");
    expect(userMessage(new LlmError("x", 429, true))).toContain("kota");
    expect(userMessage(new LlmError("x", 401))).toContain("API anahtarı");
    expect(userMessage(new LlmError("x", 404))).toContain("Model bulunamadı");
    expect(userMessage(new Error("boom"))).toContain("Beklenmeyen");
  });
});
