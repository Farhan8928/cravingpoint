# Craving Point .88

Official website for **Craving Point .88** — a dessert and grill counter at Shop No. 29, F-Sector, Cheeta Camp Road, Trombay, Mumbai.

A single scroll-driven page built around two film sequences scrubbed frame-by-frame on canvas: chocolate poured over waffles and brownies, and a chicken wrap built to order on the grill.

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

**A colour block owns its foreground.** `.block-*` redefines `--ink`,
`--muted`, `--accent`, `--line` and `--ground` for its whole subtree, so
`text-ink` / `text-muted` / `border-line` keep working inside a block and
automatically mean "on this block".

This replaced a separate `block-ink` / `block-muted` vocabulary you had to
remember to use — and that shipped a bug twice. Miss one class and the text falls
back to `--ink`, which on a dark block is dark espresso on near-black: invisible,
and invisible in a way that reads as a rendering glitch rather than a missing
class. One vocabulary for the whole site; forgetting is no longer possible.

The gifting CTA still flips from the gradient to solid cream, because a gradient
button on a gradient block is invisible.

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
| Collection | Two counters, one obsession. | **Waffle. Tub. Sundae. Wrap.** |
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
- **Instrument Sans** — body copy only, where mono would be a readability tax.
  (Was Inter Tight; Inter is the single most-cited typographic tell of a
  generated site.)

### The header

Two pieces, mirroring the reference structure without copying it. A **top rail**
— open/closed status left, wordmark centred between hairlines, place right —
which reads as signage rather than app chrome; the first thing a shop tells you
is whether it is open, so that status is computed from the real hours. And a
**floating gradient pill nav**, bottom-centre, which fades in once you are past
the hero and is the one persistent element always showing the brand colour.

### Mobile framing

The first attempt at this letterboxed the frame — capped how much `cover` was
allowed to crop and painted bars around the rest. That treated the symptom.
Checking what this class of site actually does gave a better answer.

**Apple ships different aspect ratios per breakpoint, not one image cropped by
CSS.** Measured from their live AirPods page:

| Asset | `small` (mobile) | `medium` | `large` (desktop) |
|---|---|---|---|
| Hero | 734x800 — **0.92 portrait** | 1068x1200 — 0.89 | 1800x1050 — **1.71 landscape** |
| Highlights | 400x480 — **0.83 portrait** | 934x628 — 1.49 | 1260x680 — 1.85 |

Two things follow, and both matter: the mobile asset is a **re-framed shot**, and
their mobile media block is roughly square rather than full viewport height.

So there is now a third frame tier, `p720` — a **1:1 crop made at build time**,
not a resize — and on portrait viewports the canvas is a square block rather than
full-bleed. Source and box agree, so nothing is cropped or letterboxed at render
time. `pickTier()` selects it on viewport aspect < 0.9, and the `<link
rel=preload>` tags carry matching `media` queries so a phone never downloads a
landscape frame it will not draw.

**Square, not Apple's 0.8-0.9.** Their mobile asset is shot for portrait; ours is
a crop of a landscape master, so every point of extra height costs real width.
1:1 keeps 56% of the frame where 4:5 keeps 45%.

| Device | Before | After |
|---|---|---|
| iPhone 13/14 | 26% visible | **56%**, fills the block |
| Pixel 7 | 25% | **56%** |
| iPhone SE | 32% | **56%** |
| Desktop | 100% | 100%, untouched |

It is also sharper and lighter. `cover` was asking for 3001 device pixels of
width from a 720px landscape tier — a 4.2x upscale of a frame that was then
mostly cropped away. The square tier is drawn near 1:1, and at 9.2 MB it costs
less than the 16.5 MB desktop tier while carrying more useful pixels per byte.

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
into a pill showing that word — `Order`, `Switch`, `Maps`, `Enquire`. The pill is
offset down-right of the pointer rather than centred on it: centred is correct
for a 14px drop and wrong for a 100px pill, which then covers the very control
you are pointing at. That is the part that earns its place: an affordance, not an
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
assets-src/client/     the client's own photographs, logo and portraits
scripts/
  process-frames.mjs   PNG masters -> WebP sequences + stills + manifest
  process-images.mjs   assets-src -> cropped WebP sets, logo, favicons, CREDITS
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

## Verification

```bash
npm run dev                          # one terminal
npm i --no-save puppeteer-core       # dev-only, not in package.json
npm run verify                       # another terminal — audit + smoke
```

`npm run verify` runs all three checks below. Run it before showing work to anyone.

### `npm run audit` — contrast

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

### `npm run audit:devices` — responsive UI/UX

[`scripts/audit-devices.mjs`](scripts/audit-devices.mjs) walks eight real device
sizes, scrolling the whole page at each, and checks six things per size:

