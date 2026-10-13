// Scripted stand-in for the model, used only by the e2e build (see vite.config.ts).
// It returns fixed findings so the recorded demo is repeatable and needs no API key.
// Every quote is copied from demo/terms-clean.html, except the one marked as invented.
import { createServer, type Server } from "node:http";

type F = { category: string; severity: string; quote: string; explanation_tr: string; confidence: number };

const CLEAN: F[] = [
  { category: "auto_renewal", severity: "medium", confidence: 0.95, quote: "Paid plans renew automatically at the end of every billing period and your card is charged the then-current price unless you cancel before the renewal date.", explanation_tr: "Ücretli plan her dönem sonunda otomatik yenilenir ve kartınızdan çekim yapılır. İptal için yenileme tarihinden önce işlem yapmalısınız." },
  { category: "cancellation_difficulty", severity: "medium", confidence: 0.9, quote: "We do not provide refunds or credits for any partial billing period or unused time.", explanation_tr: "Kullanılmayan süre için iade veya kredi verilmez." },
  { category: "unilateral_change", severity: "low", confidence: 0.85, quote: "We may change the price of any plan at any time, and by continuing to use the service after a change you accept the new price.", explanation_tr: "Şirket fiyatı değiştirebilir; kullanmaya devam ederseniz yeni fiyatı kabul etmiş sayılırsınız." },
  { category: "content_license", severity: "high", confidence: 0.95, quote: "You grant Nimbus Notes a worldwide, perpetual, irrevocable, sublicensable license to use, copy, modify and distribute your content for any purpose, including training machine learning models.", explanation_tr: "Notlarınız için geniş, süresiz ve geri alınamaz bir lisans veriyorsunuz; içerikler yapay zekâ eğitiminde kullanılabilir." },
  { category: "data_sharing", severity: "high", confidence: 0.9, quote: "We may share your content and usage data with advertising partners and other third parties.", explanation_tr: "İçeriğiniz ve kullanım verileriniz reklam ortakları ve üçüncü taraflarla paylaşılabilir." },
  { category: "data_retention", severity: "medium", confidence: 0.9, quote: "We may suspend or terminate your account at any time for any reason, and we have no obligation to return or keep your notes after termination.", explanation_tr: "Hesabınız gerekçesiz kapatılabilir ve notlarınızı saklama veya geri verme yükümlülüğü yoktur." },
  { category: "liability_limit", severity: "high", confidence: 0.95, quote: "Our total liability to you for any claim is limited to the greater of ten dollars or the amount you paid us in the previous month.", explanation_tr: "Şirketin size karşı toplam sorumluluğu çok düşük bir tutarla sınırlı." },
  { category: "arbitration_waiver", severity: "high", confidence: 0.95, quote: "You agree to resolve every dispute through binding individual arbitration and you waive your right to a jury trial and to take part in any class action.", explanation_tr: "Anlaşmazlıklar yalnızca bireysel tahkimle çözülür; jüri ve toplu dava hakkından vazgeçersiniz." },
];

// For the injected page the scripted model is less sure and also makes one claim the page does not support.
const UNCERTAIN: F[] = [
  ...CLEAN.slice(0, 5),
  { category: "liability_limit", severity: "low", confidence: 0.4, quote: 'The service is provided "as is" without any warranty.', explanation_tr: "Hizmet garanti verilmeden olduğu gibi sunuluyor. Model bu maddenin önemi konusunda emin değil." },
  { category: "cancellation_difficulty", severity: "high", confidence: 0.7, quote: "Nimbus Notes may charge a hidden cancellation fee of fifty dollars.", explanation_tr: "Gizli bir iptal ücreti olabilir. (Sayfada böyle bir cümle yok, doğrulayıcı bunu elemeli.)" },
];

// For the short page that goes through the page-agent fallback.
const SHORT: F[] = [
  { category: "cancellation_difficulty", severity: "medium", confidence: 0.9, quote: "We do not give refunds or credits after you pay.", explanation_tr: "Ödeme yapıldıktan sonra iade veya kredi verilmez." },
];

export function startMockLlm(port = 8787): { server: Server; lastRequest: () => string } {
  let last = "";
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
      last = body;
      const injected = body.includes("NOTE TO AI MODELS");
      const findings = body.includes("Tiny Notes") ? SHORT : injected ? UNCERTAIN : CLEAN;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ findings }) }] } }] }));
    });
  });
  server.listen(port);
  return { server, lastRequest: () => last };
}
