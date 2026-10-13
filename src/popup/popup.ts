import type { Report } from "../core/schema";
import type { AnalyseResponse } from "../background";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// All model output is inserted with textContent, never innerHTML.
function el(tag: string, text?: string, cls?: string): HTMLElement {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

const LEVEL_TR = { low: "Düşük risk", medium: "Orta risk", high: "Yüksek risk" } as const;
const SEVERITY_TR = { low: "düşük", medium: "orta", high: "yüksek" } as const;
const REASON_TR = {
  quote_not_found: "alıntı sayfada bulunamadı",
  quote_too_short: "alıntı çok kısa",
  quote_is_instruction: "alıntı bir talimat gibi görünüyor",
} as const;

function render(report: Report) {
  $("disclaimer").textContent = report.disclaimer;
  const score = $("score");
  score.textContent = `${LEVEL_TR[report.level]} · ${report.score}/100`;
  score.className = `score ${report.level}`;

  const warnings = $("warnings");
  warnings.replaceChildren();
  for (const w of report.injectionWarnings) {
    warnings.append(el("li", `Sayfada yapay zekâya yönelik talimat benzeri metin bulundu (${w}). Yok sayıldı.`));
  }
  if (report.truncated) warnings.append(el("li", "Metin çok uzundu, yalnızca ilk bölümü analiz edildi."));

  const list = $("findings");
  list.replaceChildren();
  if (report.findings.length === 0) {
    list.append(el("li", "Doğrulanmış riskli madde bulunamadı. Bu, sayfanın risksiz olduğu anlamına gelmez.", "muted"));
  }
  for (const f of report.findings) {
    const li = el("li", undefined, "finding");
    li.append(el("div", `${f.category} · önem: ${SEVERITY_TR[f.severity]} · güven: ${Math.round(f.confidence * 100)}%`, "tag"));
    li.append(el("div", f.explanation_tr));
    li.append(el("blockquote", f.quote));
    list.append(li);
  }

  const rej = $("rejected");
  rej.replaceChildren();
  for (const r of report.rejected) {
    const li = el("li", undefined, "finding");
    li.append(el("div", `Neden elendi: ${REASON_TR[r.reason]}`, "tag"));
    li.append(el("blockquote", r.finding.quote));
    rej.append(li);
  }
  $("rejected-box").hidden = report.rejected.length === 0;
  $("report").hidden = false;
}

$("analyse").addEventListener("click", async () => {
  const status = $("status");
  $("report").hidden = true;
  status.textContent = "Analiz ediliyor…";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) { status.textContent = "Aktif sekme bulunamadı."; return; }
  const res: AnalyseResponse = await chrome.runtime.sendMessage({ type: "ANALYSE", tabId: tab.id });
  if (res.ok) { status.textContent = res.title; render(res.report); }
  else status.textContent = res.error;
});

$("open-options").addEventListener("click", (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); });
