# Video, burned-in captions and motion

Burned-in text is pixels: nothing downstream can repair its direction. Keep caption text in logical order, set direction in the renderer, and check frames from the final file.

## ASS and libass (ffmpeg `subtitles=` / `ass=`)

libass runs the Unicode bidi algorithm itself (FriBidi), so never pre-reverse a line (`python-bidi`, `get_display`, hand-reversed words): it gets reversed a second time.

Set the style's `Encoding` field to `-1` for every style that carries Hebrew. libass takes the base direction from it: `-1` autodetects from the text and turns on whole-line layout; any other value forces a left-to-right base (`ass_resolve_base_direction` and `ass_shaper_set_base_direction` in libass `ass_shaper.c`). Without whole-line layout, libass resolves each run as its own left-to-right paragraph, and a new run starts at every override-tag style change (`\k` karaoke, `\c`, `\fn`, …) and at every glyph when the style's `Spacing` is non-zero (`ass_shaper.c`, `ass_render.c`). So under `Encoding=1`:

- a per-word karaoke line comes out in reversed word order, and the highlight sweeps in from the left;
- a non-zero `Spacing` also reverses the letters of every word;
- even a plain mixed line misplaces the Latin word and the final full stop.

`Encoding=-1` fixed all three in the tested render, including with `Spacing=1` (see `COMPATIBILITY.md`, "Burned-in captions"). The `\fe` override tag sets the same value inside a line. Give the style a Hebrew-capable `Fontname` and pass its folder with `fontsdir=`; otherwise fontconfig may substitute another face.

## ffmpeg builds

- `subtitles` and `ass` exist only in a build with `--enable-libass`. Check with `ffmpeg -filters | grep -E ' (subtitles|ass) '`; don't assume. The tested default Homebrew `ffmpeg` 9.0.2 had neither `subtitles` nor `drawtext`; Homebrew's keg-only `ffmpeg-full` had both. libass has required FriBidi and HarfBuzz since 0.15.0, so a libass build covers bidi and shaping for these filters.
- `drawtext` shapes with HarfBuzz but reorders only when built with `--enable-libfribidi` (its `text_shaping` option; FFmpeg filter docs). The tested `ffmpeg-full` lacked FriBidi and drew Hebrew letter-reversed. Prefer an ASS file for Hebrew; check `ffmpeg -buildconf` before using `drawtext`.
- The `subtitles` filter's `shaping=` option chooses glyph substitution and positioning; FFmpeg's docs call `complex` (HarfBuzz) required for Hebrew. In the test it moved niqqud marks, never words. Leave it at the default `auto`; it does not fix word order.
- A player preview (VLC, mpv) uses its own renderer and settings, and is not evidence for the burned-in frame. Extract frames from the output instead: `ffmpeg -ss 1.2 -i out.mp4 -frames:v 1 frame.png`, at moments that span the highlight.

## HTML compositions (Remotion, HyperFrames)

Captions in an HTML composition are web text: follow [web](web.md).

- Render caption tokens as inline `<span>`s, in logical order, inside one caption line that carries `lang="he" dir="rtl"`. Don't give each word its own flex item or use `row-reverse`: flex items follow the container's direction, not bidi, so a Latin brand or a number lands where the layout puts it rather than where the text does (CSS Flexbox, `flex-direction`).
- Give a Latin phrase one LTR scope around all of its tokens, splitting a token at its Hebrew prefix if needed: `ל־<bdi dir="ltr"><span>Acme</span> <span>Cloud</span></bdi>`. Leaving the word spans without `dir` also keeps the phrase together. Never isolate each Latin word on its own: in Chrome, separately isolated `Acme` and `Cloud` displayed as "Cloud Acme" (see `COMPATIBILITY.md`). Hebrew words need no `dir` of their own; the line's direction covers them.
- Highlight the active word with colour or background on its span, not by reordering or re-wrapping the line.
- For a typewriter reveal, slice by grapheme: `[...new Intl.Segmenter('he', { granularity: 'grapheme' }).segment(text)]`. Niqqud marks are separate code points (`שָׁלוֹם` is 7 code points, 4 graphemes), so `slice` or `[...text]` shows letters with half their marks (ECMA-402 `Intl.Segmenter`, Unicode UAX #29).

## Motion direction

`dir` does not mirror animation: GSAP `x`, `translateX`, slide and wipe transitions stay physical. Decide each motion's direction from its meaning and keep timelines, maps and transport controls physical; see [arrow direction](arrows.md).

## Word timings for Hebrew

Before driving highlights from speech-to-text word timings, check the words: a one-letter prefix (ו, ה, ב, כ, ל, מ, ש) split off as its own word becomes a detached highlighted letter, and a word with zero or negative duration never highlights. Join prefixes to the next word and fix such timings first.

## Not fixes

A BOM, `text-align: right`, stripping punctuation, forcing `Spacing` to 1 or more, and LRI/PDI controls inside caption strings do not set direction in these renderers. Keep caption strings plain and set direction in the style or markup.
