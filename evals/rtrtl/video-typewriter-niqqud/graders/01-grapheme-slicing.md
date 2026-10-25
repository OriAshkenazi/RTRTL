---
type: llm
focus: trace
weight: 1
---

Typewriter.tsx slices the text by grapheme clusters (for example Intl.Segmenter with granularity "grapheme"), not with text.slice(0, n), substring or Array.from/[...text] code points.
