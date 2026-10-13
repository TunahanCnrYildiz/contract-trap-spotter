import { analyse, LlmError } from "../core/llm";
import { prepareSource } from "../core/prompt";
import { verifyFindings } from "../core/verify";
import { loadSettings } from "../core/settings";
import type { Report } from "../core/schema";

export type AnalyseResponse =
  | { ok: true; report: Report; url: string; title: string }
  | { ok: false; error: string };

// The API key never leaves this worker: pages and content scripts cannot read it.
async function run(tabId: number): Promise<AnalyseResponse> {
  const settings = await loadSettings();
  if (!settings.apiKey) return { ok: false, error: "API anahtarı girilmemiş. Ayarlar sayfasından ekleyin." };

  // Inject on demand (activeTab) instead of running on every site.
  await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] }).catch(() => null);
  const page = await chrome.tabs.sendMessage(tabId, { type: "EXTRACT_TEXT" }).catch(() => null);
  if (!page?.text) return { ok: false, error: "Sayfa metni okunamadı. Sayfayı yenileyip tekrar deneyin." };

  const { text, truncated } = prepareSource(page.text);
  try {
    const output = await analyse(text, settings);
    return { ok: true, report: verifyFindings(output, text, { truncated, hiddenText: page.hiddenText }), url: page.url, title: page.title };
  } catch (e) {
    return { ok: false, error: e instanceof LlmError ? e.message : "Beklenmeyen hata" };
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "ANALYSE") return;
  run(msg.tabId).then(sendResponse);
  return true;
});
