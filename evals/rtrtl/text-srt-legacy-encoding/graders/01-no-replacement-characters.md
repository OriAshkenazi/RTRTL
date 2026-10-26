---
type: regex
pattern: "�|¤"
match: not_contains
target: {source: file, path: movie.he.srt}
---

movie.he.srt has no U+FFFD replacement character and no "¤" (what 0xA4 becomes when the file is read as ISO-8859-8 instead of Windows-1255).
