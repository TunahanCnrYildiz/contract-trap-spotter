import { defineConfig } from "cypress";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { startMockLlm } from "./cypress/mock-llm";

const DEMO_PORT = 8788;

export default defineConfig({
  video: true,
  e2e: {
    supportFile: false,
    specPattern: "cypress/e2e/**/*.cy.ts",
    chromeWebSecurity: false,
    viewportWidth: 1100,
    viewportHeight: 760,
    setupNodeEvents(on) {
      // Static server for the demo pages and the scripted model for the extension.
      const demoDir = resolve("demo");
      createServer((req, res) => {
        const file = join(demoDir, (req.url ?? "/").split("?")[0]!.replace(/^\/+/, ""));
        if (!file.startsWith(demoDir) || !existsSync(file)) { res.writeHead(404).end(); return; }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(readFileSync(file));
      }).listen(DEMO_PORT);
      const llm = startMockLlm();

      on("task", { lastLlmRequest: () => llm.lastRequest() });

      // Load the e2e build of the extension. Needs Chrome for Testing or Chromium:
      // branded Chrome 137+ ignores --load-extension.
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.extensions.push(resolve("dist-e2e"));
          // Chrome 137+ switched --load-extension off by default, even in test builds.
          launchOptions.args.push("--disable-features=DisableLoadExtensionCommandLineSwitch");
        }
        return launchOptions;
      });
    },
  },
});
