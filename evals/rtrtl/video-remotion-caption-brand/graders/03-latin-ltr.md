---
type: llm
focus: trace
weight: 1
---

In HebrewCaption.tsx, Acme and Cloud display as one LTR phrase: either a single LTR scope (dir="ltr" or <bdi>) wraps both words together, or neither word has a dir or <bdi> of its own. Acme and Cloud are not each given a separate LTR scope, and the Hebrew word spans do not each carry dir="rtl".
