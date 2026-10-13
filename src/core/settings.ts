export type Settings = { apiKey: string; model: string };

export const DEFAULT_MODEL = "gemini-3.8-flash";

export async function loadSettings(): Promise<Settings> {
  const s = await chrome.storage.local.get(["apiKey", "model"]);
  const apiKey = typeof s.apiKey === "string" ? s.apiKey : "";
  const model = typeof s.model === "string" && s.model ? s.model : DEFAULT_MODEL;
  return { apiKey, model };
}

export async function saveSettings(s: Settings): Promise<void> {
  await chrome.storage.local.set({ apiKey: s.apiKey.trim(), model: s.model.trim() });
}
