import { extractPageText } from "./extract";

// The script is injected on every click, so register the listener only once per page.
const FLAG = "__ctsRegistered";
const w = window as unknown as Record<string, boolean>;

if (!w[FLAG]) {
  w[FLAG] = true;
  // Content script answers one message: give me the text of this page.
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type !== "EXTRACT_TEXT") return;
    extractPageText().then(sendResponse);
    return true;
  });
}
