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

type Gold = { category: string; anchor: string; note?: string };
type Case = { id: string; title: string; file: string; source: string; gold: Gold[] };

const apiKey = process.env.GEMINI_API_KEY ?? "";
const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
if (!apiKey) {
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
  const q = normalizeForMatch(quote);
  const a = normalizeForMatch(anchor);
  return q.includes(a) || a.includes(q);
}

// Optional filter: npm run eval -- netflix reddit
const only = process.argv.slice(2);
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

const rows: string[] = [];
const details: string[] = [];
let totalGold = 0, totalCaught = 0, totalFalse = 0, totalVerified = 0, totalRejected = 0;

for (const c of cases) {
  const raw = readFileSync(join("eval/docs", c.file), "utf8");
  const { text, truncated } = prepareSource(raw);
  const haystack = normalizeForMatch(text);

  // Fail loudly if a gold anchor is not in the document: the label would be meaningless.
  for (const g of c.gold) {
    if (!haystack.includes(normalizeForMatch(g.anchor))) {
      console.error(`[${c.id}] gold anchor not found in document: "${g.anchor.slice(0, 60)}"`);
      process.exit(1);
    }
  }

  const output = await analyseWithRetry(text);
  const report = verifyFindings(output, text, { truncated });

  const caught = c.gold.filter((g) => report.findings.some((f) => overlaps(f.quote, g.anchor)));
  const missed = c.gold.filter((g) => !caught.includes(g));
  const falseAlarms = report.findings.filter((f) => !c.gold.some((g) => overlaps(f.quote, g.anchor)));

  totalGold += c.gold.length;
  totalCaught += caught.length;
  totalFalse += falseAlarms.length;
  totalVerified += report.findings.length;
  totalRejected += report.rejected.length;

  rows.push(
    `| ${c.title} | ${c.gold.length} | ${caught.length} | ${missed.length} | ${falseAlarms.length} | ${report.rejected.length} | ${report.score} |`,
  );
  details.push(`### ${c.title}\n`);
  details.push(`Source: ${c.source}${truncated ? " (text truncated)" : ""}\n`);
  for (const g of caught) details.push(`- caught: [${g.category}] ${g.anchor.slice(0, 90)}`);
  for (const g of missed) details.push(`- MISSED: [${g.category}] ${g.anchor.slice(0, 90)}`);
  for (const f of falseAlarms) details.push(`- FALSE ALARM: [${f.category}] ${f.quote.slice(0, 90)}`);
  for (const r of report.rejected) details.push(`- rejected by verifier (${r.reason}): ${r.finding.quote.slice(0, 90)}`);
  details.push("");
  console.log(`${c.id}: caught ${caught.length}/${c.gold.length}, false alarms ${falseAlarms.length}, rejected ${report.rejected.length}`);
  await sleep(1500);
}

const recall = totalGold ? totalCaught / totalGold : 0;
const precision = totalVerified ? (totalVerified - totalFalse) / totalVerified : 0;

const md = [
  `# Eval results`,
  ``,
  `Model: \`${model}\` · cases: ${cases.length} · run: ${new Date().toISOString().slice(0, 10)}`,
  ``,
  `| Document | Gold | Caught | Missed | False alarms | Rejected by verifier | Score |`,
  `|---|---|---|---|---|---|---|`,
  ...rows,
  `| **Total** | ${totalGold} | ${totalCaught} | ${totalGold - totalCaught} | ${totalFalse} | ${totalRejected} | |`,
  ``,
  `Recall: ${(recall * 100).toFixed(0)}% · Precision: ${(precision * 100).toFixed(0)}%`,
  ``,
  `"False alarm" means a verified finding that matches no gold label. It may be a real risk the labeller did not mark, so read each one before calling it wrong.`,
  ``,
  ...details,
].join("\n");

writeFileSync("eval/results.md", md);
console.log(`\nrecall ${(recall * 100).toFixed(0)}%  precision ${(precision * 100).toFixed(0)}%  -> eval/results.md`);
