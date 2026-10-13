# Eval

Each case is a JSON file in `eval/cases/` and a plain-text document in `eval/docs/`.

```json
{
  "id": "example",
  "title": "Example Inc. Terms of Service",
  "file": "example.txt",
  "source": "https://example.com/terms (retrieved 2026-10-13)",
  "gold": [
    { "category": "auto_renewal", "anchor": "exact sentence copied from the document" }
  ]
}
```

- `gold` is labelled by hand, before running the model. Copy the anchor text from the document.
- The runner checks every anchor exists in the document and stops if not.
- A model finding counts as a hit when its quote overlaps a gold anchor.
- Run with `npm run eval`. Output goes to `eval/results.md`.
