import type { AnalyseResponse } from "../background";
import { renderReport } from "../ui/report-view";

const status = document.getElementById("status")!;

document.getElementById("analyse")!.addEventListener("click", async () => {
  document.getElementById("report")!.hidden = true;
  status.textContent = "Analiz ediliyor…";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) { status.textContent = "Aktif sekme bulunamadı."; return; }
  const res: AnalyseResponse = await chrome.runtime.sendMessage({ type: "ANALYSE", tabId: tab.id });
  if (res.ok) { status.textContent = res.title; renderReport(document, res.report); }
  else status.textContent = res.error;
});

document.getElementById("open-options")!.addEventListener("click", (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); });
