# PowerPoint / PPTX and slide-generation tools

Use a native editable paragraph with `a:pPr rtl="1" algn="r"`, language metadata and suitable Latin/complex-script faces. Keep English/code runs LTR in logical source order. If the library lacks paragraph-direction support, use a documented OOXML adapter after writing the file and validate the package. Never assume `align:'right'` supplies paragraph RTL.

Inspect the actual PowerPoint export. One historical preview laid out word segments with increasing X coordinates and ignored paragraph direction, while the user confirmed native PowerPoint worked. That result is tied to that renderer/version. Do not reverse stored words, discard punctuation or create a textbox for every word to satisfy a faulty preview. The current fixture generator writes native metadata; live PowerPoint export is still required for a new production deck.

[Primary API reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.textparagraphpropertiestype.righttoleft?view=openxml-3.0.1). Use installed APIs or browse only if the actual version/behavior is unresolved.
