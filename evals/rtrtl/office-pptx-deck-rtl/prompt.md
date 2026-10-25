---
tags: [office, powerpoint]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Using pptxgenjs, write one script, make_deck.js, that builds q3.pptx: a Hebrew deck for our quarterly review. Slide 1 is the title "סיכום רבעון 3". Slide 2 is a table with the columns רבעון, הכנסות, הוצאות for Q1–Q3 (120, 135, 150 and 90, 95, 101, in thousands of ₪), with רבעון as the rightmost column. Slide 3 is a bar chart of revenue by quarter with Q1 on the right. Every slide has Hebrew speaker notes. Keep everything, including any post-processing, inside make_deck.js. Run it and tell me anything you could not check.
