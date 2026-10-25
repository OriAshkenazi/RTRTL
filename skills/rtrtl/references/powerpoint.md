# PowerPoint / PPTX and slide-generation tools

Use a native editable paragraph with `a:pPr rtl="1" algn="r"`, language metadata and suitable Latin/complex-script faces. Keep English/code runs LTR in logical source order. If the library lacks paragraph-direction support, use a documented OOXML adapter after writing the file and validate the package. Never assume `align:'right'` supplies paragraph RTL.

pptxgenjs 4.0.1 (checked in its source and generated XML): `rtlMode: true` on text writes `a:pPr rtl="1"`, `lang: 'he-IL'` writes `a:rPr lang` (the default is `en-US`), `pres.rtlMode = true` writes `p:presentation rtl="1"`, and `fontFace` fills `latin`, `ea` and `cs` alike. Tables always get an empty `<a:tblPr/>`, even with `rtlMode`, and `addNotes` writes one `en-US` run with no paragraph direction. Both need an OOXML fix after writing.

Every text body is separate. Table column order is `rtl="1"` on `a:tblPr`, apart from the cells' paragraph RTL; add the attribute to the existing `a:tblPr`, or insert `a:tblPr` as `a:tbl`'s first child, and never reverse the row data. Speaker notes live in their own notes slide and need paragraph RTL and `lang` too. For layouts and masters, put the default in `a:lstStyle/a:lvl1pPr rtl="1"` (and the other levels used). `a:bodyPr rtlCol` sets the order of text columns, not text direction (ECMA-376 Part 1, DrawingML `bodyPr`).

For charts, put the first category on the right with the axis setting, not by reversing data: python-pptx `category_axis.reverse_order = True` and pptxgenjs `catAxisOrientation: 'maxMin'` both write `c:orientation val="maxMin"`. pptxgenjs's `catAxisLabelFontFace` writes only `a:latin`, so Hebrew tick labels take their font elsewhere; set a Hebrew-capable complex-script font explicitly. Chart rendering was not tested here.

Inspect the actual PowerPoint export. One historical preview laid out word segments with increasing X coordinates and ignored paragraph direction, while the user confirmed native PowerPoint worked. That result is tied to that renderer/version. Do not reverse stored words, discard punctuation or create a textbox for every word to satisfy a faulty preview. The current fixture generator writes native metadata; live PowerPoint export is still required for a new production deck.

[Primary API reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.textparagraphpropertiestype.righttoleft?view=openxml-3.0.1). Use installed APIs or browse only if the actual version/behavior is unresolved.
