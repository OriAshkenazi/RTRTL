---
tags: [office, word]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write make_invoice.py with python-docx that creates invoice.docx, a Hebrew invoice: a bold 16pt heading "חשבונית מס 2041", the line "לקוח: סטודיו גל", a page header with our company name "אורן הנדסה בע״מ" and a footer "תודה על שיתוף הפעולה". Then a table with the columns פריט, כמות, מחיר, where פריט is the rightmost column as a Hebrew reader expects. Two item rows (ייעוץ, 3, ₪ 900.00 and שרטוט, 1, ₪ 350.00), then a totals row where "סה״כ" spans the פריט and כמות cells, followed by ₪ 1,250.00. Run it, and tell me anything you could not check.
