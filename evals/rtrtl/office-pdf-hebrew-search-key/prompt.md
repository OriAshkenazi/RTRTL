---
tags: [office, pdf]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

We extract Hebrew text from PDFs of prayer books and court rulings and need search that ignores vowel points and final-letter forms. Write search_key.py with a function matches(query, text) so that "שלום" finds "שָׁלוֹם", and a query typed with a regular letter where a final one belongs ("שלומ") finds "שלום". The extracted text we store must stay exactly as extracted. Add a few asserts at the bottom and run the file.
