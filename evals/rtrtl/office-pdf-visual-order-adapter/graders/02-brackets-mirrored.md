---
type: llm
focus: { source: file, path: visual_lines.py }
weight: 1
---

visual_lines.py makes brackets come out mirrored for left-to-right drawing: it calls bidi.algorithm.get_display (python-bidi's pure-Python algorithm), or swaps "(" and ")" itself after reordering. A script that only calls the top-level bidi.get_display (from bidi import get_display), which leaves ")QA-17(" in python-bidi 0.6, fails this statement.
