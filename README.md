# Craving Point .88

Official website for **Craving Point .88** — a dessert atelier and grill at Shop No. 29, F-Sector, Cheeta Camp Road, Trombay, Mumbai.

A single scroll-driven page built around two film sequences scrubbed frame-by-frame on canvas: a chocolate pour over the signature spread, and a chicken wrap built to order on the grill.

Ships **light and dark themes**, light by default.

---

## Design direction

**Cocoa & Bone** — bone paper, espresso ink, one burnt-cacao accent, pulled from
the footage itself so the page and the film read as one object.

Deliberately **no gold and no pure black.** That pairing is the default "luxury"
costume, and it is not what actually wins. The colour research behind this:

| Awwwards Food &amp; Drink winner | Palette |
|---|---|
| Caffè Gilli (Florentine patisserie, est. 1733) | `#a9bdcc` blue-grey + `#142342` navy |
| Flora Café | `#F2ECD9` cream + `#B63530` deep red |
| Sunbeam Bagels &amp; Coffee | `#fa7e3b` orange + `#c3abc6` lilac |

Every one pairs a warm light ground with a single distinctive non-metallic
colour. Light is the default here for the same reason: dark, warm food
photography reads best framed on paper.

Type is **Fraunces** (variable serif with an optical-size axis, so the display cut
can be genuinely high-contrast while small sizes stay sturdy) over **Inter Tight**.
Playfair Display set at 14px is one of the clearest tells of a template.

### Theming

Every colour resolves to a CSS custom property, so a class like `bg-ground` is
correct in both modes and there is not a single `dark:` variant in the
components. Switching rewrites nine variables on `<html>`.

Type that sits *over the film* uses fixed `film-*` colours instead. The footage is
dark in both themes — theme-following text would vanish the moment someone
switched to light.

An inline, render-blocking script in `index.html` applies the stored theme before
first paint; anything later (the bundle, a React effect) runs after the browser
has already painted, so a returning dark-mode visitor would get a full-screen
flash of bone paper. Its storage key and default are mirrored in `src/lib/theme.js`.

---

## Quick start

```bash
npm install
npm run assets     # frame sequences + dish photography (see below)
npm run dev        # http://localhost:5173
npm run build      # -> dist/, prerendered
npm run preview    # serve dist/ on :4173
```

`npm run assets` must run once before `dev` or `build`. It is two steps and each
can be run alone:

| script | does | writes |
|---|---|---|
| `npm run assets:frames` | 547 MB of PNG masters → WebP scroll sequences | `public/frames/`, `src/data/sequences.js` |
| `npm run assets:images` | downloads + crops the dish photography | `public/images/dish-*`, `src/data/alts.js`, `CREDITS.md` |

Both outputs are gitignored — regenerate rather than commit ~19 MB of WebP.
Downloads are cached in `.cache/photos/`, so re-runs are free and work offline.

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

The section is `N × 100vh` with a sticky viewport inside it. Four decisions
separate this from the version that stutters:

- **The frame index is animated, not assigned.** Mapping scroll position straight
  onto a frame number means the canvas only changes when a scroll event fires — a
  fast flick skips a dozen frames, a slow drag quantises visibly. Instead
  ScrollTrigger scrubs a tweened `{ frame }` object and the canvas redraws from
  that, interpolating between scroll positions.
- **Decoded frames are never retained.** See below — this was the whole problem.
- **The backing store is capped at the source resolution.** A 1440px canvas at
  DPR 2 is 2880px of fill rate per frame, for a 1280px master that cannot supply
  that detail. Backing beyond the source buys nothing and costs the difference on
  every frame.
- **Loading is ordered and pre-decoded.** 300 parallel requests saturate the
  connection and land in whatever order the network likes. The loader runs a
  bounded pool in sequence order and jumps a coarse spread of frames to the front
  of the queue, so an early scroll always has something to land on.

Frames that have not arrived are not blanks — `paint()` walks back to the nearest
loaded frame, so a partly-loaded sequence scrubs coarsely instead of flickering.

### Why this does not use `createImageBitmap`

The obvious implementation decodes every frame to an `ImageBitmap` and keeps the
array. It is also what made the first build stutter. An ImageBitmap is
*uncompressed* RGBA the page holds until explicitly closed:

```
hero:   281 frames × 1280 × 720 × 4 bytes  =  988 MB
craft:  151 frames × 1280 × 720 × 4 bytes  =  531 MB
```

— held live, simultaneously. Long before that fills memory the browser is
fighting to keep it, and the symptom is exactly what it looked like.

