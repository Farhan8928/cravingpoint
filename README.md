# Craving Point .88

Official website for **Craving Point .88** — a dessert atelier and grill in Chembur Camp, Trombay, Mumbai.

A single scroll-driven page built around two film sequences scrubbed frame-by-frame on canvas: a chocolate pour over the signature spread, and a chicken wrap built to order on the grill.

---

## Quick start

```bash
npm install
npm run assets     # PNG masters -> WebP frame sequences (see below)
npm run dev        # http://localhost:5173
npm run build      # -> dist/, prerendered
npm run preview    # serve dist/ on :4173
```

`npm run assets` must run once before `dev` or `build`. It is the only step that
touches the raw footage, and its output (`public/frames/`, `src/data/sequences.js`)
is gitignored — regenerate rather than commit ~19 MB of WebP.

---

## The frame pipeline

`scripts/process-frames.mjs` is the reason this site is shippable.

The masters are **900 lossless 1280×720 PNGs — 547 MB** across two shots. That is a
fine intermediate and an impossible payload. The script rebuilds them as:

| | frames | desktop (`w1440`) | mobile (`w720`) |
|---|---|---|---|
| `hero` (video1) | 600 → **281** | 9.5 MB | 5.1 MB |
| `craft` (video3) | 300 → **151** | 4.4 MB | 2.3 MB |

**A device downloads one tier, not both: ~13.9 MB desktop, ~7.4 MB mobile.**

Three levers get it there:

- **Decimation** — every 2nd frame. The masters are 60fps captures of very slow
  camera moves; at 30 effective frames the scrub stays smooth because scroll
  velocity, not frame rate, sets the cadence. The hero's opening ~60 frames of
  empty slate are decimated harder still (every 6th) since nothing moves in them.
- **Two tiers** — chosen at runtime from viewport width × DPR, and forced to
  `w720` when the browser reports `saveData`.
- **WebP q70** — dark, grainy, shallow-depth-of-field food hides compression well.
  Above q75 the file size climbs with no visible return.

It also emits the poster stills, the base64 LQIPs, and `src/data/sequences.js` —
the frame-count manifest the canvas loads against, so the client never guesses a
count and 404s its way through a scroll.

Point it at a different source with `SRC=... npm run assets`.

---

## How the scrubbing works

`src/components/FrameSequence.jsx` + `src/lib/frameLoader.js`.

The section is `N × 100vh` with a sticky viewport inside it. Two decisions
separate this from the version that stutters:

- **The frame index is animated, not assigned.** Mapping scroll position straight
  onto a frame number means the canvas only changes when a scroll event fires — a
  fast flick skips a dozen frames, a slow drag quantises visibly. Instead
  ScrollTrigger scrubs a tweened `{ frame }` object and the canvas redraws from
  that, interpolating between scroll positions.
- **Loading is ordered and pre-decoded.** 300 parallel `new Image()` calls
  saturate the connection and arrive in whatever order the network likes. The
  loader runs a bounded pool in sequence order, jumps a coarse spread of frames to
  the front of the queue, and uses `createImageBitmap` so decoding never lands
  inside `drawImage`.

Frames that have not arrived are not blanks — `paint()` walks back to the nearest
loaded frame, so a partly-loaded sequence scrubs coarsely instead of flickering.

---

## Architecture

```
index.html            document shell, meta, JSON-LD, no-JS fallback
scripts/
  process-frames.mjs  PNG masters -> WebP sequences + stills + manifest
  prerender.mjs       bakes rendered markup into dist/index.html
src/
  main.jsx            hydrate (prod) / render (dev)
  entry-server.jsx    SSR entry for the prerender
  App.jsx             section order, Lenis lifecycle
  index.css           tokens, reveal primitives, component classes
  lib/
    motion.js         GSAP + Lenis wiring; the one place plugins register
    frameLoader.js    ordered, pooled, pre-decoded frame loading
  components/         one file per section + the motion primitives
  data/
    brand.js          ⚠ contact details — see below
    menu.js           the two counters
    sequences.js      AUTO-GENERATED — do not edit
```

### Prerendering

`npm run build` renders the page to static markup and injects it into
`dist/index.html` (~29 kB). Without it the site served an empty `<div id="root">`
— and since the whole page is scroll-driven, that meant *zero* text with JS off.
For a counter whose link gets forwarded in WhatsApp groups, the link-preview
fetcher does not run JS, so this is a real audience rather than a theoretical one.

A render under 5 000 characters fails the build rather than shipping a blank page.

### Motion

- **Lenis** smooths the wheel, driven from GSAP's ticker so there is one rAF loop
  and `ScrollTrigger` never reads a scroll position Lenis is still animating
  toward. Touch scrolling is left native — smoothing it fights iOS momentum.
- **Plugins register at module scope**, not in an effect. React runs child effects
  before parent effects, so registering in `App` happens *after* every section has
  already tried to build its ScrollTriggers.
- **Reveals open from a CSS closed state**, never from JS `from` values — otherwise
  the prerendered markup paints visible for a frame before hydration hides it.

### Accessibility

- `prefers-reduced-motion` is honoured throughout: Lenis is skipped entirely
  (rather than set to zero smoothing), sequences render a still, the Craft section
  collapses from 3.5 screens to one readable viewport, the marquee stops.
- Because reveals start hidden in CSS, a `<noscript>` block in `index.html` forces
  them open — the failure mode is "no animation", not "no page".
- Skip link, real `tablist` semantics on the counter switch, focus-visible rings,
  and the duplicated marquee track hidden from AT.
- The native cursor is only hidden once the custom one is in the DOM.

---

## ⚠ Before this goes live

The source prototypes contained **no real contact details**. Everything below is
a placeholder in [`src/data/brand.js`](src/data/brand.js):

- `phone` / `phoneDisplay` — currently `+91 99999 99999`
- `whatsapp` — currently `wa.me/919999999999`
- `email`, `social[]` links
- `mapEmbed` — empty, so the Visit section falls back to a Maps link rather than
  rendering a broken embed. Paste the URL from Google Maps → Share → Embed.
- `canonical` and `og:url` in `index.html` point at `cravingpoint.example`

Also confirm: **prices in [`src/data/menu.js`](src/data/menu.js) are illustrative**,
and the hours and "Est. 2024" line in the hero.

---

## Deploying

Static output — any host works.

```
build command:    npm run assets && npm run build
publish directory: dist
```

Serve `public/frames/**` with a long `Cache-Control` (they are content-stable and
regenerate under the same names only when the footage changes).
