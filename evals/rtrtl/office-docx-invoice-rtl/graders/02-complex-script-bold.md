---
type: regex
pattern: 'bCs|cs_bold'
target: { source: file, path: make_invoice.py }
weight: 1
---

make_invoice.py sets complex-script bold (w:bCs, or python-docx font.cs_bold) for the heading.