| Check | Rule |
|---|---|
| `overflow` | horizontal scroll |
| `tap` | targets under **44px on touch**, **24px on pointer** |
| `type` | rendered text under 11px (iOS HIG floor) |
| `occluded` | interactive elements trapped under the fixed bottom bar **at page end** |
| `offscreen` | boxes extending past the viewport edge |
| `affordance` | the hero scroll cue is actually visible at this size |
| `emoji-font` | characters a phone will draw from its colour-emoji font |

It exists because "no horizontal overflow at 390px" was being reported as
"mobile is fine", and those are not the same claim. A page can fit the viewport
perfectly and still be unusable. The first run found **369 issues**, including:

- **The hero had no scroll cue on any phone.** It was `hidden md:flex` — on a
  *five-viewport-tall* hero, on the one layout where the cue matters most,
  because the screen is a single dark frame with nothing suggesting more below.
- **The mobile order bar's primary CTA was 35px tall.** The main conversion
  target on the main device.
- "Open in Google Maps →" and "Back to top ↑" were **10px tall** — a bare inline
  `<a>` is exactly as tall as its text.
- Every UI label sat at 10–11px, under the platform floor.

#### The emoji-font check

`✳` (U+2733) shipped as a **green emoji tile** on Android and iOS while looking
perfectly correct in every desktop test. Its default presentation is text, but
the system colour-emoji font claims the codepoint and sits earlier in the mobile
fallback chain. Desktop Chrome on Windows resolves it from Segoe UI Symbol and
shows the intended glyph — so the defect is **invisible on the platform the tests
run on**, and no amount of screenshotting would have found it.

The marquee separator is now an inline SVG. `U+FE0E` would force text
presentation, but it still depends on the font stack honouring it; an SVG has no
font dependency at all and takes `currentColor`.

The check walks rendered text for codepoints with `Emoji=Yes` that are not
followed by `U+FE0E`. It was validated by reintroducing the original character
and confirming it fails — a test that has only ever passed has proven nothing.

#### Two calibrations were needed to make it trustworthy rather than noisy:

- **Occlusion is only checked at the bottom of the document.** Mid-page,
  elements pass under a fixed bar constantly — that is just scrolling. The first
  version reported every element on the page in turn.
- **Target size follows the input, not the breakpoint.** WCAG 2.5.5 (AAA) asks
  44px, 2.5.8 (AA) asks 24px. Holding a desktop nav to 44px reports every
  well-built site as broken. This caught a genuine bug the breakpoint alone
  could not: the floating pill nav appears at `lg` (1024px), which is *iPad Pro
  portrait* — a touch device — where its 32px links were too small.

### `npm run smoke` — behaviour after interaction

[`scripts/smoke.mjs`](scripts/smoke.mjs) covers the two bugs that reached the
client, both of which were invisible to every check that existed at the time for
the same reason: **they only appear after the user does something.** A screenshot
of a freshly loaded page cannot see either.

1. **Footer foreground.** Measures the footer's real computed text colours
   against its own background, in both themes. Asserts the result, not the
   mechanism, so it keeps working if the mechanism changes again.
2. **Stranded cursor label.** Hovers a labelled CTA, then scrolls 2500px
   *without moving the mouse* — the browser fires no pointer event, so `mouseout`
   never runs. The label pill used to stay expanded and float over an unrelated
   section showing a price for a row that was long gone. The fix re-hit-tests
   under the last known pointer position on scroll.

It runs at **1920×1080**, the width the client reviews at.

---

## Why sites look AI-made, and what was changed here

