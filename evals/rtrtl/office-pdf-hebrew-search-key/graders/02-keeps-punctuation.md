---
type: llm
focus: { source: file, path: search_key.py }
weight: 1
---

search_key.py removes only combining marks (for example with unicodedata.combining(), category Mn, or explicit ranges that skip U+05BE, U+05C0, U+05C3 and U+05C6). A blanket range such as \u0591-\u05C7 that also deletes maqaf, paseq or sof pasuq fails this statement.
