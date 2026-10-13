// Runs the main-text extractor on a saved HTML file and prints what it keeps.
// Usage: npx tsx eval/extract-check.ts page.html
import { readFileSync } from "node:fs";
import { Window as HappyWindow } from "happy-dom";
import { extractMainText } from "../src/content/main-text";

const file = process.argv[2];
if (!file) {
  console.error("usage: tsx eval/extract-check.ts <file.html>");
  process.exit(1);
}
const win = new HappyWindow({
  settings: {
    disableJavaScriptEvaluation: true,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
    handleDisabledFileLoadingAsSuccess: true,
  },
});
win.document.write(readFileSync(file, "utf8"));
const r = extractMainText(win.document as unknown as Document, win as unknown as Window);
console.log(`root: ${r.root} · text: ${r.text.length} chars · hidden: ${r.hiddenText.length} chars`);
console.log(r.text.slice(0, 500));
