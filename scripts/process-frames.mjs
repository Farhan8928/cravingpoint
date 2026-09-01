/**
 * Turns the raw PNG frame masters into scroll-scrubbable WebP sequences.
 *
 * The masters are 900 lossless 1280x720 PNGs across two shots — 547 MB. That is
 * a fine intermediate and an impossible payload, so every frame is re-encoded
 * here and nothing under the source folder is ever referenced by the site.
 *
 * Three levers get it down to roughly 20 MB desktop / 8 MB mobile:
 *
 *   decimate  — every 2nd frame. The masters are 60fps captures of very slow
 *               camera moves; at 30 effective frames the scrub is still smooth
 *               because scroll velocity, not frame rate, sets the cadence.
 *   two tiers — 1440w for desktop, 720w for phones. The mobile tier is the one
 *               that matters: it is ~40% of the desktop bytes over the worst
 *               connections.
 *   WebP q70  — these are dark, grainy, shallow-depth-of-field food shots.
 *               They hide compression far better than flat graphics do, and
 *               above q75 the file size climbs with no visible return.
 *
 * Upscaling past the 1280px master is pointless, so the 1440 tier is capped at
 * the source width and named for its intent rather than its exact pixels.
 *
 * Also emitted per sequence:
 *   - a poster still (first meaningful frame) for the no-JS and pre-decode paths
 *   - a base64 LQIP so the canvas has something to sit on while frame 1 decodes
 *   - a manifest entry in src/data/sequences.js so the client never guesses a
 *     frame count and 404s its way through a scroll
 *
 * Run with: npm run assets:frames   (SRC overrides the source folder)
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = process.env.SRC || 'D:/Downloads/aa (1)/aa';
const OUT = path.resolve('public/frames');
const IMG_OUT = path.resolve('public/images');

/**
 * `step: 2` keeps every second master frame.
 *
 * `hold` marks the frames at the head of a shot that are visually identical —
 * the hero opens on ~40 frames of an empty slate before anything enters. Those
 * are worth keeping (they are the negative space the headline sits in) but not
 * at full density, so they are decimated harder.
 */
const SEQUENCES = {
  hero: {
    dir: 'frames_video1',
    step: 2,
    hold: { until: 60, step: 6 },
    /**
     * Stop at 532, not at 600.
     *
     * The master is a cut-together reel, and a scene-cut pass over it
     * (consecutive-frame difference on a 32x18 greyscale downsample) finds its
     * last cut at frame ~540. Everything before that is real commercial food
     * footage. Everything after is a single AI-generated wide shot of a dessert
     * table — impossible symmetry, steam that resolves into nothing, an oil
     * bottle no dessert counter owns — and it is unmistakable.
     *
     * The client flagged exactly this look on another section without knowing it
     * came from their own reel. Ending on 532 closes the hero on the real
     * brownie-and-chocolate splash instead, which is both genuine and a stronger
     * final frame than the table ever was.
     */
    end: 532,
    poster: 520,
    label: 'Brownies falling into chocolate',
  },
  craft: {
    dir: 'frames_video3',
    step: 2,
    poster: 300,
    label: 'The grill wrap, folded to order',
  },
};

/**
 * Two tiers, named for what they actually are.
 *
 * The desktop tier was called `w1440` while capping at the 1280px master, which
 * was a misleading name for a real ceiling: the footage is 720p, so no amount of
 * encoding produces 4K, and upscaling would only ship a bigger, softer frame.
 *
 * Quality was q70/q66 — well under the q80 the reference build uses, and low
 * enough to show banding in the dark, gradient-heavy areas this footage is full
 * of. At q84 the hero sequence costs ~7.9 MB instead of ~5.4 MB for the desktop
 * tier. That is the right trade: the frames are the site, and a device only ever
 * downloads one tier.
 */
const TIERS = [
  { name: 'w1280', width: 1280, quality: 84 },
  { name: 'w720', width: 720, quality: 80 },
];

/** Frames pulled out of the sequences to serve as ordinary stills elsewhere. */
/**
 * Frames pulled out of the sequences to serve as ordinary stills.
 *
 * All of these sit inside the real-footage range. `still-spread` used to be
 * frame 600 — the AI table — and is gone.
 */
const STILLS = {
  'still-splash': { seq: 'hero', frame: 520, w: 1600, h: 900 },
  'still-waffle': { seq: 'hero', frame: 420, w: 1600, h: 900 },
  'still-pour': { seq: 'hero', frame: 300, w: 1600, h: 900 },
  'still-wrap': { seq: 'craft', frame: 300, w: 1600, h: 900 },
  'still-grill': { seq: 'craft', frame: 150, w: 1600, h: 900 },
};

const pad = (n) => String(n).padStart(4, '0');
const frameFile = (dir, n) => path.join(SRC, dir, `frame_${pad(n)}.png`);

/**
 * Picks which master frames survive, honouring the `hold` override at the head
 * of the shot. Returns 1-based master indices in order.
 */
