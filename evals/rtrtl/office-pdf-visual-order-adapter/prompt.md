---
tags: [office, pdf]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Our receipts are drawn by an old PDF library that places glyphs left to right in the order it is given and has no bidi support; we can't replace it this quarter. Write visual_lines.py with python-bidi 0.6: a function visual_lines(text, max_chars) that takes one logical Hebrew paragraph and returns the strings to draw, one per line, top to bottom. Try it on "הבדיקה הושלמה (QA-17) בהצלחה והתוצאה נשמרה בתיק הלקוח." with max_chars=20 and print the result.
