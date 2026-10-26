---
type: regex
pattern: '\[::-1\]|reversed\(|\.reverse\('
match: not_contains
target: { source: file, path: make_invoice.py }
weight: 1
---

make_invoice.py does not reverse the row data to get the column order.
