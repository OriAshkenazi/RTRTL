---
tags: [web]
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write CommentsList.jsx, a React component for our Hebrew site (the page is `dir="rtl"`). It renders `comments`, an array of `{ id, author, text }` written by users; a comment can be in Hebrew, English or Arabic, and authors' names can be in any script. Show the author's name above each comment's text. Also add a fixed English badge "Beta" next to the Hebrew title "תגובות".
