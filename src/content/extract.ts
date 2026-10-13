import { PageController } from "@page-agent/page-controller";
import { extractMainText } from "./main-text";

const MIN_MAIN_CHARS = 500;

// Runs inside the page via chrome.scripting.executeScript. Returns plain text only.
// Main path: our own extractor (main region, no menus, hidden text set aside).
// Fallback: page-agent's PageController, which turns the DOM into text for pages
// where no sizeable main region is found.
export async function extractPageText(): Promise<{ url: string; title: string; text: string; hiddenText: string }> {
  const main = extractMainText(document, window);
  if (main.text.length >= MIN_MAIN_CHARS) {
    return { url: location.href, title: document.title, text: main.text, hiddenText: main.hiddenText };
  }

  const controller = new PageController({ viewportExpansion: -1 });
  try {
    const state = await controller.getBrowserState();
    const text = (state.content || "").trim();
    return { url: state.url, title: state.title, text: text.length > main.text.length ? text : main.text, hiddenText: main.hiddenText };
  } catch {
    return { url: location.href, title: document.title, text: main.text || document.body.innerText, hiddenText: main.hiddenText };
  } finally {
    controller.dispose();
  }
}
