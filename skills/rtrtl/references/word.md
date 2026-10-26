# Word / DOCX and document libraries

Set paragraph RTL and paragraph alignment as separate properties when creating the paragraph. In WordprocessingML:

```xml
<w:pPr><w:bidi/><w:jc w:val="start"/></w:pPr>
```

Use native Hebrew runs, appropriate `w:lang`, and complex-script fonts (`w:rFonts/@w:cs`) alongside Latin fonts. Apply `w:rtl` selectively to Hebrew runs where needed; do not force an English identifier into an RTL override. Handle tables' visual direction (`w:bidiVisual`) only when the intended column order calls for it; a right-aligned paragraph inside a cell does not reverse the table.

Formatting has complex-script twins: set `w:bCs`, `w:iCs` and `w:szCs` next to `w:b`, `w:i` and `w:sz`, because the plain ones apply only to non-complex-script characters, and Hebrew is complex script (ECMA-376 Part 1, 17.3.2; not rendered here). In python-docx 1.2, `font.cs_bold` and `font.cs_italic` write `w:bCs`/`w:iCs`; `font.size` writes only `w:sz`, so add `w:szCs` through OXML.

Paragraph `w:bidi` does not make the page RTL. Add `w:bidi` to the section's `w:sectPr` too; it lays out the section right to left, including column order (17.6.1). Headers and footers are separate parts (17.10), so their paragraphs need the same `w:bidi`, fonts and `w:lang` as the body.

In python-docx, `table.table_direction = WD_TABLE_DIRECTION.RTL` writes `w:bidiVisual`, which lays the cells out right to left (17.4.1; [python-docx source](https://github.com/python-openxml/python-docx/blob/master/src/docx/table.py)). Keep cell data in logical order; never reverse rows to fake column order. A merged cell, such as a totals label spanning two columns, is easy to place on the wrong side; this was not rendered here, so check where it lands in the actual export.

With python-docx, the fixture demonstrates creating `w:bidi` via OOXML, setting `w:jc="start"`, `run.font.rtl` and explicit font slots. Do not copy `WD_ALIGN_PARAGRAPH.RIGHT` blindly: in the tested Word 16 export, `right` under bidi aligned physically left, while `left` and `start` aligned physically right. A five-value alignment experiment reproduced this. Microsoft also documents a historical Word-specific interpretation; [that note](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oe376/26ecf09a-0f0b-4574-9907-ebd1ddf3015f) explicitly concerns Office 2007, so the current-version observation rests on the new experiment. Treat package-level checks as structural evidence. Open/export through the intended Word version or the task's document renderer and inspect the result; other Word/Google Docs renderers were not tested here.

[Primary API reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.bidi?view=openxml-3.0.1). Use installed APIs or browse only if the actual version/behavior is unresolved.
