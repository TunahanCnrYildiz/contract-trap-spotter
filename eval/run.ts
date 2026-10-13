// Mini eval: runs the real pipeline (prompt -> LLM -> schema -> verifier)
// on hand-labelled documents and counts caught / missed / false alarms.
//
// Usage: npm run eval            (needs GEMINI_API_KEY and GEMINI_MODEL in .env)
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { analyse } from "../src/core/llm";
import { prepareSource } from "../src/core/prompt";
import { verifyFindings } from "../src/core/verify";
import { normalizeForMatch } from "../src/core/text";
import { quoteSegments } from "../src/core/quote";
import { Window as HappyWindow } from "happy-dom";
import { extractMainText } from "../src/content/main-text";

type Gold = { category: string; anchor: string; note?: string };
type Case = { id: string; title: string; file: string; source: string; stopBefore?: string; gold: Gold[] };

const args = process.argv.slice(2);
const checkOnly = args.includes("--check"); // validate gold anchors, no LLM calls
const only = args.filter((a) => !a.startsWith("--"));
const repeat = Number(args.find((a) => a.startsWith("--repeat="))?.split("=")[1] ?? 1); // runs per document

// HTML cases go through the same extractor the extension uses; .txt cases are read as is.
function loadDocument(file: string, stopBefore?: string): string {
  const raw = readFileSync(join("eval/docs", file), "utf8");
  if (!file.endsWith(".html")) return raw;
  const win = new HappyWindow({
    settings: {
      disableJavaScriptEvaluation: true,
      disableJavaScriptFileLoading: true,
      disableCSSFileLoading: true,
      handleDisabledFileLoadingAsSuccess: true,
    },
  });
  win.document.write(raw);
  const text = extractMainText(win.document as unknown as Document, win as unknown as Window).text;
  // Some saved pages hold several regional variants. A real browser shows one, so cut at the marker.
  const cut = stopBefore ? text.indexOf(stopBefore) : -1;
  return cut > 0 ? text.slice(0, cut) : text;
}

const apiKey = process.env.GEMINI_API_KEY ?? "";
const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
if (!apiKey && !checkOnly) {
  console.error("GEMINI_API_KEY is not set. Fill in .env first.");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function analyseWithRetry(text: string) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await analyse(text, { apiKey, model });
    } catch (e) {
      if (attempt >= 5) throw e;
      await sleep(8000 * attempt);
    }
  }
}

// A finding matches a gold item when their text spans overlap.
function overlaps(quote: string, anchor: string): boolean {
  const a = normalizeForMatch(anchor);
  // A quote with "..." matches when any of its pieces overlaps the anchor.
  return quoteSegments(quote).some((q) => q.includes(a) || a.includes(q));
}

// Optional filter: npm run eval -- netflix reddit
const cases: Case[] = readdirSync("eval/cases")
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => JSON.parse(readFileSync(join("eval/cases", f), "utf8")) as Case)
  .filter((c) => (only.length ? only.includes(c.id) : true))
  .filter((c) => {
    if (c.gold.length === 0) console.log(`[${c.id}] skipped: no gold labels yet`);
    return c.gold.length > 0;
  });

if (cases.length === 0) {
  console.error("No cases in eval/cases. See eval/README.md.");
  process.exit(1);
}


type Run = {
  caught: Set<number>; // indexes into c.gold
  falseAlarms: string[];
  verified: number;
  rejected: string[];
  score: number;
  findings: unknown[];
};
type Done = { c: Case; truncated: boolean; runs: Run[] };

const done: Done[] = [];

for (const c of cases) {
  const raw = loadDocument(c.file, c.stopBefore);
  const { text, truncated } = prepareSource(raw);
  const haystack = normalizeForMatch(text);

  // Fail loudly if a gold anchor is not in the document: the label would be meaningless.
  for (const g of c.gold) {
    if (!haystack.includes(normalizeForMatch(g.anchor))) {
      console.error(`[${c.id}] gold anchor not found in document: "${g.anchor.slice(0, 60)}"`);
      process.exit(1);
    }
  }

  if (checkOnly) {
    console.log(`[${c.id}] ok: ${c.gold.length} anchors found, ${text.length} chars${truncated ? " (truncated)" : ""}`);
    continue;
  }

  const runs: Run[] = [];
  for (let r = 1; r <= repeat; r++) {
    const output = await analyseWithRetry(text);
    const report = verifyFindings(output, text, { truncated });
    const caught = new Set<number>();
    c.gold.forEach((g, i) => {
      if (report.findings.some((f) => overlaps(f.quote, g.anchor))) caught.add(i);
    });
    const falseAlarms = report.findings
      .filter((f) => !c.gold.some((g) => overlaps(f.quote, g.anchor)))
      .map((f) => `[${f.category}] ${f.quote}`);
    runs.push({
      caught,
      falseAlarms,
      verified: report.findings.length,
      rejected: report.rejected.map((x) => `(${x.reason}) ${x.finding.quote}`),
      score: report.score,
      findings: report.findings,
    });
    console.log(`${c.id} run ${r}/${repeat}: caught ${caught.size}/${c.gold.length}, false alarms ${falseAlarms.length}, rejected ${report.rejected.length}, score ${report.score}`);
    await sleep(1500);
  }
  done.push({ c, truncated, runs });
}

