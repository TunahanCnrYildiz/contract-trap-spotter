# Eval

Her vaka `eval/cases/` altında bir JSON dosyası, belgesi `eval/docs/` altında bir HTML (veya düz metin) dosyasıdır.

```json
{
  "id": "example",
  "title": "Example Inc. Terms of Service",
  "file": "example.html",
  "source": "https://example.com/terms (retrieved 2026-10-13)",
  "stopBefore": "isteğe bağlı: bu metinden öncesini analiz et (aynı sayfada birden fazla bölgesel sürüm varsa)",
  "gold": [
    { "category": "auto_renewal", "anchor": "belgeden birebir kopyalanmış cümle" }
  ]
}
```

- `.html` dosyaları uzantıyla aynı ana metin çıkarıcıdan geçirilir, `.txt` dosyaları olduğu gibi okunur.
- `gold` etiketleri, model çalıştırılmadan önce elle belirlenir. Anchor belgeden birebir kopyalanmalıdır; betik her anchor'ın belgede bulunduğunu denetler, bulunmazsa durur.
- Modelin bir bulgusu, alıntısı bir gold anchor ile örtüşüyorsa o madde yakalanmış sayılır.
- Etiketleme kuralları ve sonuçlar için ana [README](../README.md)'ye bakın.

Komutlar:

```bash
npx tsx eval/run.ts --check          # sadece etiketleri denetler, model çağırmaz
npm run eval                         # her belge bir kez
npm run eval -- --repeat=3           # her belge 3 kez
npm run eval -- netflix reddit       # yalnızca seçili vakalar
npm run injection                    # prompt injection testi
npx tsx eval/extract-check.ts x.html # çıkarıcının bir HTML dosyasından ne aldığını gösterir
npx tsx eval/candidates.ts netflix   # etiketleme için anahtar kelime ile aday cümleler
```

Çıktılar: `eval/results.md` (son çalıştırma), `eval/last-run.json` (ham bulgular) ve `eval/history/` (tarihli kayıtlar).
