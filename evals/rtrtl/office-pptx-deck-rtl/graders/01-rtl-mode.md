---
type: regex
pattern: 'rtlMode\s*[:=]\s*true'
target: { source: file, path: make_deck.js }
weight: 1
---

make_deck.js turns on pptxgenjs rtlMode for the Hebrew text.
