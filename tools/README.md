# Banner tools

`banner.mjs` renders `assets/banner.svg`.

```sh
node tools/banner.mjs
```

## What is inside

- 1200x400 canvas, palette taken from the Moonlit Tavern theme: bg `#0d0914`, lavender `#b8b8ff` / `#d4d4ff`, gold `#e8c396`, text `#e6e6fa`.
- Stars are generated from a fixed seed (`20261125`), so the sky does not change between builds. Change the seed for a different night.
- The moon is a masked circle: a light disc with a darker one offset on top of it.
- Type uses a system serif stack. External webfonts do not load inside an SVG used through `<img>`, so anything fancier has to be converted to paths.

## Editing

Text lives at the bottom of the file, in the `<g font-family=...>` block. Colours live in `<defs>`.

## Profile cards

`assets/cards/*.svg` are exported from `design/profile-mockup.figcraft` (FigCraft). Each card is its own layer, so it can be exported on its own and wrapped in a link in the README — that is the only kind of "interactivity" GitHub allows: one image, one `<a href>`.

To change a card: open the mockup, edit the layer, select it, export SVG with text as outlines.
