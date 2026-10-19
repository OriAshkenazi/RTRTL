# HTML, CSS, React and web frameworks

- Set `<html lang="he" dir="rtl">` for a Hebrew page, or `dir="rtl"` on a Hebrew component inside another-language shell. React uses the same `dir`/`lang` attributes. Language is not direction.
- Wrap complete known LTR phrases in `<bdi dir="ltr">…</bdi>` or a tightly scoped element with `dir="ltr"`. For unknown injected content use `<bdi>`/`dir="auto"` where first-strong guessing is appropriate. Framework helpers should accept semantic runs rather than regex-wrap every digit in a whole document.
- Use CSS logical properties (`margin-inline-start`, `padding-inline`, `border-inline-end`, `inset-inline-start`) for reading-relative layout. `text-align:start` follows base direction. Keep physical properties where the design intentionally specifies a physical side.
- Avoid combining inherited RTL with `row-reverse` and arbitrary `order` values without a concrete layout model. Check visual order and DOM/tab order together. An RTL root can change grid placement as well as text.
- A table's column order and each cell's direction are separate. Put numeric values and code columns in scoped LTR cells. Prefer numeric data over strings that include hidden controls. Preserve column semantics and give wide tables a deliberate scroll area on phones.
- For a Hebrew slide viewer following RTL reading order, previous can be physically right and next left. Put arrows in separate elements. Test clicks, keyboard, disabled states and counters; verify the intended viewer convention rather than applying it to every product.
- RTL scrollers commonly use `0` at the right edge and negative offsets toward the left in Chromium. Detect the actual direction/visible content. Do not copy `scrollLeft = scrollWidth - clientWidth` from a deliberately LTR scroller to an RTL one.
- Wait for `document.fonts.ready` and image decoding before capture/print. Inspect actual platform fonts through CDP when available, and the resulting PDF's font resources. CSS font weight 800 may select a different family/face than 700.

[Primary API reference](https://www.w3.org/International/articles/inline-bidi-markup/bidi_examples.en). Use installed APIs or browse only if the actual version/behavior is unresolved.

Minimal authored mixed-content example:

```html
<html lang="he" dir="rtl">
<meta charset="utf-8">
<h1><bdi dir="ltr">PRJ07</bdi> — תוכנית עבודה</h1>
<p>הפרש המדידה: <bdi dir="ltr">-12.50 mm</bdi>.</p>
```

Use the task's available font; prefer logical CSS spacing and `text-align:start`. `dir="auto"` is for unknown-direction content, not a known Hebrew heading starting with a code.
