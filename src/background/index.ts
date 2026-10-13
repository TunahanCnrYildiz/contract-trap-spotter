import { analyseWithRetry, userMessage } from "../core/llm";
import { prepareSource } from "../core/prompt";
import { verifyFindings } from "../core/verify";
import { loadSettings } from "../core/settings";
import type { Report } from "../core/schema";

export type AnalyseResponse =
  | { ok: true; report: Report; url: string; title: string }
  | { ok: false; error: string };

export type PagePayload = { url: string; title: string; text: string; hiddenText: string };

const MAX_PAGE_CHARS = 2_000_000;

// Messages come from our own popup or content script only, never from web pages.
function isPayload(p: unknown): p is PagePayload {
  const o = p as Record<string, unknown> | null;
  return (
    !!o &&
    typeof o.url === "string" && typeof o.title === "string" &&
    typeof o.text === "string" && o.text.length <= MAX_PAGE_CHARS &&
    typeof o.hiddenText === "string" && o.hiddenText.length <= MAX_PAGE_CHARS
  );
}

// The API key never leaves this worker: pages and content scripts cannot read it.
async function analysePage(page: unknown): Promise<AnalyseResponse> {
  if (!isPayload(page) || !page.text.trim()) {
    return { ok: false, error: "Sayfa metni okunamadı. Sayfayı yenileyip tekrar deneyin." };
  }
  const settings = await loadSettings();
  if (!settings.apiKey) return { ok: false, error: "API anahtarı girilmemiş. Ayarlar sayfasından ekleyin." };

  const { text, truncated } = prepareSource(page.text);
  try {
    const output = await analyseWithRetry(text, settings);
    return { ok: true, report: verifyFindings(output, text, { truncated, hiddenText: page.hiddenText }), url: page.url, title: page.title };
  } catch (e) {
    return { ok: false, error: userMessage(e) };
  }
}

// Popup flow: inject the content script on demand (activeTab), ask it for the text.
async function analyseTab(tabId: number): Promise<AnalyseResponse> {
  await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] }).catch(() => null);
  const page = await chrome.tabs.sendMessage(tabId, { type: "EXTRACT_TEXT" }).catch(() => null);
  return analysePage(page);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id) return;
  if (msg?.type === "ANALYSE" && typeof msg.tabId === "number") {
    analyseTab(msg.tabId).then(sendResponse);
    return true;
  }
  // Panel flow: the content script already extracted the text.
  if (msg?.type === "ANALYSE_PAGE") {
    analysePage(msg.page).then(sendResponse);
    return true;
  }
});
