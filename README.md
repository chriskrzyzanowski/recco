# Recco

AI menu intelligence for restaurants — point your camera at a menu, get
ranked dish recommendations based on your diet, allergens, and taste.

An iPhone-framed clickable prototype built as pure static files
(HTML + CSS + JSX, React via CDN, no build step).

## What's in here

| File / folder      | What it is                                                |
| ------------------ | --------------------------------------------------------- |
| `Recco.html`       | The prototype entry point                                 |
| `recco/`           | Source: app router, screens, components, tokens, data     |
| `vercel.json`      | Vercel static-deploy config                               |
| `.vercelignore`    | Vercel ignore list                                        |

## Running locally

The prototype needs to be served over `http://`, not opened as
`file://` (Babel's JSX loader can't fetch under `file://`). Pick whichever
runtime you have:

```sh
# Python (any version 3.x)
python -m http.server 8000

# Node
npx serve
```

Then open `http://localhost:8000/Recco.html`.

## Live demo

Auto-deployed to Vercel on every push to `main`:

<https://recco-rho.vercel.app/>

## Tech notes

- React 18 + Babel are loaded via unpkg CDN, no bundler.
- Each `<script type="text/babel" src="...">` runs as a top-level scope;
  shared components attach to `window` to be available across files.
- The iPhone frame is fixed at 390 × 844. The root HTML includes a
  `useFitScale` hook that scales the frame down on smaller viewports so
  it fits any laptop or phone browser.
- `window.RECCO_ENABLE_LIVE_AI` (default `false`) gates the "Ask Recco
  about this dish" chat — it requires a backend that isn't wired yet.

## Next steps

- **Real OCR / vision** — wire camera → vision API → structured dish JSON,
  replacing the animated scan placeholder.
- **Real "Ask Recco" chat** — gate currently flipped off; needs a small
  serverless proxy to call the Anthropic API.
- **Native iOS** — translate the screens to SwiftUI once the OCR pipeline
  validates on real menus.
