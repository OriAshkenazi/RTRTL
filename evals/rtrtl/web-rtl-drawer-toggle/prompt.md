---
tags: [web]
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Build a small Hebrew settings page in React (Settings.jsx plus settings.css, plain CSS, no Tailwind). The page is `<html lang="he" dir="rtl">`. It needs: a "דלג לתוכן" skip link that appears only on keyboard focus; a menu button that opens a navigation drawer sliding in from the side where Hebrew text starts, built with Radix UI's Dialog (which portals to body), with a CSS slide transition; a custom dark-mode switch whose round thumb slides across its track when turned on; and a settings card with a soft drop shadow.
