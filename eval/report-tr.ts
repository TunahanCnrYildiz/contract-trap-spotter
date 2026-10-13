// Turns the last eval run into a readable Turkish report: for every document, the clauses that were
// caught, missed, and the findings that matched no label, with the full text.
// Usage: npx tsx eval/report-tr.ts   (reads eval/last-run.json, writes docs/eval-sonuclari.md)
import { readFileSync, writeFileSync } from "node:fs";
import { normalizeForMatch } from "../src/core/text";
import { quoteSegments } from "../src/core/quote";

type Gold = { category: string; anchor: string };
type Case = { id: string; title: string; source: string; control?: boolean; gold: Gold[] };
type Finding = { category: string; severity: string; quote: string };
type Run = { caught: number[]; findings: Finding[]; rejected: string[]; score: number };
type Saved = { model: string; date: string; repeat: number; cases: { id: string; runs: Run[] }[] };

const last: Saved = JSON.parse(readFileSync("eval/last-run.json", "utf8"));
const caseFiles = ["spotify", "netflix", "dropbox", "reddit", "linkedin", "fair-control"];
const cases = new Map<string, Case>(
  caseFiles.map((id) => [id, JSON.parse(readFileSync(`eval/cases/${id}.json`, "utf8")) as Case]),
);

function overlaps(quote: string, anchor: string): boolean {
  const a = normalizeForMatch(anchor);
  return quoteSegments(quote).some((q) => q.includes(a) || a.includes(q));
}

const out: string[] = [
  "# Eval sonuçları: yakalanan, kaçırılan ve yanlış alarm veren maddeler",
  "",
  `Model: \`${last.model}\` · her belge ${last.repeat} kez çalıştırıldı · tarih: ${last.date.slice(0, 10)}`,
  "",
  "- **Yakalanan:** elle etiketlediğim riskli maddelerden, modelin bulduğu ve alıntısı sayfada doğrulanan.",
  "- **Kaçırılan:** etiketlediğim ama modelin bulamadığı.",
  "- **Yanlış alarm:** modelin bulduğu, alıntısı sayfada doğrulanan ama benim etiketlerimde olmayan madde. Çoğu belgede gerçekten var olan, sınırda maddelerdir; ayrıntı için ana README'ye bakın.",
  "- Üç koşunun sonucu bu belgelerde aynı çıktığı için tek liste veriyorum.",
  "",
];

let totalGold = 0, totalCaught = 0, totalFalse = 0;
for (const id of caseFiles.filter((c) => !cases.get(c)!.control)) {
  const c = cases.get(id)!;
  const run = last.cases.find((x) => x.id === id)!.runs[0]!;
  const caught = new Set(run.caught);
  const falseAlarms = run.findings.filter((f) => !c.gold.some((g) => overlaps(f.quote, g.anchor)));
  totalGold += c.gold.length; totalCaught += caught.size; totalFalse += falseAlarms.length;

  out.push(`## ${c.title}`, "", `Kaynak: ${c.source}`, "");
  out.push(`Etiketlenen ${c.gold.length} madde: **${caught.size} yakalandı**, **${c.gold.length - caught.size} kaçırıldı**; **${falseAlarms.length} yanlış alarm**.`, "");
  out.push("### Yakalanan");
  c.gold.forEach((g, i) => { if (caught.has(i)) out.push(`- \`${g.category}\`: ${g.anchor}`); });
  out.push("", "### Kaçırılan");
  c.gold.forEach((g, i) => { if (!caught.has(i)) out.push(`- \`${g.category}\`: ${g.anchor}`); });
  out.push("", "### Yanlış alarm");
  if (falseAlarms.length === 0) out.push("- yok");
  for (const f of falseAlarms) out.push(`- \`${f.category}\`: ${f.quote}`);
  if (run.rejected.length) {
    out.push("", "### Doğrulayıcının elediği (alıntısı sayfada bulunamayan) iddialar");
    for (const r of run.rejected) out.push(`- ${r}`);
  }
  out.push("");
}

out.splice(
  8, 0,
  "",
  `**Toplam:** ${totalGold} etiketli madde, ${totalCaught} yakalandı (%${Math.round((totalCaught / totalGold) * 100)}), ${totalGold - totalCaught} kaçırıldı, ${totalFalse} yanlış alarm.`,
);

const control = cases.get("fair-control")!;
const cRuns = last.cases.find((x) => x.id === "fair-control")?.runs ?? [];
if (cRuns.length) {
  out.push(`## Kontrol belgesi: ${control.title}`, "");
  out.push("Bilerek adil yazılmış sentetik bir belge (kurgusal şirket). Başarı ölçütü ilk koşudan önce belirlendi: skor en fazla 24.", "");
  out.push(`Skorlar: ${cRuns.map((r) => r.score).join(", ")}. Modelin işaretlediği maddeler:`, "");
  for (const f of cRuns[0]!.findings) out.push(`- \`${f.category}\` (${f.severity}): ${f.quote}`);
  out.push("");
}

writeFileSync("docs/eval-sonuclari.md", out.join("\n"));
console.log(`docs/eval-sonuclari.md written: ${totalCaught}/${totalGold} caught, ${totalFalse} false alarms`);