Researched against [925studios](https://www.925studios.co/blog/ai-slop-web-design-guide),
[sikora.software](https://sikora.software/blog/ai-website-design) and
[Forbes](https://www.forbes.com/sites/jodiecook/2026/05/21/15-new-giveaway-signs-of-ai-writing-may-2026-update/),
then audited honestly against this build. Several tells were ours.

| Tell | Status here |
|---|---|
| Inter as the default typeface | **was ours** — body was Inter Tight. Now Instrument Sans |
| Purple/indigo-to-violet gradient | never — cacao → ember → rosé |
| Vague aspirational tagline | **was ours** — "The Art of Indulgence". Now "Made when you ask, not before" |
| Every section an identical block | **was ours** — see below |
| Excessive em dashes in prose | **was ours** — 68 occurrences, now only where typographically correct |
| AI-generated imagery | **was ours** — see below |
| Decorative filler stats | **was ours** — ".88 / the house number" was data-shaped decoration |
| Uniform padding on every band | **was ours** — every section was `py-section` |
| Big empty quarters on wide screens | **was ours** — the manifesto had a dead lower-left |
| Emoji used as icons | never |
| Generic testimonial names | never — there are no testimonials |
| Left-border gradient cards | never |
| Missing micro-interactions | never |

### The footage was the biggest one

The hero reel is a cut-together video. A scene-cut pass over it — consecutive-frame
difference on a 32×18 greyscale downsample — finds its last cut at **frame ~540**.
Everything before is real commercial food footage. Everything after is a single
**AI-generated** wide shot of a dessert table: impossible symmetry, steam that
resolves into nothing, an oil bottle no dessert counter owns.

The client flagged exactly that look on the gifting section without knowing it
came from their own reel. `scripts/process-frames.mjs` now stops the hero at
frame **532**, so the sequence ends on the real brownies-into-chocolate splash —
genuine, and a stronger final frame than the table ever was. Hero went 281 → 247
frames and the payload 19 MB → 16.7 MB.

The grill reel was checked the same way: cuts at ~55–65 only, real footage
throughout. Nothing trimmed.

### The structural one

Every section opened with the identical scaffold: `01 — Label` + hairline rule +
display headline. Five in a row. The numbering in particular makes a page read as
a generated outline rather than as something authored. Each section now enters
differently:

- **Manifesto** — no label at all, opens cold on the headline
- **Collection** — the counter switch *is* the opener, with the label riding on it
- **Gifting** — label sits with the headline, no rule
- **Visit** — the address leads
- **Craft** — captions carry places ("On the coals") instead of `01 —` `02 —` `03 —`

Vertical rhythm varies too, rather than `py-section` on everything.

### What is still an AI tell, and needs you

Honestly: **the site has almost no people in it.** One hand holding a box, and
nothing else. No owner, no counter staff, no customers, no founding year, no
reviews, no story about how the shop started. That absence of specific human fact
is the deepest version of this problem, and it is the one thing that cannot be
fixed by design — inventing an owner's name or a fake review would be worse than
leaving the gap.

What would fix it, in rough order of impact: a photo of whoever runs the counter,
one sentence in their own words about why the shop exists, the real founding
year, and two or three genuine customer lines.

---

## Client assets

`assets-src/client/` holds the originals the client supplied, committed so
`npm run assets:images` is reproducible anywhere. That is the same lesson the
frame masters taught: a build step reading from one person's Downloads folder
cannot run on a deploy host.

**The logo** is a glossy 3D mark, a deliberate style clash with the editorial
design around it. Rather than redraw someone's brand asset, it is used where it
has room to be itself — the preloader, the footer and the favicons — while the
header keeps the typographic wordmark. A 20px-tall version of that artwork in a
minimal rail reads as a clipart sticker; at 80px on the dark footer it reads as
a sign. Its white JPEG background is keyed out in
[`scripts/process-images.mjs`](scripts/process-images.mjs) with a soft alpha ramp
rather than a hard threshold, which is what stops a jagged halo on the edges.

**The portraits crop from the top, never by salience.** sharp's `attention`
strategy scores contrast, and on a standing shot the brightest, busiest region is
the shirt — it cropped the founder's head clean off on the first pass. Heads are
at the top of a portrait; that is a rule, not a heuristic, and `position: 'top'`
encodes it.

---

## Image quality

Benchmarked against the Gauri Furnishing build (1600px top rung at q80). Three
real problems were found and fixed; one request could not be met and the reason
matters.

### 4K is not achievable, and forcing it makes things worse

| Source | Native resolution |
|---|---|
| Frame masters | **1280x720** — 720p |
| Dish photography | 1448x1086 max |
| Founder portrait | 3024x4032 ✓ |

4K is 3840x2160 — nine times the pixels present in the footage. Upscaling adds
no detail; it ships a larger, softer file. Every rung above a source's native
width is now skipped rather than invented.

### The actual cause of the softness

The dish sources are **1448x1086 landscape**. Cropping those to the 4:5 portrait
the layout used capped them at `height x 0.8 =` **868px** — so the 1200px files
being served were upscaled from 868 and shipping invented pixels. That is why
they looked soft at exactly the size they were meant to shine.

Dishes are now cropped **square**, which yields 1086px of real detail from the
same file. The Collection panel needs ~1056 device pixels at 2x DPR; square
covers it, 4:5 could not. Verified: the browser now selects
`dish-waffle-1086.webp` for a slot requiring 928 device pixels.

### Every asset finishes on its native ceiling

A fixed ladder leaves a hole whenever a source lands between rungs — the square
crop tops out at 1086, the ladder steps 800 → 1200, and 1200 is correctly
skipped as upscale, so the best rendition shipped was **800px**: worse than
before the work started. The ladder now always appends the true cap:

```
dish-waffle      480 / 800 / 1086      owner-portrait  480 … 2400 / 3024
dish-sundae      480 / 800 / 1200/1254 owner-candid    480 / 632
gift-boxes       480 / 800 / 1200/1448 still-*         480 / 800 / 1200/1280
```

### Frames

Quality was q70 desktop / q66 mobile — well under the q80 reference, and low
enough to band in the dark gradient-heavy areas this footage is full of. Now
**q84 / q80**, and the tier is renamed `w1280` from the misleading `w1440`
(it always capped at the 1280px master).

A device downloads one tier: **16.5 MB desktop, 7.3 MB mobile**, up from ~11 MB
and ~5 MB. The frames *are* the site, they stream progressively behind the
preloader, and they are cached 30 days.

### Two structural fixes this exposed

**`<Img>` builds its srcset from a generated manifest.** It previously carried a
hardcoded `[480, 800, 1200, 2000]` and relied on every call site passing a
correct `max`. No asset ever had a 2000px rendition, so the browser was free to
choose a URL that 404s. Both pipelines now declare exactly what they wrote
(`src/data/images.js`, `STILLS` in `src/data/sequences.js`) and `<Img>` reads
that, so markup and disk cannot drift.

**The pipeline sweeps its own orphans.** Widths are derived per source now, so
changing a ratio strands old files — and a stale `dish-waffle-1200.webp` from
the previous 4:5 crop is a wrongly-cropped upscale sitting in the deploy under a
plausible name. Ten were removed on the first run.

## ⚠ Before this goes live

**1. Three facts are still missing, and the About section is waiting on them.**
In [`src/data/brand.js`](src/data/brand.js) under `founder`:

| Field | Needs |
|---|---|
| `name` | The founder's name, shown under his portrait |
| `since` | The year the counter opened |
| `quote` | One or two sentences in his own words |

They are `null`, not filled with a guess, and About **omits** whatever is still
null rather than printing a placeholder. A fabricated name or founding year
sitting beside a real person's photograph is a false statement about someone who
exists — worse than a shorter section. Fill the three in and the section
completes itself; nothing else to touch.

**2. The dish photography is AI-generated.** The client supplied it and chose to
use it; the source files were named `ChatGPT Image ...`. It is used because it
shows *this shop's actual products* — the kraft tubs match the client's own film
footage — which beats a stock photograph of a stranger's dessert. It is recorded
per-asset in [CREDITS.md](CREDITS.md) and should be replaced the moment real
product shots exist. The two founder portraits and the logo are genuine.

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

**3. There are no prices on the site, by choice.** A street counter changes them
more often than a website gets redeployed, and a stale price is worse than no
price — it is a promise the counter has to either honour or argue about. The
WhatsApp button is the quote. The menu in
[`src/data/menu.js`](src/data/menu.js) is only what the supplied photographs
show — seven items. If the counter serves more, add them there with a photo each;
the whole Collection section is driven by that file.

---

## Deploying

Static output. Vercel config is in [`vercel.json`](vercel.json); any static host
works with the same two settings:

```
build command:      npm run build      ← NOT `npm run assets && npm run build`
publish directory:  dist
```

### Why the build command must not include `npm run assets`

**`npm run assets` cannot run on a deploy host, and must never be in the build
command.** It reads the 547 MB of PNG frame masters from a local path
(`D:/Downloads/...`, overridable with `SRC`). Those masters are not in this repo
and are not meant to be — so on CI the step either fails outright or silently
produces nothing.

That is why `public/frames/` and `public/images/` are **committed** rather than
gitignored, which is the opposite of the usual rule for generated files. The
reasoning: when the *source* of a generated asset is not reachable from the
build, the generated asset is the source. Ignoring them ships a site whose hero
canvas is permanently blank — which is exactly what the first Vercel deploy did.

Roughly 17 MB of WebP. Git and Vercel both handle that without complaint.

**Asset changes are a two-step process.** Regenerate locally, then commit the
output:

```bash
npm run assets     # needs the masters on this machine
git add public/frames public/images src/data
git commit -m "assets: re-cut hero sequence"
git push
```

### Caching

`vercel.json` sets `immutable` only on `/assets/*`, which Vite content-hashes.
`/frames/*` and `/images/*` get 30 days plus `stale-while-revalidate` instead —
their filenames are stable, so `immutable` there would pin a year-old hero
sequence in every returning visitor's browser after a re-cut. Thirty days is the
compromise: repeat visits inside a month cost nothing, and a footage change still
propagates on its own.

### Checklist for a deploy that actually works

- [ ] `public/frames/` is tracked (`git ls-files public/frames | wc -l` → 796)
- [ ] `src/data/sequences.js` frame counts match the files on disk
- [ ] Build command is `npm run build`, output directory `dist`
- [ ] `npm run verify` passes locally first
