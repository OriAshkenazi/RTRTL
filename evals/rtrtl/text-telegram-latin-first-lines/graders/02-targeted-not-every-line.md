---
type: llm
focus: {source: file, path: summary.py}
weight: 1
---

summary.py now adds a U+200F RIGHT-TO-LEFT MARK to deal lines that begin with a Latin product name, and the change is targeted: it adds no mark to lines that already start with Hebrew (such as the מטען line or the "מבצעי היום" heading), to the English "Questions? Reply in English or Hebrew." line, or inside the SALE-2026 pre entity, and no RLM/LRM around the ₪ prices or numbers. An unchanged summary.py fails this check.
