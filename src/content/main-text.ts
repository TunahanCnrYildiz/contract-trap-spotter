// Pulls the readable main text out of a page and separately collects text that is
// hidden from the reader. Pure DOM code: works on any Document, so it can be tested
// without a browser.

export type PageText = {
  text: string;
  // Text the reader cannot see (display:none, zero font size, off-screen ...).
  // It is never sent to the model, only scanned for injection attempts.
  hiddenText: string;
  root: string;
};

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG", "CANVAS", "IFRAME",
  "SELECT", "OPTION", "BUTTON", "INPUT", "TEXTAREA", "HEAD",
]);
// Page furniture. Skipped unless we are inside the chosen main element and it is a header.
const CHROME_SELECTOR =
  "nav,aside,footer,[role=navigation],[role=banner],[role=contentinfo],[role=complementary],[role=menu],[role=dialog],[aria-modal=true]";
const BLOCK_TAGS = new Set([
  "P", "DIV", "LI", "UL", "OL", "SECTION", "ARTICLE", "MAIN", "HEADER", "H1", "H2", "H3", "H4",
  "H5", "H6", "TR", "TABLE", "BLOCKQUOTE", "DD", "DT", "DL", "BR", "PRE", "FORM", "FIGURE",
]);
const MAIN_CANDIDATES = "main,[role=main],article,#content,#main,#main-content,.main-content";

const MIN_HIDDEN_LEN = 15;
const MENU_MAX_LEN = 200;
const MENU_LINK_RATIO = 0.8;

function isHidden(el: Element, win: Window): boolean {
  if (el.hasAttribute("hidden") || el.getAttribute("aria-hidden") === "true") return true;
  const cs = win.getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden" || cs.visibility === "collapse") return true;
  if (cs.opacity !== "" && parseFloat(cs.opacity) === 0) return true;
  if (cs.fontSize !== "" && parseFloat(cs.fontSize) === 0) return true;
  if (cs.position === "absolute" || cs.position === "fixed") {
    const left = parseFloat(cs.left);
    const top = parseFloat(cs.top);
    if (left <= -1000 || top <= -1000) return true;
  }
  return false;
}

function pickRoot(doc: Document): Element {
  const body = doc.body;
  const bodyLen = (body.textContent ?? "").length;
  let best: Element | null = null;
  let bestLen = 0;
  doc.querySelectorAll(MAIN_CANDIDATES).forEach((el) => {
    const len = (el.textContent ?? "").length;
    if (len > bestLen) {
      best = el;
      bestLen = len;
    }
  });
  if (best && (bestLen >= 3000 || bestLen >= bodyLen * 0.3)) return best;
  return body;
}

function describe(el: Element): string {
  return el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "");
}

export function extractMainText(doc: Document, win: Window): PageText {
  const root = pickRoot(doc);
  const lines: string[] = [];
  const hidden: string[] = [];
  let buf = "";
  let linkLen = 0;

  const flush = () => {
    const line = buf.replace(/\s+/g, " ").trim();
    // A short line made almost entirely of links is a menu, not content.
    const isMenu = line.length > 0 && line.length <= MENU_MAX_LEN && linkLen / line.length >= MENU_LINK_RATIO;
    if (line && !isMenu) lines.push(line);
    buf = "";
    linkLen = 0;
  };

  const walk = (el: Element, insideLink: boolean) => {
    if (SKIP_TAGS.has(el.tagName.toUpperCase())) return;
    if (isHidden(el, win)) {
      const t = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      if (t.length >= MIN_HIDDEN_LEN) hidden.push(t);
      return;
    }
    if (el !== root && el.matches(CHROME_SELECTOR)) return;
    // <header> is page furniture outside the main element, a heading block inside it.
    if (el !== root && el.tagName === "HEADER" && root === doc.body) return;

    const block = BLOCK_TAGS.has(el.tagName.toUpperCase());
    const isLink = el.tagName === "A";
    if (block) flush();
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 3) {
        const t = node.textContent ?? "";
        buf += t;
        if (insideLink || isLink) linkLen += t.replace(/\s+/g, " ").trim().length;
      } else if (node.nodeType === 1) {
        walk(node as Element, insideLink || isLink);
      }
    }
    if (block) flush();
  };

  walk(root, false);
  flush();

  // Collapse repeated lines (menus often render twice).
  const seen = new Set<string>();
  const unique = lines.filter((l) => (seen.has(l) ? false : (seen.add(l), true)));
  return { text: unique.join("\n"), hiddenText: hidden.join("\n"), root: describe(root) };
}
