import { defineConfig } from "vite";
import { resolve } from "node:path";
import { target } from "./vite.shared";

// Content script as one self-contained file (IIFE): no imports, nothing to load at runtime.
export default defineConfig(({ mode }) => {
  const t = target(mode);
  return {
    publicDir: false,
    define: t.define,
    build: {
      outDir: t.outDir,
      emptyOutDir: false,
      lib: {
        entry: resolve(import.meta.dirname, "src/content/index.ts"),
        formats: ["iife"],
        name: "ContractTrapSpotter",
        fileName: () => "content.js",
      },
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  };
});
