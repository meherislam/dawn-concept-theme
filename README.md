# Concept Inspired

A custom Shopify theme built on [Dawn](https://github.com/Shopify/dawn) 15.5.0. Clean,
modern, mobile-first, with app-like touch interactions — a visual reinterpretation
inspired by the look and feel of RoarTheme's *Concept*.

**Design inspiration only. No code from that theme was copied or referenced.**

[Design system](#design-system) ·
[Custom sections](#custom-sections) ·
[Local preview](#local-preview-no-store-required) ·
[Testing against a store](#testing-against-a-store) ·
[Development](#development) ·
[Constraints](#constraints) ·
[Staying current with Dawn](#staying-current-with-dawn) ·
[License](#license)

## What's different from Dawn

| | |
| --- | --- |
| **Design system** | Retuned type scale, palette, radii and shadows — all driven from theme settings, not hardcoded |
| **4 new/extended sections** | Mobile product carousel, image hotspots, before/after slider, mega menu |
| **Preview harness** | Exercise the custom CSS/JS in a browser with no Shopify store |
| **Untouched** | Dawn's cart drawer, product form, variant picker, predictive search and quantity selectors are functionally unmodified |

## Design system

Everything flows from `config/settings_data.json` through the `:root` block in
`layout/theme.liquid`, so it all stays editable in the theme editor. Nothing is
hardcoded in CSS.

- **Palette** — warm neutral base (`#FDFBF8` / `#1F1B17`) with a single clay accent
  (`#B5643C`). The accent is exposed as a new theme setting and published as
  `--color-accent` / `--color-accent-contrast` for custom sections to consume.
- **Type** — Work Sans, heading scale 115, tighter heading letter-spacing
  (`-0.035rem × scale`), and a larger desktop scale (`.h0` 6.4rem, `h1` 5.2rem).
- **Surfaces** — 16px card radii, zero borders, soft shadows instead of outlines.
  Shared tokens `--concept-radius-sm/md/pill` and `--concept-shadow-soft/raised`
  live in `assets/base.css`.
- **Buttons** — pill-shaped, with a lift-and-deepen hover transition that is
  disabled under `prefers-reduced-motion`.

## Custom sections

Every setting below is configurable in the theme editor. No hardcoded content.

### Mobile product carousel — `sections/mobile-product-carousel.liquid`

Horizontally scrollable product cards using **CSS scroll-snap**, not a JS carousel
library. The next card peeks past the fold on mobile; arrows appear at ≥990px.

Column counts are fractional (`1.35` mobile, `2.4` tablet, configurable 2–6 on
desktop), which is what produces the peek. The JavaScript only handles arrow
paging and disabled state — scrolling, snapping and momentum are all native.

Settings: heading, heading size, colour scheme, cards-per-view on desktop, arrow
toggle, image ratio, secondary image on hover, vendor, rating, quick add
(none/standard/bulk), padding. Up to 16 product blocks.

### Image hotspots — `sections/image-hotspots.liquid`

An image with positioned markers that open a product card popover on tap or click.

Blocks carry `horizontal_position` / `vertical_position` percentages, and Liquid
picks the popover's flip direction from them so a card near an edge opens inward
instead of overflowing the frame. Implements the disclosure pattern:
`aria-expanded` / `aria-controls`, close on outside click, close on Escape with
focus returned to the marker.

Settings: heading, heading size, image, image ratio, marker pulse animation,
colour scheme, padding. Up to 8 hotspot blocks.

### Before/after slider — `sections/before-after-slider.liquid`

Two images with a draggable divider, built on the Pointer Events API with
`setPointerCapture`, so it works with mouse, touch and pen.

The reveal is a `clip-path: inset()` driven by one custom property. A visually
hidden native `<input type="range">` sits behind the image and acts as the
accessible driver — that gives full keyboard control and screen reader support for
free, with `aria-valuetext` kept in sync. `touch-action: pan-y` means dragging
horizontally moves the divider while vertical swipes still scroll the page.

Settings: heading, heading size, both images, both labels, slider label, starting
position, image ratio, full width, colour scheme, padding.

### Mega menu — `snippets/header-mega-menu.liquid`

Dawn's header extended rather than replaced, so `<header-menu>`, `StickyHeader`
and `MenuDrawer` keep working and there's still a single source of navigation data.

Adds a configurable column count and an optional featured promo card. A
**Mega menu promo** block is matched to a top-level nav item by `handleize`-ing its
`menu_item` setting against the link handle, which is how per-menu-item content
becomes possible without a second nav data source.

## Local preview (no store required)

Liquid renders on Shopify's servers, so templates can't be rendered offline. But
the custom sections' CSS and JavaScript contain no Liquid, so they can be exercised
in a plain browser:

```bash
python3 -m http.server 8931
```

Then open **http://localhost:8931/.preview/index.html** (note the leading dot).

Run it from the **theme root**, not from inside `.preview/` — the page links the
real theme files as `../assets/…` and needs the server rooted one level above.

The harness hand-copies the markup each section emits and links the actual
stylesheets and scripts, so it tests the real code. A toolbar toggles RTL, the
alternate colour scheme and layout outlines. See
[`.preview/README.md`](.preview/README.md) for details and caveats.

It cannot cover anything Liquid renders — real product cards, prices, navigation
from a live linklist, or the theme editor. For that you need a store; a free
Shopify Partners development store costs nothing.

This is not a toy: rendering the sections this way caught a bug where the custom
elements defaulted to `display: inline`, which put a horizontal scrollbar on every
desktop page containing the carousel. Theme check cannot see that.

## Testing against a store

**Use a free development store, not a store you already run.** A development store
is a separate, fully functional store with no relationship to any existing one, so
there is no live theme to put at risk.

1. Sign in at [partners.shopify.com](https://partners.shopify.com) — a Partner
   account is free and does not affect any store you already own.
2. **Stores → Add store → Create development store**.
3. Choose "Test and build" and let it populate test products.
4. Point the CLI at it:

```bash
shopify theme dev --store your-dev-store.myshopify.com
```

No cost, no payment details, no expiry. This gives full Liquid rendering — real
product cards, navigation from a live linklist, and the theme editor — which is
everything the [local preview](#local-preview-no-store-required) cannot cover.

If you ever run this against a store that has real customers, use `theme dev` or
`theme push --unpublished`. Both create a hidden theme and leave the live one
alone. Never use `--live`, `--allow-live`, `theme publish`, or a bare
`theme push` (which prompts for a theme and makes it easy to hit live by mistake).
Always pass `--store` explicitly rather than relying on a remembered default.

## Development

```bash
shopify theme dev --store your-dev-store.myshopify.com   # live reload
shopify theme check                                      # lint (currently: no offenses)
```

`.shopifyignore` keeps `.preview/` out of anything uploaded to a store.

Branches: `main` and `develop`.

## Constraints

Deliberate rules this theme is built under:

- Dawn's functional JavaScript is **not** rewritten — cart drawer, product form,
  variant picker, predictive search and quantity selectors are restyled via CSS only.
- Online Store 2.0 throughout: JSON templates, `{% schema %}`, editor settings.
- No build step and no frameworks. Vanilla JS and CSS, following Dawn's custom
  element conventions.
- CSS scroll-snap in preference to JavaScript carousel libraries.
- Dawn's accessibility patterns maintained: focus states, ARIA attributes, keyboard
  navigation, `prefers-reduced-motion`.

Note that `prefers-reduced-motion` needs explicit handling in new code. Dawn's only
reduced-motion rule targets an opt-in `.motion-reduce` class, so it does not apply
automatically.

## Staying current with Dawn

```bash
git remote add upstream https://github.com/Shopify/dawn.git
git fetch upstream
git merge upstream/main
```

Commit history was rewritten to correct author metadata before the first push, so
the Dawn baseline commit no longer shares a hash with upstream. Compare trees
rather than referencing that hash.

## License

Dawn is copyright (c) 2021-present Shopify Inc. and is used here under its original
licence — see [LICENSE.md](LICENSE.md). Modifications in this repository are the
work of this repository's author.
