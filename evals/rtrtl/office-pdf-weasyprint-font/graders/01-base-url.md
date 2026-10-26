---
type: regex
pattern: 'base_url|HTML\(\s*filename\s*='
target: { source: file, path: make_receipt.py }
weight: 1
---

make_receipt.py gives WeasyPrint a base URL (base_url=..., or loads the HTML from a file) so fonts/NotoSansHebrew.ttf resolves.
