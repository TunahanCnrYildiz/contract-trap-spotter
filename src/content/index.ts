import { extractPageText } from "./extract";
import { looksLikeLegalPage, mountPanel } from "./panel";

// This file can run twice on one page (static content script and on-demand injection from the
// popup), so everything is registered only once.
const FLAG = "__ctsRegistered";
const w = window as unknown as Record<string, boolean>;

if (!w[FLAG]) {
  w[FLAG] = true;

  // Popup flow: answer one message, "give me the text of this page".
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (sender.id !== chrome.runtime.id || msg?.type !== "EXTRACT_TEXT") return;
    extractPageText().then(sendResponse);
    return true;
  });

  // Panel flow: show a button on pages that look like terms or policies.
  if (looksLikeLegalPage()) mountPanel();
}
