---
type: llm
focus: { source: file, path: make_deck.js }
weight: 1
---

make_deck.js sets rtl="1" on each table's a:tblPr (pptxgenjs writes an empty <a:tblPr/>), for example by editing the slide XML after writing, and does not get the column order by reversing the row arrays.
