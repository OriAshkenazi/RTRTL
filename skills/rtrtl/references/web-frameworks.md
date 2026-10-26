# Web frameworks

Framework-specific notes for [web](web.md). Check the installed version; these were read from the current sources.

## Tailwind CSS v4

- `rtl:` compiles to `:where(:dir(rtl), [dir="rtl"], [dir="rtl"] *)`, and `ltr:` to the same with `ltr`. An element inside a `<bdi dir="ltr">` or `dir="auto"` run on an RTL page is still a descendant of `[dir="rtl"]`, so `rtl:` utilities match there, and inside `dir="ltr"` both variants match. Inside isolated runs use logical utilities (`ms-*`, `pe-*`, `start-*`, `text-start`) rather than direction variants. [`variants.ts`](https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/variants.ts).
- `space-x-*` already sets `margin-inline-start`/`margin-inline-end`, so it follows `dir`; adding `rtl:space-x-reverse` puts the space back on the wrong side. Prefer `gap-*` on flex and grid rows. [Margin](https://tailwindcss.com/docs/margin#adding-space-between-children).

## Portalled UI

Modals, menus, popovers and toasts mounted at `body` sit outside a `dir="rtl"` set on an inner element, and the library reads its own direction setting for keyboard arrows, placement and sliding. Set both the markup and the library's setting: Radix `<DirectionProvider dir="rtl">` around the app, MUI `createTheme({ direction: 'rtl' })` with its RTL style setup. [Radix](https://www.radix-ui.com/primitives/docs/utilities/direction-provider), [MUI](https://mui.com/material-ui/customization/right-to-left/).
