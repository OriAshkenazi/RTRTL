# Targeted qualification and regression checks

Use this workflow for an unfamiliar renderer/font/export, a reported regression or an explicit test request. Ordinary authoring uses the target adapter and verification of the actual deliverable. These are synthetic fixtures, not production templates.

Resolve only the needed runtime once; reuse its path. Set `$rtlSkill`, `$rtlEvidence`, `$rtlPython`, `$rtlNode`, `$rtlModules`, `$rtlPdfRenderer` as applicable. Use a fresh scratch directory. Do not install dependencies or launch applications to validate unrelated formats.

## Select before generating

```powershell
# HTML only; Python standard library suffices. This is also the default.
& $rtlPython "$rtlSkill/scripts/build_fixtures.py" --out $rtlEvidence --formats html
# Editable Word and its export path:
& $rtlPython "$rtlSkill/scripts/build_fixtures.py" --out $rtlEvidence --formats docx
# WPF needs only the common text manifest:
& $rtlPython "$rtlSkill/scripts/build_fixtures.py" --out $rtlEvidence --formats manifest
```

The corpus has 13 semantic cases. Generate several formats only for an actual cross-renderer request: `--formats html docx pptx xlsx`. Defaults use Word logical `start` and Excel display-only `lrm`, retaining clean canonical values. `--font Arial` is a tested local choice, not a production requirement. ZIP timestamps can differ across equivalent runs; record each run's hashes.

Conditional dependencies: `python-docx` for DOCX generation, `python-pptx` for PPTX, `openpyxl` for XLSX, Node `playwright` plus an available browser for web, installed Windows Office for the selected native export, Windows PowerShell/WPF for native text, and `pypdf` only for PDF checks. These helpers do not require ReportLab.

## Exercise only the selected consumer

Web:

```powershell
& $rtlNode "$rtlSkill/scripts/check_browser.cjs" --input $rtlEvidence --modules $rtlModules --channel chrome
```

This uses an isolated local profile and prints a compact summary, saving desktop/phone screenshots, PDF and font/geometry evidence. Inspect screenshots and the exported page; glyph checks alone cannot establish overall appearance. Its PDF qualifies the export path; do not print extra PDFs for every HTML edit.

For navigation-arrow behavior only, reuse an HTML fixture and run the targeted mode:

```powershell
& $rtlNode "$rtlSkill/scripts/check_browser.cjs" --input $rtlEvidence --modules $rtlModules --channel chrome --checks arrows
```

This checks previous/next physical positions, accessible names, visible Unicode glyphs, transform/scale/rotate/translate and writing-mode properties through the document root, enabled click actions, keyboard actions, and disabled endpoint state plus boundary-key behavior at desktop and phone widths. It does not simulate pointer clicks on disabled buttons. It writes `arrows-results.json` and arrow screenshots only; it skips corpus, font inspection, and PDF checks. The report records the actual fixture hash separately from the manifest hash, so intentional scratch controls remain identifiable. Inspect both screenshots for actual glyph pixels. For a negative control, copy the fixture directory to a scratch directory, swap the two arrow glyphs in its `fixture.html` without changing `build_fixtures.py`, and rerun this mode there; it should fail the glyph assertions. Do not alter the source fixture.

Office (choose only the relevant `docx`, `pptx` or `xlsx`):

```powershell
& "$rtlSkill/scripts/export_native_office.ps1" -InputDirectory $rtlEvidence -Format docx
& $rtlPdfRenderer -scale-to 1500 -png "$rtlEvidence/word.pdf" "$rtlEvidence/pdf-word"
```

The exporter checks the fixture hash, opens it read-only, restores automation security, closes its document and quits only when no other documents remain in that instance. A co-located hash checks consistency, not authenticity: use only trusted, locally generated fixtures. Run one format at a time. COM calls are synchronous and have no internal timeout; after a bounded startup stall (e.g. 90 seconds), inspect one diagnostic state or interrupt. Interruption may leave an Office instance open; identify its test document before cleanup. Do not launch overlapping retries or close unidentified processes. Follow normal environment permissions; do not bypass denied routes. Inspect every relevant exported page; a two-slide PPTX has two pages.

WPF:

```powershell
powershell.exe -NoProfile -STA -File "$rtlSkill/scripts/render_wpf.ps1" -InputDirectory $rtlEvidence
```

Inspect `wpf.png`. This is offscreen text, not a Revit/ribbon/dialog test; it does not change a model.

Source/structure and existing exports:

```powershell
& $rtlPython "$rtlSkill/scripts/check_artifacts.py" --input $rtlEvidence
```

The checker follows selected formats in the manifest and only their existing named PDFs, with conditional imports. It ignores unrelated stale artifacts. Manifest-only WPF uses its own renderer. Exact extraction failures remain separate from passing structure checks. Test actual PDF viewer Find/copy when required; extraction does not establish those behaviors.

Read compact summaries first. On failure inspect only the relevant case/log/page, not every JSON geometry dump or script. Reuse unchanged evidence; rerun affected surfaces after a relevant change. Preserve stronger checks required by the deliverable's own skill.

## Negative controls

Use separate directories and export only the affected format:

```powershell
& $rtlPython "$rtlSkill/scripts/build_fixtures.py" --out "$rtlEvidence/word-control" --formats docx --word-alignment right
& $rtlPython "$rtlSkill/scripts/build_fixtures.py" --out "$rtlEvidence/excel-control" --formats xlsx --excel-display isolate
```

Tested Word 16: bidi + `right` aligned physically left; `start` corrected it. Tested Excel 16: LRI/PDI printed visible placeholders; display-only LRM corrected the corpus while preserving source. `--excel-display plain` reproduces mixed signed-value/date-time ordering issues. For WPF, changing a scratch copy to `TextAlignment=Right` in the same RTL context reproduced physical left alignment. Web includes a right-aligned LTR control. These results do not certify all versions.

Report named renderer/version, affected pages/viewports, source hashes when durable evidence matters, results and material limits. Do not infer broad compatibility or editing/search success from a small visual sample.
