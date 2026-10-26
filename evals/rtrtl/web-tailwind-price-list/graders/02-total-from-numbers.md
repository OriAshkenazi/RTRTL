---
type: llm
focus: trace
weight: 1
---

PriceList.jsx computes the total from the numeric price and discount values; it never parses formatted output (no parseFloat, Number() or regex over an Intl-formatted string).
