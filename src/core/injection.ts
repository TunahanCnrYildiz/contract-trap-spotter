import { normalizeForMatch } from "./text";

// Heuristic patterns for text that talks to the model instead of the reader.
// This is a tripwire, not the main defence. The main defences are: hidden text never
// reaches the model, the prompt marks the document as data, every quote is verified
// against the page, and the score is computed in code.
// Patterns run on text folded to ASCII, so Turkish letters are written without accents.
const PATTERNS: { id: string; re: RegExp }[] = [
  { id: "ignore-instructions", re: /(ignore|disregard|forget)\b.{0,40}\b(previous|prior|above|all)\b.{0,30}\b(instructions?|prompts?|rules?)/ },
  { id: "tr-ignore-instructions", re: /(onceki|yukaridaki|tum)\s+(talimat|komut|yonerge)\w*\s+(unut|yok say|gormezden)/ },
  { id: "role-override", re: /(you are now|act as|new instructions?|system prompt|developer message|system:)/ },
  { id: "tr-role-override", re: /(sen artik|yeni talimat|sistem istemi)/ },
  { id: "address-the-model", re: /(note|message|attention|instructions?|notice)\s+(to|for)\s+(the\s+)?(ai|llm|language model|assistant|model|chatbot)/ },
  { id: "suppress-findings", re: /(do not|don't|never|must not|no need to)\s+(report|list|flag|mention)\b.{0,40}\b(finding|risk|issue|clause)/ },
  { id: "force-empty-output", re: /(return|output|respond with|answer with|give)\b.{0,25}\b(empty|no|zero)\b.{0,25}\b(finding|result|list|risk)/ },
  { id: "force-low-rating", re: /(mark|rate|set|classify|label)\b.{0,30}\b(every|all|each)\b.{0,30}\b(low|safe|harmless)/ },
  { id: "force-verdict", re: /(risk|score|skor)\w*.{0,30}\b(0|zero|sifir|low|dusuk|safe|guvenli)\b/ },
  { id: "reassure-user", re: /(nothing to worry|completely safe|contains no risky|no risky clauses)/ },
  { id: "tell-model", re: /(ai|llm|language model|yapay zeka|model)\b.{0,30}\b(must|should|do not|never|mutlaka|asla|gerek)/ },
  { id: "tr-suppress-findings", re: /(bulgu|risk)\w*.{0,30}(raporlama|bildirme|listeleme|belirtme)/ },
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
