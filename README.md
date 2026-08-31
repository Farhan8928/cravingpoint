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

### The signature gradient

Pulling Sunbeam's actual stylesheet was more useful than looking at it. Its
character comes from three things, and the biggest is not visual:

| Signal | Sunbeam | Here |
|---|---|---|
| **Monospace UI layer** | `forma-djr-mono` — **40 uses**, most-used font on the site | Martian Mono |
| **One gradient, re-angled** | `102deg, #f72f23 → #ffa344 → #c3abc6`, also at 0/154/175/180deg | `--g1/--g2/--g3`, four angle utilities |
| **Heavy display face, headlines only** | `Belgard, Impact` | Fraunces |

Ours is `#7e2a14 → #c9512c → #be8fa0` — cacao, ember, and a cool dusty rosé.
**The third stop is the point.** Cacao and ember are the obvious warm pair; the
rosé is what stops it reading as a generic warm gradient, and cocoa genuinely
carries red-fruit notes so it is on-brand as well as unexpected. The stops are
declared bare so the same three colours re-angle per element — angle changes,
identity doesn't. That reuse is what makes a gradient read as a brand asset
rather than decoration.

It appears on exactly four things: the floating nav pill, the primary CTA, the
theme toggle thumb, and the cursor — plus one full section. Everywhere else the
accent is flat. A gradient that is everywhere is a texture; a gradient that is
rare is a signal.

### Section rhythm

The first build was six sections of bone paper in a row. That is a document, not
a site. The winners in this category break their cream with **whole sections in a
saturated brand colour** — Sunbeam's `--tan` (`#fce9d5`) is its most-used
background at 25 uses, and it paints eight further sections in `--red`
(`#ee3629`) outright. That contrast is most of what reads as "attractive".

| # | Section | Ground |
|---|---|---|
| — | Hero | film (dark) |
| 01 | Manifesto | bone `--ground` |
| — | Marquee | **deep cacao** `.block-cacao` |
| 02 | Collection | **warm tan** `--tan` |
| 03 | Craft | film (dark) |
| 04 | Gifting | **ember gradient** `.block-ember` |
| 05 | Visit | bone `--ground` |
| — | Footer | **near-black** `.block-ink` |

Dark, bone, cacao, tan, dark, ember, bone, ink. `--sunken` sits only 11 points
off `--ground` — enough to separate two adjacent bands, never enough to change
the temperature of a room, which is why `--tan` was added.

The dark footer also bookends the dark hero, and stops the page ending on two
barely-different creams stacked on each other.

Content inside `.block-*` uses fixed `block-ink` / `block-muted` / `block-accent`
colours. Those blocks are dark and saturated in **both** themes, so
theme-following text would disappear on one setting — same rule as `film-*` over
the footage. The gifting CTA also flips from the gradient to solid cream, because
a gradient button on a gradient block is invisible.

### Copy

The other half of what makes these sites appetising, and the easy half to miss.
Sunbeam's section headings are literal ingredient lists:

> Bagel. Sausage. Cheese. Egg.
> Espresso. Milk. Cinnamon. Maple.

Concrete nouns, full stops, staccato. You can taste it. The first draft here was
literary and completely cold by comparison — "Dessert is not an afterthought",
"Two counters, one obsession", "Gifting that arrives before you do." Well
written, zero appetite. Rewritten to the same register:

| Section | Was | Now |
|---|---|---|
| Manifesto | Dessert is not an afterthought. | **Cocoa. Butter. Salt. Fire.** |
| Collection | Two counters, one obsession. | **Brownie. Waffle. Ganache. Gold.** |
| Gifting | Gifting that arrives before you do. | **Twenty boxes. Three days. One van.** |
| Visit | Find the counter. | **Cheeta Camp. Open till one.** |

Body copy followed: specifics over adjectives. "You will wait four minutes, and
that wait is the whole point" beats any sentence containing the word *artisanal*.
The stat row now carries **4 min — average wait** rather than a decorative
"100% made to order", and the marquee reads *Poured warm · Lit at noon · Four
minutes · Open till one*.

### Type: three roles

- **Fraunces** — display only. A variable serif with an optical-size axis, so the
  display cut is genuinely high-contrast while small sizes stay sturdy.
  (Playfair at 14px is the clearest tell of a template.)
