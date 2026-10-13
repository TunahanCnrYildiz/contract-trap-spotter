import { defineConfig } from "vite";
import { resolve } from "node:path";
import { e2eManifest, target } from "./vite.shared";

// Popup, options page and background worker. The content script is built separately
// (vite.content.config.ts) because content scripts cannot be ES modules.
export default defineConfig(({ mode }) => {
  const t = target(mode);
  return {
    publicDir: "public",
    define: t.define,
    plugins: t.e2e ? [e2eManifest(t.outDir)] : [],
    build: {
      outDir: t.outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(import.meta.dirname, "popup.html"),
          options: resolve(import.meta.dirname, "options.html"),
          background: resolve(import.meta.dirname, "src/background/index.ts"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "chunks/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
      },
    },
  };
});
