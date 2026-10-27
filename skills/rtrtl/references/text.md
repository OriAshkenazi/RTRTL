# Markdown, chat, TXT, CSV and subtitles

Markdown has no standard direction attribute. Some viewers allow `<div dir="rtl" lang="he">`, some sanitize it, and Markdown nested inside HTML may stop being parsed. Preserve canonical Markdown and, if needed, create a read-only HTML reading view from the same text. Verify the actual viewer. Do not silently replace an editable Markdown artifact with HTML.

TXT/CSV encode characters, not paragraph layout. Use explicit UTF-8; a BOM can be useful for specific Windows/Excel consumers, but is not an RTL setting. Preserve original values and IDs. Console mojibake, U+FFFD replacement characters and missing glyphs require encoding/font diagnosis before bidi handling. Avoid copying corrupted console text into a patch.

SRT/VTT must keep timing syntax, cue indices and canonical Hebrew text intact. Test the intended player: alignment and bidirectional support vary. Do not reverse cues or add HTML that the player does not support. No subtitle player was exercised in the 2026-10-19 fixture run.

Hebrew SRT files are often Windows-1255. When the bytes are not valid UTF-8, or a UTF-8 read shows U+FFFD, decode the original bytes as `cp1255` and write UTF-8, keeping cue numbers, timings and line endings. Do not decode as ISO-8859-8 (`hebrew`): it lacks `₪`, `–`, curly quotes, gershayim `״` and niqqud, which Windows-1255 has ([CP1255 mapping](https://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1255.TXT)). Check the result has Hebrew letters and no U+FFFD before replacing the file. A file that already contains U+FFFD was saved after a wrong decode and cannot be repaired from itself; go back to the original bytes.

For a plain-text display layer that demonstrably supports Unicode isolates, wrap a whole known LTR phrase in balanced LRI `U+2066` / PDI `U+2069`; use FSI `U+2068` for unknown direction. Keep canonical values clean. Do not scatter RLM/LRM or override controls; use the target adapter's tested compatibility exception only when required. A reply/rewrite does not need a new rendering fixture.

In source code, identifiers and URLs, embedding, override and isolate controls (U+202A–U+202E, U+2066–U+2069) are also a security finding, since code can display differently from how it runs ([CVE-2021-42574](https://www.cve.org/CVERecord?id=CVE-2021-42574)): reject them there rather than stripping them from all prose.

## Chat messages

A Telegram or WhatsApp message has no `dir`. Each line takes its reading order from its first strong character ([UAX #9](https://www.unicode.org/reports/tr9/#P2) P2–P3 per paragraph), so a Hebrew line that starts with a Latin word (`Galaxy S24 במחיר מיוחד`) reads LTR: the product name lands at the far left, after the Hebrew. Checked on iPhone in Telegram and WhatsApp on 2026-10-27 (see `COMPATIBILITY.md`, "Chat messages"); Android and desktop clients are untested, so say so when the fix targets them.

- Line alignment differs by client. Telegram aligns each line by its own direction. WhatsApp on iPhone aligns every line of a message the same way as the first line, so an English line in a Hebrew-first message sits on the right but still reads in order. The mark fixes reading order, not that alignment.

- Put one U+200F RIGHT-TO-LEFT MARK at the start of a Hebrew line whose first strong character is Latin. Leave lines that already start with Hebrew, English replies and code blocks or `pre` entities unchanged; do not prefix every line.
- Insert the mark while building the text: before splitting long messages and before computing entity offsets. Telegram counts entity offsets and lengths in UTF-16 code units, and the mark is one unit, so adding it afterwards shifts every later entity ([Bot API](https://core.telegram.org/bots/api#messageentity)).
- Do not add marks around amounts inside a Hebrew line: `₪` is bidi class ET and resolves with its number (`₪150`) under UAX #9 rule W5.
- Whether these clients honour isolates (FSI/PDI) is unverified; do not use them here.
- Telegram's MarkdownV2 and HTML parse modes run on the logical text, and Hebrew does not break them. The usual failure is escaping: MarkdownV2 requires a backslash before reserved characters such as `.`, `-` and `!`, in Hebrew sentences too ([formatting options](https://core.telegram.org/bots/api#formatting-options)).

## Line breaks (any renderer)

Mixed Hebrew text often reads correctly on a wide screen and breaks badly on a phone or in large text. Glue what must stay together in the text itself:

- A number stays on the line of the word or unit after it: `12 מ״ב`, `8 קבצים`, `180°`. Join them with U+00A0 NO-BREAK SPACE. NBSP is an ordinary space character, not a bidi control, so it does not conflict with the rule against scattered RLM/LRM.
- A separator with spaces around it (`·`, `•`, `|`, `–`, `—`) must not start or end a line. Glue it to both neighbours with NBSP (`נשמרו 8 קבצים · 12 מ״ב`), or rewrite as a sentence. In Hebrew status lines a sentence often reads better than a separator: `נשמרו 8 קבצים. הם תופסים 12 מ״ב.`
- Apply the gluing in the formatting/i18n helper (a numeric placeholder joins the next word, a separator helper joins both sides) rather than hand-editing every string; helpers should accept semantic runs, as in the web adapter.
- A bullet at the start of a list item (`• קמח`) is a list marker, not a separator; it only needs to stay with its first word.

For web layout pitfalls that break lines regardless of the text, see the [web adapter](web.md#line-breaks-and-narrow-screens).
