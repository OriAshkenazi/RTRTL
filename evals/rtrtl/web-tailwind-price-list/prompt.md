---
tags: [web]
max_turns: 25
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write PriceList.jsx, a React component styled with Tailwind CSS v4, for our Hebrew shop (the page already has `<html lang="he" dir="rtl">`). It gets `items` as `[{ name, price, discount }]` with prices in shekels as numbers; some names are English brand names like "AirPods Pro". Each row shows the name, the price formatted with `Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' })`, the discount as a negative amount when there is one, and a "הוסף לסל" button, with horizontal spacing between them. Under the rows show the total after discounts.
