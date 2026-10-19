---
name: rtrtl
description: Author readable Hebrew and mixed Hebrew/English text with correct RTL from the start. Use for Hebrew authoring or RTL repairs in the requested format.
---

# RTRTL

Apply correct direction while writing; preserve the requested format and editability.

## Core rules

- Keep canonical text in logical Unicode order with explicit UTF-8 at file/transport boundaries. Preserve punctuation and exact identifiers. Never reverse words/characters or split a sentence into word boxes to satisfy a faulty preview.
- Set known Hebrew paragraphs/headings to RTL, including English-first headings. Direction, physical alignment and font are separate. Keep whole LTR codes, signed quantities/units, dates, paths and English phrases in native directional scopes; surrounding sentence punctuation stays in the Hebrew scope.
- Prefer native runs/markup to hidden controls. Never put display-only controls into canonical IDs, URLs or data. Choose the actual consumer's supported adapter: Unicode isolates are not supported equally everywhere (notably the tested Excel export).
- Use the task's Hebrew-capable fonts/weights and complex-script faces. Keep code/formulas/axes LTR where required; do not mirror every graphic or control.
- For directional controls, follow the target's meaning and verify rendered arrows and interactions; do not mirror every arrow. Read [arrow direction](references/arrows.md) when controls, maps, diagrams or media are in scope.

## Spend effort where it changes the result

For an ordinary Hebrew reply/rewrite, apply the core rules directly. No artifact, reference lookup, runtime discovery or test suite is needed. Natural Hebrew paragraph starts help viewers that infer direction; chat/Markdown direction support is viewer-dependent.

For an artifact, read only its adapter when needed:
[web](references/web.md), [Word](references/word.md), [PowerPoint](references/powerpoint.md), [Excel](references/excel.md), [PDF](references/pdf.md), [graphics/plots](references/graphics.md), [native UI](references/native.md), [LaTeX](references/latex.md), [Markdown/plain text/subtitles](references/text.md).
For an established component, reuse its verified settings; inspect the relevant source rather than rediscovering all tools. Read a second adapter only for an actual second output or conversion boundary. Use installed APIs/official docs when a needed property or version is uncertain; do not browse routinely for every Hebrew task.

Implement direction/run/font/layout settings before rendering. Verify the real output in proportion to the change: inspect affected pixels, actual fonts and interactions; inspect requested exports separately. Preserve any stronger checks required by the deliverable's own skill. Do not generate extra formats, print PDFs, launch Office or rerun an unchanged full corpus just because Hebrew is present.

Use [reproducible checks](references/reproducible-checks.md) only to qualify an unfamiliar renderer/export/font, investigate a regression, or satisfy an explicit test request. Generate only selected formats; reuse unchanged fixture evidence. If inspection is blocked, report it and continue independent work; do not loop through speculative global patches or alternate denied routes.

Separate source/structure, visual, interaction and search/copy results. A readable PDF may fail exact extraction; extraction alone does not prove viewer Find/copy behavior. If a preview disagrees with the native application, preserve logical source and verify the target application. Report only material checks and remaining limits.
