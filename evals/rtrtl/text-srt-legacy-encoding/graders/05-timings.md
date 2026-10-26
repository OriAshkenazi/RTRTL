---
type: regex
pattern: "^\uFEFF?1\\r?\\n00:00:01,200 --> 00:00:03,800\\r?\\nשלום, אני דנה\\.\\r?\\n\\r?\\n2\\r?\\n00:00:04,100 --> 00:00:07,500\\r?\\n"
target: {source: file, path: movie.he.srt}
---

movie.he.srt keeps its cue numbers and timings, and its first cue text, unchanged (an optional UTF-8 BOM aside).
