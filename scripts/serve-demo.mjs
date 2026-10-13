// Serves the demo pages on http://localhost:8788 so the extension can be tried on them by hand.
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve("demo");
const port = 8788;

createServer((req, res) => {
  const path = (req.url ?? "/").split("?")[0].replace(/^\/+/, "") || "terms-clean.html";
  const file = join(root, path);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(readFileSync(file));
}).listen(port, () => {
  console.log(`http://localhost:${port}/terms-clean.html`);
  console.log(`http://localhost:${port}/terms-injected.html`);
});
