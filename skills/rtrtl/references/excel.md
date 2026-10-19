# Excel / XLSX and spreadsheet libraries

Set worksheet-view direction independently from cells. For openpyxl:

```python
ws.sheet_view.rightToLeft = True
hebrew_cell.alignment = Alignment(horizontal="right", readingOrder=2, wrap_text=True)
code_cell.alignment = Alignment(horizontal="left", readingOrder=1)
```

Keep quantities numeric and use number formats. `readingOrder=2` means RTL and `1` means LTR; it is not a formula transformation. It does not isolate an English phrase, date/time pair or signed number inside a mixed cell. Prefer separate typed columns for number/unit/date/code. For required mixed prose, use a display-only compatibility adapter that was actually tested in the target Excel version. **The tested Excel 16 PDF export displayed LRI/PDI as visible control boxes.** They are not the default Excel recipe. The supplied fixture uses LRM `U+200E` immediately before and after complete known LTR units in the display column, while keeping untouched source text on a hidden `canonical` sheet. LRM is a local directional mark, not a Unicode isolate; verify its narrower semantics with the actual corpus. Do not propagate those marks to IDs, URLs, formulas or exported source values. Check sheet column order, mixed text, row heights, print area, clipping and actual Excel/PDF export. CSV cannot carry worksheet/cell direction settings.

If the display, copy, or export check fails for the actual corpus, use separate typed fields or retain clean canonical values with an explicit limitation. Do not keep adding invisible marks until one preview looks correct.

[Primary API reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.sheetview.righttoleft?view=openxml-3.0.1). Use installed APIs or browse only if the actual version/behavior is unresolved.
