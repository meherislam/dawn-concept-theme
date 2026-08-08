# Local preview harness

A plain HTML page that exercises the custom sections' **CSS and JavaScript** in a
browser with no Shopify store, no CLI, and no network.

```bash
# from the theme root
python3 -m http.server 8931
# then open http://localhost:8931/.preview/index.html
```

`.shopifyignore` excludes this directory, so it is never uploaded by
`shopify theme push` or `shopify theme dev`.

## How it works

Liquid can only be rendered by Shopify's servers. So `index.html` hand-copies the
markup each section emits, and links the **real** files from `../assets` — the
stylesheets and scripts are not duplicated here. `tokens.css` stands in for the
`:root` custom properties that `layout/theme.liquid` normally generates from
`config/settings_data.json`.

Three harness-only files, all clearly marked and prefixed `pv-`:

| File | Purpose |
| --- | --- |
| `tokens.css` | The `:root` block + `html`/`body` rules from `layout/theme.liquid` |
| `harness.css` | Toolbar chrome, stand-in product cards, nav rules inlined by `sections/header.liquid` |
| `harness.js` | Placeholder SVG imagery, stand-in carousel slides, toolbar toggles |

The toolbar toggles RTL, the alternate colour scheme, and layout outlines.
Resize the window to cross the 750px and 990px breakpoints.

## What it can and cannot verify

**Can:** scroll-snap behaviour and edge peek, arrow enable/disable and paging,
hotspot popover flip positions and open/close/Escape handling, before/after
pointer drag and keyboard control, mega-menu promo layout, RTL, reduced motion,
horizontal overflow.

**Cannot:** anything Liquid renders — real product cards, prices, navigation from
a real linklist, section schema settings, the theme editor. For those you need a
store; a free Shopify Partners development store costs nothing.

## Keeping it honest

If you change `config/settings_data.json`, mirror the value in `tokens.css` or
the preview will drift from the real theme. If a section's markup changes,
update `index.html` to match.
