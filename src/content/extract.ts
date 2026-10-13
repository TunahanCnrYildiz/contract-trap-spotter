import { PageController } from "@page-agent/page-controller";

// Runs inside the page via chrome.scripting.executeScript. Returns plain text only.
// page-agent's controller turns the DOM into text and skips elements that are not visible,
// so hidden text is mostly left out. We still scan for injection later, because
// visible text can attack the model too.
export async function extractPageText(): Promise<{ url: string; title: string; text: string }> {
  const controller = new PageController({ viewportExpansion: -1 });
  try {
    const state = await controller.getBrowserState();
    const text = (state.content || "").trim();
    return { url: state.url, title: state.title, text: text.length > 200 ? text : document.body.innerText };
  } catch {
    return { url: location.href, title: document.title, text: document.body.innerText };
  } finally {
    controller.dispose();
  }
}
