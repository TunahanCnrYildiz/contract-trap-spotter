import { extractPageText } from "./extract";
import { REPORT_MARKUP, renderReport } from "../ui/report-view";
import type { AnalyseResponse } from "../background";
import popupCss from "../popup/popup.css?inline";

// A small button and panel shown on pages that look like terms or policies.
// Nothing is read or sent until the user presses "analyse". Lives in a shadow root,
// so the page's own CSS and scripts cannot restyle it or read its contents.

const LEGAL_HINT = /terms|privacy|policy|agreement|conditions|legal|eula|\btos\b|kullanim|gizlilik|sozlesme|sartlari|aydinlatma/i;

export function looksLikeLegalPage(): boolean {
  const h1 = document.querySelector("h1")?.textContent ?? "";
  return LEGAL_HINT.test(`${location.pathname} ${document.title} ${h1}`);
}

const PANEL_CSS = `
  :host { all: initial; }
  #cts-open { width: auto; position: fixed; right: 16px; bottom: 16px; z-index: 2147483647; padding: 10px 14px;
    background: #1d3557; color: #fff; border: 0; border-radius: 999px; font: 600 13px system-ui, sans-serif; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.3); }
  #cts-panel { position: fixed; right: 16px; bottom: 64px; z-index: 2147483647; width: 400px; max-height: 70vh; overflow: auto;
    background: #fff; color: #1b1b1f; border: 1px solid #ccc; border-radius: 10px; padding: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.3); font: 13px/1.4 system-ui, sans-serif; }
  #cts-panel[hidden] { display: none; }
  #cts-panel button { width: 100%; padding: 8px; font-size: 13px; cursor: pointer; }
  body { width: auto; padding: 0; }
`;

export function mountPanel(): void {
  if (document.getElementById("cts-root")) return;
  const host = document.createElement("div");
  host.id = "cts-root";
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = popupCss + PANEL_CSS;
  const open = document.createElement("button");
  open.id = "cts-open";
  open.type = "button";
  open.textContent = "Sözleşme tuzaklarını tara";

  const panel = document.createElement("div");
  panel.id = "cts-panel";
  panel.hidden = true;
  panel.innerHTML = `<h1>Contract Trap Spotter</h1>${REPORT_MARKUP}<button id="cts-analyse" type="button">Bu sayfayı analiz et</button>`;

  shadow.append(style, open, panel);
  document.documentElement.append(host);

  open.addEventListener("click", () => { panel.hidden = !panel.hidden; });

  shadow.getElementById("cts-analyse")!.addEventListener("click", async () => {
    const status = shadow.getElementById("status")!;
    shadow.getElementById("report")!.hidden = true;
    status.textContent = "Analiz ediliyor…";
    const page = await extractPageText();
    const res: AnalyseResponse = await chrome.runtime.sendMessage({ type: "ANALYSE_PAGE", page });
    if (res.ok) { status.textContent = res.title; renderReport(shadow, res.report); }
    else status.textContent = res.error;
  });
}
