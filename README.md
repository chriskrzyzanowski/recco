# Recco

AI menu intelligence for restaurants — point your camera at a menu, get
ranked dish recommendations based on your diet, allergens, and taste.

This repo holds two iPhone-framed clickable prototypes. Both are pure
static files (HTML + CSS + JSX, React via CDN, no build step).

## What's in here

| File / folder      | What it is                                                |
| ------------------ | --------------------------------------------------------- |
| `index.html`       | Chooser page — links to v1 and v2 side-by-side            |
| `Recco.html`       | **v1** — full prototype (moods, group ordering, paywall, flavor swipe, profile, saved, chat) |
| `recco/`           | v1 source: app router, screens, components, tokens, data  |
| `Recco v2.html`    | **v2** — MVP cut after partner feedback                   |
| `recco-v2/`        | v2 source — narrower surface area (no accounts, no moods) |
| `vercel.json`      | Vercel static-deploy config (unused right now)            |
| `.vercelignore`    | Vercel ignore list                                        |

## v1 vs v2 in one line

**v1** is the full vision — every feature we've sketched. **v2** is what
you'd actually ship as MVP: scan → AI analysis → ranked picks → dish
detail, plus history and a settings page. No accounts, no moods, no
restaurant picker, no chat, no group ordering, no paywall.

## Running locally

Both prototypes need to be served over `http://`, not opened as
`file://` (Babel's JSX loader can't fetch under `file://`). Pick whichever
runtime you have:

```sh
# Python (any version 3.x)
python -m http.server 8000

# Node
npx serve

# VS Code
# Install the "Live Server" extension, right-click index.html → Open with Live Server
```

Then open `http://localhost:8000/`.

## Live demo

GitHub Pages is enabled on this repo. The chooser, plus direct links to
each version:

- Chooser: <https://chriskrzyzanowski.github.io/recco/>
- v1: <https://chriskrzyzanowski.github.io/recco/Recco.html>
- v2: <https://chriskrzyzanowski.github.io/recco/Recco%20v2.html>

## Tech notes

- React 18 + Babel are loaded via unpkg CDN, no bundler.
- Each `<script type="text/babel" src="...">` runs as a top-level scope;
  shared components attach to `window` to be available across files.
- The iPhone frame is fixed at 390 × 844. Both root HTML files include a
  `useFitScale` hook that scales the frame down on smaller viewports so
  it fits any laptop or phone browser.
- v1 uses `window.RECCO_ENABLE_LIVE_AI` (default `false`) to gate the
  "Ask Recco about this dish" chat — it requires a backend that isn't
  wired yet.

## Next steps (post-demo)

- **Real OCR / vision** — wire camera → Claude vision API → structured
  dish JSON, replacing the animated scan placeholder.
- **Real "Ask Recco" chat** — gate currently flipped off; needs a small
  serverless proxy to call the Anthropic API.
- **Native iOS** — translate the screens to SwiftUI once the OCR pipeline
  validates on real menus.
