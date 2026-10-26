---
type: llm
focus: { source: file, path: make_deck.js }
weight: 1
---

make_deck.js makes the speaker notes right-to-left: it edits the notes slide XML (ppt/notesSlides/*.xml) so the notes paragraphs have rtl="1", since pptxgenjs addNotes writes no paragraph direction.
