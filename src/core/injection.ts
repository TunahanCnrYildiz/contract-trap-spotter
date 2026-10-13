import { normalizeForMatch } from "./text";

// Heuristic patterns for text that talks to the model instead of the reader.
// This is a tripwire, not the main defence: the main defences are the
// data/instruction separation in the prompt and the quote verifier.
const PATTERNS: { id: string; re: RegExp }[] = [
  { id: "ignore-instructions", re: /(ignore|disregard|forget)\b.{0,40}\b(previous|prior|above|all)\b.{0,30}\b(instructions?|prompts?|rules?)/ },
  { id: "tr-ignore-instructions", re: /(onceki|yukaridaki|tum)\s+(talimat|komut|yonerge)\w*\s+(unut|yok say|gormezden)/ },
  { id: "role-override", re: /(you are now|act as|new instructions?|system prompt|developer message)/ },
  { id: "tr-role-override", re: /(sen artik|yeni talimat|sistem istemi)/ },
  { id: "force-verdict", re: /(risk|score|skor)\w*.{0,30}\b(0|zero|sifir|low|dusuk|safe|guvenli)\b/ },
  { id: "tell-model", re: /(ai|llm|language model|yapay zeka|model)\b.{0,30}\b(must|should|do not|never|mutlaka|asla|gerek)/ },
];

function foldTr(s: string): string {
  return normalizeForMatch(s)
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c");
}

export function detectInjection(text: string): string[] {
  const folded = foldTr(text);
  return PATTERNS.filter((p) => p.re.test(folded)).map((p) => p.id);
}

// A finding whose quote is itself an instruction aimed at the model is dropped.
export function looksLikeInstruction(quote: string): boolean {
  return detectInjection(quote).length > 0;
}
