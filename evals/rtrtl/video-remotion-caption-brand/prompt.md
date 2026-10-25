---
tags: [video, web, remotion]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write a Remotion component, HebrewCaption.tsx, for a 1080×1920 video: one caption line at the bottom, the active word highlighted as it's spoken. Words with start/end frames:

[{"text":"ברוכים","start":0,"end":14},{"text":"הבאים","start":14,"end":27},{"text":"ל־Acme","start":27,"end":40},{"text":"Cloud","start":40,"end":52},{"text":"בגרסה","start":52,"end":66},{"text":"3","start":66,"end":80}]

Just write the file; no need to install or render.