function selectFrames(dir, cfg) {
  const onDisk = fs.readdirSync(path.join(SRC, dir)).filter((f) => f.endsWith('.png')).length;
  // `end` trims footage we do not want to ship at all — see the note on `hero`.
  const total = Math.min(cfg.end || onDisk, onDisk);
  const picked = [];
  for (let n = 1; n <= total; n += 1) {
    const inHold = cfg.hold && n <= cfg.hold.until;
    const step = inHold ? cfg.hold.step : cfg.step;
    if ((n - 1) % step === 0) picked.push(n);
  }
  // The last master frame is the one the scroll rests on. Losing it to the
  // decimation modulo leaves the sequence ending a beat early.
  if (picked[picked.length - 1] !== total) picked.push(total);
  return { picked, total };
}

async function buildSequence(key, cfg) {
  const srcDir = path.join(SRC, cfg.dir);
  if (!fs.existsSync(srcDir)) {
    console.error(`✗ ${key}: missing source folder ${srcDir}`);
    return null;
  }

  const { picked, total } = selectFrames(cfg.dir, cfg);
  let bytes = 0;

  for (const tier of TIERS) {
    const tierDir = path.join(OUT, key, tier.name);
    fs.mkdirSync(tierDir, { recursive: true });

    for (let i = 0; i < picked.length; i += 1) {
      const out = path.join(tierDir, `${pad(i + 1)}.webp`);
      await sharp(frameFile(cfg.dir, picked[i]))
        // `withoutEnlargement` keeps the 1440 tier honest against a 1280 master.
        .resize({ width: tier.width, withoutEnlargement: true })
        .webp({ quality: tier.quality, effort: 5 })
        .toFile(out);
      bytes += fs.statSync(out).size;
    }
    console.log(`  ${key}/${tier.name}  ${picked.length} frames`);
  }

  // Poster + LQIP, both taken from the frame the sequence is "about" rather
  // than frame 1, which on the hero is a featureless empty slate.
  fs.mkdirSync(IMG_OUT, { recursive: true });
  const posterSrc = frameFile(cfg.dir, cfg.poster);
  await sharp(posterSrc)
    .resize({ width: 1600 })
    .webp({ quality: 78, effort: 5 })
    .toFile(path.join(IMG_OUT, `poster-${key}.webp`));

  const lqip = await sharp(frameFile(cfg.dir, 1))
    .resize(24)
    .blur(1.2)
    .webp({ quality: 30 })
    .toBuffer();

  return {
    key,
    count: picked.length,
    sourceFrames: total,
    poster: `/images/poster-${key}.webp`,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
    label: cfg.label,
    bytes,
  };
}

async function buildStills() {
  fs.mkdirSync(IMG_OUT, { recursive: true });
  const manifest = {};
  for (const [slug, cfg] of Object.entries(STILLS)) {
    const src = frameFile(SEQUENCES[cfg.seq].dir, cfg.frame);
    if (!fs.existsSync(src)) {
      console.warn(`  skip still ${slug} — no ${src}`);
      continue;
    }
    // Capped at the 1280px master: a 2000px rung would be pure upscale.
    const written = [];
    for (const w of [480, 800, 1200, 1280]) {
      if (w > Math.min(cfg.w, 1280)) continue;
      const h = Math.round((cfg.h / cfg.w) * w);
      await sharp(src)
        .resize(w, h, { fit: 'cover', position: 'centre' })
        .webp({ quality: w >= 1200 ? 86 : 82, effort: 6 })
        .toFile(path.join(IMG_OUT, `${slug}-${w}.webp`));
      written.push(w);
    }
    manifest[slug] = { widths: written, w: cfg.w, h: cfg.h, alt: cfg.alt || '' };
    console.log(`  still ${slug.padEnd(14)} ${written.join('/')}`);
  }
  return manifest;
}

async function main() {
  console.log(`Reading masters from ${SRC}\n`);
  fs.mkdirSync(OUT, { recursive: true });

  const manifest = {};
  let bytes = 0;

  for (const [key, cfg] of Object.entries(SEQUENCES)) {
    const built = await buildSequence(key, cfg);
    if (!built) process.exitCode = 1;
    else {
      bytes += built.bytes;
      const { bytes: _drop, ...entry } = built;
      manifest[key] = entry;
    }
  }

  console.log('\nStills:');
  const stills = await buildStills();

  fs.mkdirSync(path.resolve('src/data'), { recursive: true });
  fs.writeFileSync(
    path.resolve('src/data/sequences.js'),
    `// AUTO-GENERATED by scripts/process-frames.mjs — do not edit by hand.\n` +
      `// Frame counts here are the contract the canvas scrubber loads against.\n` +
      `export const SEQUENCES = ${JSON.stringify(manifest, null, 2)};\n\n` +
      `// Renditions written for the stills lifted out of the footage. <Img>\n` +
      `// merges this with the set from scripts/process-images.mjs, so both\n` +
      `// pipelines declare what they wrote and neither can drift from disk.\n` +
      `export const STILLS = ${JSON.stringify(stills, null, 2)};\n`
  );

  console.log(
    `\n✓ ${Object.values(manifest).reduce((n, s) => n + s.count, 0) * TIERS.length} WebP frames, ` +
      `${(bytes / 1024 / 1024).toFixed(1)} MB total across both tiers.`
  );
}

main().catch((err) => {
  console.error('✗ frame processing failed:', err);
  process.exit(1);
});
