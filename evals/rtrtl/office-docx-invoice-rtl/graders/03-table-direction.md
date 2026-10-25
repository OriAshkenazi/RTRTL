---
type: regex
pattern: 'table_direction|bidiVisual'
target: { source: file, path: make_invoice.py }
weight: 1
---

make_invoice.py sets the table column order with table_direction or w:bidiVisual.
