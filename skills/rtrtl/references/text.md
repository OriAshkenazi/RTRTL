# Markdown, chat, TXT, CSV and subtitles

Markdown has no standard direction attribute. Some viewers allow `<div dir="rtl" lang="he">`, some sanitize it, and Markdown nested inside HTML may stop being parsed. Preserve canonical Markdown and, if needed, create a read-only HTML reading view from the same text. Verify the actual viewer. Do not silently replace an editable Markdown artifact with HTML.

TXT/CSV encode characters, not paragraph layout. Use explicit UTF-8; a BOM can be useful for specific Windows/Excel consumers, but is not an RTL setting. Preserve original values and IDs. Console mojibake, U+FFFD replacement characters and missing glyphs require encoding/font diagnosis before bidi handling. Avoid copying corrupted console text into a patch.

SRT/VTT must keep timing syntax, cue indices and canonical Hebrew text intact. Test the intended player: alignment and bidirectional support vary. Do not reverse cues or add HTML that the player does not support. No subtitle player was exercised in the 2026-10-19 fixture run.

For a plain-text display layer that demonstrably supports Unicode isolates, wrap a whole known LTR phrase in balanced LRI `U+2066` / PDI `U+2069`; use FSI `U+2068` for unknown direction. Keep canonical values clean. Do not scatter RLM/LRM or override controls; use the target adapter's tested compatibility exception only when required. A reply/rewrite does not need a new rendering fixture.