`HTMLImageElement` inverts the ownership: the page holds the compressed WebP
(9.5 MB for the whole hero sequence) and the **browser** owns the decoded bitmaps,
evicting them under pressure like any other image. The cost is that an evicted
frame decodes synchronously inside `drawImage`, so `warmWindow()` keeps a sliding
±24-frame window around the playhead explicitly decoded.

Measured after the change — full hero sequence loaded, scripted scroll through all
4500px of it:

```
JS heap                  19 MB
median frame             16.7 ms   (60 fps)
p95 frame                16.8 ms
dropped frames (>32ms)   1 / 157   (0.6%)
```

Two other things were quietly costing frames and are gone: an animated
full-viewport grain layer (repainting the whole page several times a second) and
a pointer-following radial-gradient spotlight driven from CSS variables
(repainting the viewport on every mousemove). The cursor is transform-only now,
and the grain is static.

---

## Architecture

```
index.html            document shell, meta, JSON-LD, no-JS fallback
scripts/
  process-frames.mjs  PNG masters -> WebP sequences + stills + manifest
  process-images.mjs  dish photography -> 4:5 WebP sets + alts + CREDITS.md
  prerender.mjs       bakes rendered markup into dist/index.html
src/
  main.jsx            hydrate (prod) / render (dev)
  entry-server.jsx    SSR entry for the prerender
  App.jsx             section order, Lenis lifecycle
  index.css           tokens, reveal primitives, component classes
  lib/
    motion.js         GSAP + Lenis wiring; the one place plugins register
    theme.js          light/dark state, mirrored by the boot script in index.html
    frameLoader.js    ordered, pooled, pre-decoded frame loading
  components/         one file per section + the motion primitives
  data/
    brand.js          ⚠ contact details — see below
    menu.js           the two counters
    sequences.js      AUTO-GENERATED — do not edit
    alts.js           AUTO-GENERATED — do not edit

### The Collection section

Worth naming because the first version was wrong. It floated a raw film frame
under the cursor, which read as a bug: an unstyled rectangle covering the row you
were trying to read. The problem was the *pattern*, not the polish — a
cursor-following image has nowhere to be, so it always lands on top of content.

It is now a list with the photograph in its own column: a sticky framed panel
that crossfades as you move down, holding the last hovered dish rather than
snapping to empty. All frames are stacked and crossfaded on opacity rather than
swapped by `src`, because swapping means a decode on every hover and that shows
as a flash of empty panel.

Below `lg` there is no hover to drive it, so the panel is dropped and each row
carries its own thumbnail — same content, honest to the input.
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
- Both themes are contrast-checked. `--muted` is the tightest pair at 4.7:1 on
  its ground, which is why it is `#6F6152` and not the lighter clay it started as.
- Because reveals start hidden in CSS, a `<noscript>` block in `index.html` forces
  them open — the failure mode is "no animation", not "no page".
- Skip link, real `tablist` semantics on the counter switch, focus-visible rings,
  and the duplicated marquee track hidden from AT.
- The native cursor is only hidden once the custom one is in the DOM.

---

## ⚠ Before this goes live

**1. Dish photography is placeholder.** All ten dish photos are Unsplash
stand-ins, not Craving Point's food — see [CREDITS.md](CREDITS.md). Swapping one
is a single entry in [`scripts/process-images.mjs`](scripts/process-images.mjs);
nothing in the components or the menu data moves.

**2. Contact details are placeholder.** The source prototypes had none. In
[`src/data/brand.js`](src/data/brand.js):

- `phone` / `phoneDisplay` — currently `+91 99999 99999`
- `whatsapp` — currently `wa.me/919999999999`
- `email`, `social[]` links
- `canonical` and `og:url` in `index.html` point at `cravingpoint.example`

The **address, coordinates and map are real** — Shop No. 29, F-Sector, Cheeta
Camp Road, near Noor Masjid, Cheeta Camp, Trombay, Mumbai 400088
(`19.0394646, 72.9470021`). The embed is the keyless `maps?q=lat,lng&output=embed`
form so it works on first deploy; swap in a Maps Embed API URL if you want the
branded pin.

**3. Confirm the copy.** Prices in [`src/data/menu.js`](src/data/menu.js) are
illustrative, as are the opening hours.

---

## Deploying

Static output — any host works.

```
build command:    npm run assets && npm run build
publish directory: dist
```

Serve `public/frames/**` with a long `Cache-Control` (they are content-stable and
regenerate under the same names only when the footage changes).
