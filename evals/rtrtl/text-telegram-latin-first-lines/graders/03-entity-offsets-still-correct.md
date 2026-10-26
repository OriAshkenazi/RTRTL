---
type: llm
focus: {source: file, path: summary.py}
weight: 1
---

summary.py now adds a U+200F RIGHT-TO-LEFT MARK to Latin-first deal lines, and every bold entity still starts exactly at its product name and the pre entity still covers exactly "SALE-2026": the mark is inserted before the offsets are computed (or the offsets count it as one UTF-16 code unit) and before split() runs. An unchanged summary.py, or a mark added after build() returns without shifting the offsets, fails this check.
