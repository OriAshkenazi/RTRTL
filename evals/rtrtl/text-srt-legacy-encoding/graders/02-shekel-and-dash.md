---
type: regex
pattern: "הכרטיס עלה ₪150 – יותר ממה שחשבנו\\."
target: {source: file, path: movie.he.srt}
---

movie.he.srt, read as UTF-8, has the second cue with its shekel sign and en dash, which only a Windows-1255 decode keeps.
