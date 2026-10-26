# HTML, CSS, React and web frameworks

- Set `<html lang="he" dir="rtl">` for a Hebrew page, or `dir="rtl"` on a Hebrew component inside another-language shell. React uses the same `dir`/`lang` attributes. Language is not direction.
- Wrap complete known LTR phrases in `<bdi dir="ltr">…</bdi>` or a tightly scoped element with `dir="ltr"`. For unknown injected content use `<bdi>`/`dir="auto"` where first-strong guessing is appropriate. Framework helpers should accept semantic runs rather than regex-wrap every digit in a whole document.
- Put `dir="auto"` on each user-written item (a comment, a message, a row), not once on the list around them: an auto element takes the direction of its first strong character, so one wrapper makes every item follow the first. [Directionality](https://html.spec.whatwg.org/multipage/dom.html#the-directionality).
- Add `lang="en"` beside `dir="ltr"` where the run really is English (a brand name, a quote), so speech, hyphenation and font choice follow it. A code, number or unit is not English: `<bdi dir="ltr">PRJ07</bdi>` stays without `lang`. Never tag user text of unknown language. [`lang`](https://html.spec.whatwg.org/multipage/dom.html#the-lang-and-xml:lang-attributes).
- Use CSS logical properties (`margin-inline-start`, `padding-inline`, `border-inline-end`, `inset-inline-start`) for reading-relative layout. `text-align:start` follows base direction. Keep physical properties where the design intentionally specifies a physical side.
- `dir` does not flip box-shadow offsets, gradient angles, `transform-origin`, `background-position` or `translateX()`. Override them under `:dir(rtl)` only where the side carries meaning: a drawer sliding in from the start side, a carousel, a switch thumb (an unflipped one slides out of its track). A shadow cast down-right is lighting; leave it. Whether a control should mirror is in [arrows](arrows.md). [Logical properties](https://www.w3.org/TR/css-logical-1/), [transforms](https://www.w3.org/TR/css-transforms-1/).
- Tailwind, Radix, MUI and other portalled UI: see [web frameworks](web-frameworks.md).
- Avoid combining inherited RTL with `row-reverse` and arbitrary `order` values without a concrete layout model. Check visual order and DOM/tab order together. An RTL root can change grid placement as well as text.
- A table's column order and each cell's direction are separate. Put numeric values and code columns in scoped LTR cells. Prefer numeric data over strings that include hidden controls. Preserve column semantics and give wide tables a deliberate scroll area on phones.
- For a Hebrew slide viewer following RTL reading order, previous can be physically right and next left. Put arrows in separate elements. Test clicks, keyboard, disabled states and counters; verify the intended viewer convention rather than applying it to every product.
- RTL scrollers commonly use `0` at the right edge and negative offsets toward the left in Chromium. Detect the actual direction/visible content. Do not copy `scrollLeft = scrollWidth - clientWidth` from a deliberately LTR scroller to an RTL one.
- Wait for `document.fonts.ready` and image decoding before capture/print. Inspect actual platform fonts through CDP when available, and the resulting PDF's font resources. CSS font weight 800 may select a different family/face than 700.
- The Google Fonts `hebrew` subset has no space, digits or ASCII punctuation (its `unicode-range` is `U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F`), so those fall back to another font. When self-hosting or picking subsets, ship `latin` with it. [CSS2 API](https://developers.google.com/fonts/docs/css2).

## Forms

- Give free-text inputs and textareas `dir="auto"` so each value takes its own direction. Detection reads the typed value, never the placeholder.
- `type="tel"` without `dir` is already LTR. Email and URL values are LTR content: give those fields `dir="ltr"` deliberately. Labels stay in the page's direction. Their placeholder then reads LTR too: use an LTR example (`name@example.com`) or put the Hebrew hint in the label, rather than switching `direction` while the field is empty. [Directionality](https://html.spec.whatwg.org/multipage/dom.html#the-directionality).

## Numbers from `Intl`

`Intl.NumberFormat` output already holds bidi marks. With Node 24's ICU, `he-IL` ILS currency is `U+200F 1,234.50 U+00A0 U+200F ₪`, and a negative plain number starts with `U+200E`. Wrap it in `<bdi>`; forcing `dir="ltr"` on it moves the `₪` to the other side. Use `formatToParts()` to style pieces, and store and compute on the raw number: a formatted string is display only (`parseFloat` gives `NaN`). [ECMA-402](https://tc39.es/ecma402/#numberformat-objects), [`formatToParts`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts).

## Line breaks and narrow screens

Apply the [line-break rules](text.md#line-breaks-any-renderer) to the text, then avoid layouts that split it anyway:

- Never leave bare text beside inline elements directly inside a flex (or grid) container. Each text node becomes an anonymous flex item, so one sentence splits into columns that each wrap on their own (`12` and `מ״ב` on two lines, a `·` dangling at a column end). Wrap the words in a single span.
- An atomic inline (`inline-flex`, `inline-block`, a `<button>`) can still begin a new line after a NBSP in Chromium. Keep a glued separator inside plain inline text, or move the count onto its own line (for example a second "supporting text" line, `4 מתכונים`).
- A centred column-flex child (`align-items: center`) is as wide as its content's minimum, so a long unbreakable value (an email, a code) makes it wider than its container even under `overflow-wrap: break-word`; `text-wrap: balance` does not prevent this. Give it `max-inline-size: 100%`. In grids holding user-supplied names, use `minmax(0, 1fr)` tracks and `overflow-wrap: anywhere`.
- An element parked off-screen with a large physical offset (a skip link at `left: -9999px`) widens an RTL page, because overflow toward the left scrolls there; Chromium made a 1024px page 11023px wide. Hide it with a clip-based visually hidden pattern (`clip-path: inset(50%)`, 1px box, `overflow: hidden`) and undo that on `:focus`.
- Where the canonical text must stay unchanged, a short value in its own element can take `white-space: nowrap` instead of NBSP (`<bdi dir="ltr" class="value">-12.50 mm</bdi>`).
- Check narrow phone widths (320px) and the largest text size, not only the default. In mobile emulation an overflowing page zooms out and the layout viewport widens, which hides the overflow from later measurements; check overflow yourself. `check_browser.cjs --checks lines` (see [reproducible checks](reproducible-checks.md)) measures rendered line boxes for these cases.

[Primary API reference](https://www.w3.org/International/articles/inline-bidi-markup/bidi_examples.en). Use installed APIs or browse only if the actual version/behavior is unresolved.

Minimal authored mixed-content example:

```html
<html lang="he" dir="rtl">
<meta charset="utf-8">
<h1><bdi dir="ltr">PRJ07</bdi> — תוכנית עבודה</h1>
<p>הפרש המדידה: <bdi dir="ltr">-12.50 mm</bdi>.</p>
```

Use the task's available font; prefer logical CSS spacing and `text-align:start`. `dir="auto"` is for unknown-direction content, not a known Hebrew heading starting with a code.

## Link previews and other plain-text consumers

Open Graph, social-card metadata and the document title are separate output surfaces. Page CSS, `<bdi>` and `dir="rtl"` cannot be assumed to control a receiving app's link preview. For a Hebrew card, prefer a Hebrew-only title; place a Latin brand in `og:site_name` separately. Supply the correct `og:locale`, explicit language URL and readable static metadata. Do not rely on the page's JavaScript language redirect to localize a crawler's response. Avoid HTML or unverified invisible controls inside metadata strings.

Read the served HTML without executing JavaScript, then inspect a fresh preview in the actual sharing app when available. A browser card simulation is only a regression aid; it does not verify WhatsApp, another app, or an existing cached message. A supplied failure screenshot establishes that consumer's observed failure, not the success of a later fix. [Open Graph fields](https://ogp.me/).
