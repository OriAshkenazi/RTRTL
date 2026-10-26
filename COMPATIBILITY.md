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
| WeasyPrint 69.0 (conda-forge, macOS), 25 October 2026 | Logical Hebrew with a `<bdi dir="ltr">` code, brackets and `₪ 1,250.00` rendered in the intended order (PyMuPDF raster inspected). `HTML(string=...)` with `base_url` embedded the local Noto Sans Hebrew. Without `base_url` it embedded Arial and Verdana, exit code 0 and no warning (pypdf font list) | One short paragraph; no wrapping, tables or other fonts. |
| python-bidi 0.6.12, 25 October 2026 | `bidi.get_display` returned `)QA-17(` and `א)א`; `bidi.algorithm.get_display` returned `(QA-17)` and `א(א` | Library output only; no PDF was drawn from it. |
| python-docx 1.2.0, python-pptx 1.0.2, pptxgenjs 4.0.1, 25 October 2026 | Generated package XML inspected: `w:bCs`/`w:szCs`, `w:sectPr/w:bidi`, header/footer `w:bidi`, `w:bidiVisual`; pptxgenjs `rtl="1"`, `lang="he-IL"`, `p:presentation rtl="1"`, empty `<a:tblPr/>`, notes `en-US` with no `rtl`, `c:orientation maxMin` (also from python-pptx `reverse_order`) | Structure only. Not opened or rendered in Word, PowerPoint or LibreOffice. |
| ffmpeg 9.0.2 + libass 0.17.5 (macOS, 25 October 2026) | Burned-in Hebrew karaoke line: `Encoding=-1` gave correct word and letter order with `Spacing` 0 or 1; `Encoding=1` reversed the karaoke word order, and with `Spacing=1` the letters too. See [Burned-in captions](#burned-in-captions) | One font (Arial), one line, ffmpeg's `subtitles` filter. Players, VSFilter and other libass versions were not tested. |
| LaTeX, plots, canvas, subtitles, other native UI | Guidance provided | No live renderer qualification in this run. |

Separate four kinds of evidence: canonical source/structure, visible layout and fonts, interaction, and actual search/copy. One cannot substitute for the others. Editing round trips and assistive technologies need their own checks when required.

## Sharing metadata

A WhatsApp link-preview screenshot exposed misplaced punctuation in a Hebrew title prefixed by the Latin brand. The Hebrew page now serves a Hebrew-only title and descriptions, with brand and locale in separate Open Graph fields and matching title fallback metadata. Static regression checks catch the previous LTR-first title. Browser simulations do not verify WhatsApp: a fresh card in that app, its caching behavior, and other social consumers remain unverified. The screenshot establishes the original failure only; no WhatsApp version was supplied. Direct `/he/` links carry Hebrew metadata without requiring JavaScript; the default English page serves English metadata to non-JavaScript crawlers.

## Directional controls

A focused browser check on 19 October 2026 exercised the synthetic previous/next control at 1280×900 and 390×844. Previous appeared physically right with a right-pointing arrow; next appeared left with a left-pointing arrow. Visible arrow pixels, accessible button names, enabled clicks, keyboard progression and disabled endpoint states were checked. Swapped-glyph and ancestor-scale negative controls exposed the intended failures. This is the fixture’s reading-order convention, not a universal rule for RTL controls or physical directions.

These interactions and negative controls were exercised through the Codex in-app browser. The bundled `--checks arrows` CLI path was syntax checked but was not launched end to end in this session. It saves cropped navigation screenshots and separate results without font inspection or PDF export. Other icon libraries, SVGs, native mirroring and exports still require checks in their actual consumer. See [arrow direction](skills/rtrtl/references/arrows.md).

## Line breaks

On 23 October 2026, `check_browser.cjs --checks lines` ran on macOS 27.0.1 in Chrome 155.0.8059.85 and in Playwright's WebKit 27.2 (build 2370), using the synthetic HTML fixture with Arial requested. Chrome's font inspection reported ArialMT for the Hebrew line cases; WebKit's actual font was not inspected. The good forms of the three Hebrew line cases and the 13-case corpus passed at 1280px, and in mobile emulation at 320px and 412px, each with normal and 150% root text (19 checks per engine). A scratch copy with the bad forms swapped in failed in both engines: the status row split `12` from `מ״ב` and left `·` off the line of its neighbours at 320px and 412px; the count `· 4` sat between the lines of a wrapping button name at every width; the centred error line with a long email overflowed at 320px and at 412px with large text. The first run also found the corpus's `-12.50 mm` and `1,234.50 m³` splitting at 320px with large text; the HTML fixture now keeps short quantities on one line without changing the canonical text.

This is Hebrew only, in two desktop engines' viewport emulation, not physical phones, OS text-size settings, Arabic or other renderers. The check covers numbers and spaced separators, not other stranded punctuation.

## Burned-in captions

On 25 October 2026, on macOS 27.0.1, Homebrew's keg-only `ffmpeg-full` 9.0.2 (libass 0.17.5, `--enable-libass --enable-libharfbuzz`, no `--enable-libfribidi`) burned one synthetic Hebrew line, `ברוכים הבאים ל־RTRTL גרסה 2.5 היום.`, in logical order with a `\k40` karaoke tag on each word and Arial 64. The default Homebrew `ffmpeg` 9.0.2 had no `subtitles` or `drawtext` filter. Each style was burned with `subtitles=…:fontsdir=…` onto a plain clip, once with karaoke tags and once without, and a frame at 1.1 s was read:

| Style | Karaoke line | Plain line |
| --- | --- | --- |
| `Encoding=1`, `Spacing=1` | Letters and words reversed; highlight from the left | Letters and words reversed |
| `Encoding=1`, `Spacing=0` | Words in reversed order, letters intact; highlight from the left | Hebrew phrases placed left to right around `RTRTL`; full stop misplaced |
| `Encoding=-1`, `Spacing=0` | Correct; highlight from the right | Correct |
| `Encoding=-1`, `Spacing=1` | Correct; highlight from the right | Correct |

This matches libass's source: any `Encoding` other than `-1` sets a left-to-right base direction and leaves whole-line layout off, and each run, or each glyph when `Spacing` is non-zero, is then reordered on its own. A pointed line under `shaping=simple` and `shaping=complex` kept the same word order; the pixels differed only in niqqud placement. `drawtext` in the same build, without FriBidi, drew the Hebrew letter-reversed.

Pillow 13.0.0 from its macOS wheel drew the same line letter-reversed with the basic layout. RAQM was unavailable (requesting it warned and fell back to basic) until Homebrew's `libfribidi` 1.0.17 was on the library path; RAQM then drew it correctly.

A HyperFrames 0.8.197 check of `dir="rtl"` on `<html>` versus on the composition root was attempted: its `snapshot` frames were correct in both, and `render` failed on this machine for every variant with an unrelated browser-session error, so no rendered-video claim is made. Remotion was not run.

### Caption tokens

The same day, Chrome 152.0.7977.167 (the Claude desktop app's built-in browser) rendered `ברוכים הבאים ל־Acme Cloud בגרסה 3` as one `dir="rtl"` line of inline word spans four ways. Spans with no `dir`, and one `<bdi dir="ltr">` around both `Acme` and `Cloud`, displayed `Acme Cloud`. `dir="ltr"` on the `Cloud` span alone, or separate LTR scopes on `Acme` and `Cloud`, displayed `Cloud Acme`. One phrase, one browser.

## Website languages and responsive layout

The website has English, Hebrew and Arabic editions at `rtrtl.org`. Interactive translations live in one `docs/assets/i18n.js` catalog and all editions share the same UI script. Page text, direction and sharing metadata remain in localized static HTML. Arabic installation prompts request an Arabic compatibility check; this translation does not certify the skill's other renderers for Arabic.

On 19 October 2026, the Codex in-app browser checked all three editions at 320×760, 360×800, 390×844, 430×932, 844×390 and 1280×900: 18 viewport/language combinations. The check found English header overflow at 320px and 390px. After simplifying narrow-screen navigation, no page or header horizontal overflow remained in that matrix. Compact picker bounds, keyboard dismissal, language switching, saved Arabic preference, demo direction changes and translated copy feedback were exercised. Actual Arabic paragraph glyphs were reported as the bundled Noto Sans Arabic font through browser font inspection.

These are desktop-browser viewport simulations, not tests on physical iOS/Android devices or certification of other browser engines. The existing Office/PDF results remain Hebrew-specific. CI checks translation-key parity, initial/dynamic demo-note consistency, reciprocal three-language links, metadata domains, all agent prompt variants and 17 local language-routing cases without geolocation or network APIs.

## Efficiency

The authoring core uses progressive disclosure: ordinary replies need no tools; an artifact normally needs one adapter. Earlier local optimization reduced an equivalent core from roughly 1,524 to 679 `o200k_base` tokens. These are local tokenizer estimates, not billed model usage or a guarantee of savings; release edits can change the count. Sixteen local execution probes checked format selection, conditional dependencies and rejection of unsupported manifest-only checking. Public CI checks packaging, installation and HTML fixture generation; it does not run Office or certify native rendering.

## Reproduce

Follow [reproducible-checks.md](skills/rtrtl/references/reproducible-checks.md), selecting the target consumer only. Keep fresh run evidence outside the installed skill/repository. Record versions, fonts, selected formats and outcomes. For a proposed new stack, use [the contribution guide](CONTRIBUTING.md).