- **Martian Mono** — the entire UI layer: labels, nav, buttons, prices, stats.
  This is the single biggest reason the page reads as designed rather than
  assembled. It is a wide face, so the label tracking came down from
  0.18em/0.22em to 0.06em/0.08em — the old values were tuned for Inter and read
  as broken-apart lettering in mono.
- **Inter Tight** — body copy only, where mono would be a readability tax.

### The header

Two pieces, mirroring the reference structure without copying it. A **top rail**
— open/closed status left, wordmark centred between hairlines, place right —
which reads as signage rather than app chrome; the first thing a shop tells you
is whether it is open, so that status is computed from the real hours. And a
**floating gradient pill nav**, bottom-centre, which fades in once you are past
the hero and is the one persistent element always showing the brand colour.

### The cursor

A drop of chocolate. It carries the gradient and **squashes and stretches along
its direction of travel** — moving fast pulls it into a teardrop, stopping lets
it settle back into a round drop. On a site whose hero is chocolate being poured,
that is the one cursor that could only belong here.

The physics is cheap on purpose: velocity is just the gap between the pointer and
the blob's own lagging position — no event timing, no history buffer — driving
rotation, `scaleX`, and an inverse `scaleY`. Conserving volume that way is what
makes it read as liquid instead of as a circle being scaled.

It also **carries a label**. Anything with `data-cursor-label` expands the blob
into a pill showing that word — `Order`, `Switch`, `Maps`, and on menu rows the
dish's price. That is the part that earns its place: an affordance, not an
effect. (First attempt labelled rows with the last word of the dish name, which
produced `CUP`, `FOURS` and `STACK` — the price is always short and always means
something.)

Everything is transform-only on a single rAF, so it composites on the GPU and
never touches layout.

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
  process-frames.mjs   PNG masters -> WebP sequences + stills + manifest
  process-images.mjs   photography -> cropped WebP sets + alts + CREDITS.md
  audit-contrast.mjs   WCAG AA check over every text node, both themes
  prerender.mjs        bakes rendered markup into dist/index.html
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
- **Contrast is measured, not eyeballed** — `npm run audit`. See below.
- Because reveals start hidden in CSS, a `<noscript>` block in `index.html` forces
  them open — the failure mode is "no animation", not "no page".
- Skip link, real `tablist` semantics on the counter switch, focus-visible rings,
  and the duplicated marquee track hidden from AT.
- The native cursor is only hidden once the custom one is in the DOM.

---

## Contrast audit

```bash
npm run dev                          # one terminal
npm i --no-save puppeteer-core       # dev-only, not in package.json
npm run audit                        # another terminal
```

[`scripts/audit-contrast.mjs`](scripts/audit-contrast.mjs) walks every text node
in **both themes**, resolves the real painted background behind each one, and
exits non-zero on anything under WCAG AA. It exists because reviewing colour by
eye kept passing things that were actually failing — two real bugs shipped that
way:

- The hero eyebrow at `#E0664A` measured **4.23:1** over the film and looked
  perfectly fine in a screenshot. Type over footage has to be checked against the
  *footage*, not the page ground. Now `#FFAE8C`, 8.02:1.
- `--muted` was signed off at 4.99:1 on `--ground`. A later change moved the
  Collection section onto `--tan` — the lightest dark surface — and every 14px
  muted line silently dropped to **4.46:1**. Now `#998C7A`, 5.08:1 on tan.

Same mistake twice: a colour is only safe against the specific surface it lands
on, and surfaces change.

Two details that make it trustworthy. It **scrolls the whole page before
measuring**, because every section animates in from `opacity: 0` — the first
version measured on load, saw an empty page, and reported a clean bill of health
while the entire footer was unchecked. And it **counts what it skips** (fixed
chrome, gradient grounds — neither has a single background colour to measure
against) so those are visibly excluded rather than quietly dropped.

## ⚠ Before this goes live

**1. Photography is placeholder.** All twelve photos are Unsplash stand-ins, not
Craving Point's own — see [CREDITS.md](CREDITS.md). Swapping one is a single
entry in [`scripts/process-images.mjs`](scripts/process-images.mjs); nothing in
the components or the menu data moves.

Note the gifting section deliberately does **not** use the client's own footage.
That film is AI-generated, and the wide dessert-table frame that was there read
as a render — impossibly symmetrical, every plate lit identically, no hands
anywhere. On the one section asking a business to place a twenty-box order, a
synthetic-looking picture undercuts the claim. Both images there are now genuine
photographs. Replace them with real shots of *your* boxes, not with stills from
the film.

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
