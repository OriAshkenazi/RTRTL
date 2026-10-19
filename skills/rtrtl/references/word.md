# Word / DOCX and document libraries

Set paragraph RTL and paragraph alignment as separate properties when creating the paragraph. In WordprocessingML:

```xml
<w:pPr><w:bidi/><w:jc w:val="start"/></w:pPr>
```

Use native Hebrew runs, appropriate `w:lang`, and complex-script fonts (`w:rFonts/@w:cs`) alongside Latin fonts. Apply `w:rtl` selectively to Hebrew runs where needed; do not force an English identifier into an RTL override. Handle tables' visual direction (`w:bidiVisual`) only when the intended column order calls for it; a right-aligned paragraph inside a cell does not reverse the table.

With python-docx, the fixture demonstrates creating `w:bidi` via OOXML, setting `w:jc="start"`, `run.font.rtl` and explicit font slots. Do not copy `WD_ALIGN_PARAGRAPH.RIGHT` blindly: in the tested Word 16 export, `right` under bidi aligned physically left, while `left` and `start` aligned physically right. A five-value alignment experiment reproduced this. Microsoft also documents a historical Word-specific interpretation; [that note](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oe376/26ecf09a-0f0b-4574-9907-ebd1ddf3015f) explicitly concerns Office 2007, so the current-version observation rests on the new experiment. Treat package-level checks as structural evidence. Open/export through the intended Word version or the task's document renderer and inspect the result; other Word/Google Docs renderers were not tested here.

[Primary API reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.bidi?view=openxml-3.0.1). Use installed APIs or browse only if the actual version/behavior is unresolved.
