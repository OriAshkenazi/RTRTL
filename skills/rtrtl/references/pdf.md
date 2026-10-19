# PDF, ReportLab and extraction

Choose a renderer with demonstrated bidi behavior for the selected version. Browser print of correctly authored HTML is a tested visual route here, but exact extraction/search remains a separate contract. Preserve an editable/logical companion source when useful.

Do not make a global `get_display()` preprocessing pipeline. A modern bidi engine expects logical text; pre-reordering can apply bidi twice. A legacy engine that draws glyphs in input order may need a tightly scoped visual-order adapter. Verify the installed engine first; apply the adapter once at that rendering boundary and preserve the original source independently. `drawRightString`, `TA_RIGHT`, `ha='right'` or a font do not themselves implement the bidi algorithm. Hebrew does not inherently require Arabic letter reshaping.

For wrapping, reorder after the engine has determined line breaks; reversing an entire multiline paragraph before wrapping can scramble line/word order. Prefer a capable text layout engine over custom per-character positioning. Do not copy a ReportLab recipe from one version to another without a representative test.

Inspect PDF pixels, text maps/embedded font faces and logical search/copy separately. Historical invisible text overlays were implemented, but broad viewer compatibility was not demonstrated. `/ActualText`, tagged PDF and an invisible layer each require consumer-specific validation; existence of metadata is insufficient. Text extracted from an incoming PDF may already be visual order or have a broken font mapping. Preserve the raw extraction and compare with rendered source before normalizing. Bidi cannot recover unknown characters from a broken map.