if (checkOnly) process.exit(0);

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const range = (xs: number[]) => (Math.min(...xs) === Math.max(...xs) ? `${xs[0]}` : `${Math.min(...xs)}-${Math.max(...xs)}`);
const pct = (x: number) => `${(x * 100).toFixed(0)}%`;

const rows: string[] = [];
const details: string[] = [];
for (const { c, truncated, runs } of done) {
  const hits = c.gold.map((_, i) => runs.filter((r) => r.caught.has(i)).length);
  const always = hits.filter((h) => h === runs.length).length;
  const never = hits.filter((h) => h === 0).length;
  const caughtPerRun = runs.map((r) => r.caught.size);
  rows.push(
    `| ${c.title} | ${c.gold.length} | ${mean(caughtPerRun).toFixed(1)} (${range(caughtPerRun)}) | ${always} | ${c.gold.length - always - never} | ${never} | ${mean(runs.map((r) => r.falseAlarms.length)).toFixed(1)} | ${mean(runs.map((r) => r.rejected.length)).toFixed(1)} | ${Math.round(mean(runs.map((r) => r.score)))} |`,
  );

  details.push(`### ${c.title}\n`);
  details.push(`Source: ${c.source}${truncated ? " (text truncated)" : ""}\n`);
  c.gold.forEach((g, i) => {
    const label = hits[i] === 0 ? "MISSED" : hits[i] === runs.length ? "caught" : "FLAKY";
    details.push(`- ${label} ${hits[i]}/${runs.length}: [${g.category}] ${g.anchor.slice(0, 90)}`);
  });
  const count = (lists: string[][]) => {
    const m = new Map<string, number>();
    for (const l of lists) for (const s of new Set(l)) m.set(s, (m.get(s) ?? 0) + 1);
    return [...m.entries()];
  };
  for (const [s, n] of count(runs.map((r) => r.falseAlarms))) details.push(`- FALSE ALARM ${n}/${runs.length}: ${s.slice(0, 100)}`);
  for (const [s, n] of count(runs.map((r) => r.rejected))) details.push(`- rejected by verifier ${n}/${runs.length}: ${s.slice(0, 100)}`);
  details.push("");
}

const totalGold = done.reduce((n, d) => n + d.c.gold.length, 0);
const perRun = Array.from({ length: repeat }, (_, r) => {
  const caught = done.reduce((n, d) => n + d.runs[r]!.caught.size, 0);
  const verified = done.reduce((n, d) => n + d.runs[r]!.verified, 0);
  const falseN = done.reduce((n, d) => n + d.runs[r]!.falseAlarms.length, 0);
  return { recall: caught / totalGold, precision: verified ? (verified - falseN) / verified : 0, caught, falseN };
});

const md = [
  `# Eval results`,
  ``,
  `Model: \`${model}\` · documents: ${done.length} · gold items: ${totalGold} · runs per document: ${repeat} · date: ${new Date().toISOString().slice(0, 10)}`,
  ``,
  `| Document | Gold | Caught per run, mean (range) | Caught every run | Caught some runs | Never caught | False alarms per run | Rejected by verifier per run | Score (mean) |`,
  `|---|---|---|---|---|---|---|---|---|`,
  ...rows,
  ``,
  `Recall per run: ${perRun.map((p) => pct(p.recall)).join(", ")} · mean ${pct(mean(perRun.map((p) => p.recall)))}`,
  `Precision per run: ${perRun.map((p) => pct(p.precision)).join(", ")} · mean ${pct(mean(perRun.map((p) => p.precision)))}`,
  ``,
  `"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong. "Some runs" means the item is caught in at least one but not all runs (flaky).`,
  ``,
  ...details,
].join("\n");

writeFileSync("eval/results.md", md);
// Raw verified findings, so scoring changes can be checked offline without new LLM calls.
writeFileSync(
  "eval/last-run.json",
  JSON.stringify({ model, date: new Date().toISOString(), repeat, cases: done.map((d) => ({ id: d.c.id, truncated: d.truncated, runs: d.runs.map((r) => ({ caught: [...r.caught], findings: r.findings, rejected: r.rejected, score: r.score })) })) }, null, 1),
);
console.log(`\nmean recall ${pct(mean(perRun.map((p) => p.recall)))}  mean precision ${pct(mean(perRun.map((p) => p.precision)))}  -> eval/results.md`);
