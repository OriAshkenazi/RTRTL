# Markdown, chat, TXT, CSV and subtitles

Markdown has no standard direction attribute. Some viewers allow `<div dir="rtl" lang="he">`, some sanitize it, and Markdown nested inside HTML may stop being parsed. Preserve canonical Markdown and, if needed, create a read-only HTML reading view from the same text. Verify the actual viewer. Do not silently replace an editable Markdown artifact with HTML.

TXT/CSV encode characters, not paragraph layout. Use explicit UTF-8; a BOM can be useful for specific Windows/Excel consumers, but is not an RTL setting. Preserve original values and IDs. Console mojibake, U+FFFD replacement characters and missing glyphs require encoding/font diagnosis before bidi handling. Avoid copying corrupted console text into a patch.

SRT/VTT must keep timing syntax, cue indices and canonical Hebrew text intact. Test the intended player: alignment and bidirectional support vary. Do not reverse cues or add HTML that the player does not support. No subtitle player was exercised in the 2026-10-19 fixture run.

For a plain-text display layer that demonstrably supports Unicode isolates, wrap a whole known LTR phrase in balanced LRI `U+2066` / PDI `U+2069`; use FSI `U+2068` for unknown direction. Keep canonical values clean. Do not scatter RLM/LRM or override controls; use the target adapter's tested compatibility exception only when required. A reply/rewrite does not need a new rendering fixture.

## Line breaks (any renderer)

Mixed Hebrew text often reads correctly on a wide screen and breaks badly on a phone or in large text. Glue what must stay together in the text itself:

- A number stays on the line of the word or unit after it: `12 מ״ב`, `8 קבצים`, `180°`. Join them with U+00A0 NO-BREAK SPACE. NBSP is an ordinary space character, not a bidi control, so it does not conflict with the rule against scattered RLM/LRM.
- A separator with spaces around it (`·`, `•`, `|`, `–`, `—`) must not start or end a line. Glue it to both neighbours with NBSP (`נשמרו 8 קבצים · 12 מ״ב`), or rewrite as a sentence. In Hebrew status lines a sentence often reads better than a separator: `נשמרו 8 קבצים. הם תופסים 12 מ״ב.`
- Apply the gluing in the formatting/i18n helper (a numeric placeholder joins the next word, a separator helper joins both sides) rather than hand-editing every string; helpers should accept semantic runs, as in the web adapter.
- A bullet at the start of a list item (`• קמח`) is a list marker, not a separator; it only needs to stay with its first word.

For web layout pitfalls that break lines regardless of the text, see the [web adapter](web.md#line-breaks-and-narrow-screens).
