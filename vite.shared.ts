import type { Plugin } from "vite";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// The e2e build talks to a local mock model instead of Gemini. It is a separate output
// folder with its own manifest, so the normal build never contains the mock address.
export const E2E_LLM_BASE = "http://localhost:8787";

export function target(mode: string) {
  const e2e = mode === "e2e";
  return {
    e2e,
    outDir: e2e ? "dist-e2e" : "dist",
    define: e2e ? { "import.meta.env.VITE_LLM_BASE": JSON.stringify(E2E_LLM_BASE) } : {},
  };
}

export function e2eManifest(outDir: string): Plugin {
  return {
    name: "e2e-manifest",
    closeBundle() {
      const file = resolve(import.meta.dirname, outDir, "manifest.json");
      const m = JSON.parse(readFileSync(file, "utf8"));
      m.host_permissions = [...(m.host_permissions ?? []), `${E2E_LLM_BASE}/*`];
      // Cypress runs the page inside an iframe, so the content script has to enter frames too.
      for (const cs of m.content_scripts ?? []) cs.all_frames = true;
      writeFileSync(file, JSON.stringify(m, null, 2));
    },
  };
}
