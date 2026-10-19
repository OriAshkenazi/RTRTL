# SVG, Canvas, diagrams and plots

SVG text has its own `direction`, `unicode-bidi`, anchoring and coordinate rules; explicitly scope mixed labels. `text-anchor` resolves against direction, so do not assume `end` always means the physical right side. Preserve diagram topology/coordinate axes. Keep label font size readable at the actual rendered scale; a 24-unit SVG font can shrink to unreadable pixels when a wide viewBox is fit to a phone.

Canvas supports `ctx.direction='rtl'` and `ctx.textAlign='start'` in compatible engines; neither adds accessible/searchable DOM text. Keep source logical, test mixed strings and treat canvas output as a graphic. For complex labels or wrapping, prefer the platform's text layout or an HTML overlay. No current canvas interaction test is claimed.

For Matplotlib or other plot libraries, inspect the installed backend/version for bidi support. Do not apply an old string-reversal or `python-bidi` workaround unconditionally. Prefer a verified bidi text backend, or generate labels through one while retaining scientific data and axes. A static raster can look correct yet have no copyable text. Current scientific-plot RTL behavior was not exercised.
