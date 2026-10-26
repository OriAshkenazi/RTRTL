---
type: regex
pattern: 'get_display|\[::-1\]|reversed\('
match: not_contains
target: { source: file, path: make_receipt.py }
weight: 1
---

make_receipt.py does not reorder the Hebrew text before WeasyPrint lays it out.
