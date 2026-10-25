---
type: regex
pattern: '\.reverse\(|toReversed|\[::-1\]'
match: not_contains
target: { source: file, path: make_deck.js }
weight: 1
---

make_deck.js does not reverse the table rows or chart data.
