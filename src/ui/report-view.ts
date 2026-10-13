import type { Report } from "../core/schema";

// Shared by the popup and the on-page panel. All model output goes in with textContent,
// never innerHTML, so text coming from the model or the page cannot become markup.
type Root = Document | ShadowRoot;

const LEVEL_TR = { low: "Düşük risk", medium: "Orta risk", high: "Yüksek risk" } as const;
const SEVERITY_TR = { low: "düşük", medium: "orta", high: "yüksek" } as const;
const REASON_TR = {
  quote_not_found: "alıntı sayfada bulunamadı",
  quote_too_short: "alıntı çok kısa",
  quote_is_instruction: "alıntı bir talimat gibi görünüyor",
} as const;

export const LOW_CONFIDENCE = 0.6;

function el(tag: string, text?: string, cls?: string): HTMLElement {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

export const REPORT_MARKUP = `
  <p class="disclaimer" id="disclaimer">Bu araç hukuki tavsiye vermez. Otomatik bir ön tarama sonucudur.</p>
  <p id="status" role="status"></p>
  <section id="report" hidden>
    <div id="score" class="score"></div>
    <ul id="warnings" class="warnings"></ul>
    <ul id="findings"></ul>
    <details id="rejected-box" hidden>
      <summary>Doğrulanamayan iddialar</summary>
      <p class="muted">Model bu maddeleri öne sürdü ama alıntıları sayfa metninde bulunamadı veya güvenilir değildi. Skora dahil edilmedi.</p>
      <ul id="rejected"></ul>
    </details>
  </section>`;

export function renderReport(root: Root, report: Report): void {
  const $ = (id: string) => root.getElementById(id) as HTMLElement;

  $("disclaimer").textContent = report.disclaimer;
  const score = $("score");
  score.textContent = `${LEVEL_TR[report.level]} · ${report.score}/100`;
  score.className = `score ${report.level}`;

  const warnings = $("warnings");
  warnings.replaceChildren();
  if (report.injectionWarnings.length > 0) {
    warnings.append(el("li", `Sayfada yapay zekâya yönelik talimat benzeri görünür metin bulundu. Model bunu veri olarak ele alır, ama sonuçlara temkinli yaklaşın.`));
  }
  if (report.hiddenInjectionWarnings.length > 0) {
    warnings.append(el("li", "Sayfada kullanıcıya görünmeyen, yapay zekâya yönelik talimat benzeri gizli metin bulundu. Analize dahil edilmedi."));
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
    if (f.confidence < LOW_CONFIDENCE) li.append(el("div", "Düşük güven: model bu maddeden emin değil.", "uncertain"));
    li.append(el("div", f.explanation_tr));
    li.append(el("blockquote", f.quote));
    list.append(li);
  }

  const rej = $("rejected");
  rej.replaceChildren();
  for (const r of report.rejected) {
    const li = el("li", undefined, "finding rejected");
    li.append(el("div", `Neden elendi: ${REASON_TR[r.reason]}`, "tag"));
    li.append(el("blockquote", r.finding.quote));
    rej.append(li);
  }
  $("rejected-box").hidden = report.rejected.length === 0;
  $("report").hidden = false;
}
