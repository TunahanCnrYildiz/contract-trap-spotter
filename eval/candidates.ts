// Helper for labelling: prints sentences that contain risk keywords, with their
// category hint, so you can decide by hand which ones belong in "gold".
// Usage: npx tsx eval/candidates.ts spotify
import { readFileSync } from "node:fs";

const KEYWORDS: Record<string, RegExp> = {
  auto_renewal: /auto(matic)?(ally)?[- ]renew|renew(s|ed)? automatically|recurring (charge|billing|payment)/i,
  data_sharing: /share (your|personal)|sell (your|personal)|advertis(ing|ers)|third[- ]part(y|ies)/i,
  arbitration_waiver: /arbitrat|class action|jury trial|waive/i,
  unilateral_change: /(modify|change|update|amend) (these|the) (terms|agreement)|at any time.{0,40}(change|modify|terminate)/i,
  liability_limit: /limit(ation)? of liability|not be liable|disclaim|"as is"|as is/i,
  cancellation_difficulty: /no refund|non-refundable|cancel(l)?ation.{0,40}(fee|notice)/i,
  data_retention: /retain|retention|delete your (data|account)/i,
  content_license: /(perpetual|irrevocable|worldwide|royalty[- ]free|sublicens)/i,
  tracking: /cookies|track(ing)?|pixel|fingerprint/i,
};

const id = process.argv[2];
if (!id) { console.error("usage: tsx eval/candidates.ts <doc id>"); process.exit(1); }
const text = readFileSync(`eval/docs/${id}.txt`, "utf8");
const sentences = text.split(/(?<=[.!?])\s+|\n{2,}/).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length > 40);

for (const [cat, re] of Object.entries(KEYWORDS)) {
  const hits = sentences.filter((s) => re.test(s));
  if (!hits.length) continue;
  console.log(`\n## ${cat} (${hits.length})`);
  hits.slice(0, 8).forEach((s, i) => console.log(`${i + 1}. ${s.slice(0, 260)}`));
}
