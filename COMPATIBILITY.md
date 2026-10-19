# Compatibility and evidence boundaries

RTRTL supplies portable authoring principles and format-specific guidance. The following observations come from a 13-case synthetic qualification run on Windows, 19 October 2026. They are environment-bound observations, not certification of every library or version. The reproducible corpus ships in `skills/rtrtl/scripts/build_fixtures.py`; regenerate it in your target environment to qualify your output. Original local artifacts are not distributed. Regenerated source hashes will differ from the original run after neutral example labels change.

| Consumer | Tested path and result | Limit |
| --- | --- | --- |
| Chrome 154.0.8037.98 | Explicit RTL, scoped LTR runs, logical CSS; 75 structural/font/interaction checks at 1280×900 and 390×844 passed; browser PDF inspected visually | Original corpus used Arial; the website uses separately checked Geist/Noto Sans Hebrew. Other browsers need qualification. |
| Word 16 / executable 16.0.20430.20182 | Native export visually checked: `w:bidi` + logical `w:jc="start"` produced the intended right leading edge | `jc="right"` in the tested bidi context put text physically left. Do not generalize an enum name without checking rendering. |
| PowerPoint 16 | Native export of two editable slides checked with `a:pPr rtl="1" algn="r"` | A preview can ignore native metadata. Native export does not certify every slide previewer. |
| Excel 16 | RTL sheet/cells plus display-only LRM around complete LTR units corrected the tested corpus; canonical text retained separately | LRI/PDI exported as visible control boxes. Reading order alone misordered some signed values/dates. LRM is corpus-dependent; prefer separate typed columns. |
| WPF, offscreen | Native RTL spans and `TextAlignment.Left` produced the intended right leading edge in the tested context | Offscreen text only; no claim about Revit ribbons, dialogs or every WPF layout. |
| PDF exports | Inspected native/browser output and embedded font resources | Exact `pypdf` recovery: Chrome 0/13, Word 6/13, PowerPoint 13/13, Excel 13/13. Exact matching includes spacing and punctuation. This is not a PDF viewer Find/copy test. |
| LaTeX, plots, canvas, subtitles, other native UI | Guidance provided | No live renderer qualification in this run. |

Separate four kinds of evidence: canonical source/structure, visible layout and fonts, interaction, and actual search/copy. One cannot substitute for the others. Editing round trips and assistive technologies need their own checks when required.

## Sharing metadata

A WhatsApp link-preview screenshot exposed misplaced punctuation in a Hebrew title prefixed by the Latin brand. The Hebrew page now serves a Hebrew-only title and descriptions, with brand and locale in separate Open Graph fields and matching title fallback metadata. Static regression checks catch the previous LTR-first title. Browser simulations do not verify WhatsApp: a fresh card in that app, its caching behavior, and other social consumers remain unverified. The screenshot establishes the original failure only; no WhatsApp version was supplied. Direct `/he/` links carry Hebrew metadata without requiring JavaScript; the default English page serves English metadata to non-JavaScript crawlers.

## Directional controls

A focused browser check on 19 October 2026 exercised the synthetic previous/next control at 1280×900 and 390×844. Previous appeared physically right with a right-pointing arrow; next appeared left with a left-pointing arrow. Visible arrow pixels, accessible button names, enabled clicks, keyboard progression and disabled endpoint states were checked. Swapped-glyph and ancestor-scale negative controls exposed the intended failures. This is the fixture’s reading-order convention, not a universal rule for RTL controls or physical directions.

These interactions and negative controls were exercised through the Codex in-app browser. The bundled `--checks arrows` CLI path was syntax checked but was not launched end to end in this session. It saves cropped navigation screenshots and separate results without font inspection or PDF export. Other icon libraries, SVGs, native mirroring and exports still require checks in their actual consumer. See [arrow direction](skills/rtrtl/references/arrows.md).

## Efficiency

The authoring core uses progressive disclosure: ordinary replies need no tools; an artifact normally needs one adapter. Earlier local optimization reduced an equivalent core from roughly 1,524 to 679 `o200k_base` tokens. These are local tokenizer estimates, not billed model usage or a guarantee of savings; release edits can change the count. Sixteen local execution probes checked format selection, conditional dependencies and rejection of unsupported manifest-only checking. Public CI checks packaging, installation and HTML fixture generation; it does not run Office or certify native rendering.

## Reproduce

Follow [reproducible-checks.md](skills/rtrtl/references/reproducible-checks.md), selecting the target consumer only. Keep fresh run evidence outside the installed skill/repository. Record versions, fonts, selected formats and outcomes. For a proposed new stack, use [the contribution guide](CONTRIBUTING.md).
