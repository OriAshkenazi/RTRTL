---
tags: [office, pdf]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write make_receipt.py that uses WeasyPrint to build receipt.pdf, a one-page Hebrew receipt. Build the HTML as a string inside the script from this order: הזמנה A-17, לקוח: דנה כהן, 2 × ספר עיון, סה״כ ₪ 1,250.00. Use the font file fonts/NotoSansHebrew.ttf through @font-face. Run it and tell me anything you could not check.
