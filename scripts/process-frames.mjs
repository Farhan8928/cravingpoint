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
    poster: 300,
    label: 'Chocolate pour over the signature spread',
  },
  craft: {
    dir: 'frames_video3',
    step: 2,
    poster: 300,
    label: 'The grill wrap, folded to order',
  },
};

const TIERS = [
  { name: 'w1440', width: 1440, quality: 70 },
  { name: 'w720', width: 720, quality: 66 },
];

/** Frames pulled out of the sequences to serve as ordinary stills elsewhere. */
const STILLS = {
  'still-spread': { seq: 'hero', frame: 600, w: 2000, h: 1125 },
  'still-pour': { seq: 'hero', frame: 300, w: 1600, h: 900 },
  'still-slate': { seq: 'hero', frame: 1, w: 1600, h: 900 },
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
  const total = fs.readdirSync(path.join(SRC, dir)).filter((f) => f.endsWith('.png')).length;
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
  for (const [slug, cfg] of Object.entries(STILLS)) {
    const src = frameFile(SEQUENCES[cfg.seq].dir, cfg.frame);
    if (!fs.existsSync(src)) {
      console.warn(`  skip still ${slug} — no ${src}`);
      continue;
    }
    for (const w of [480, 800, 1200, 2000]) {
      if (w > cfg.w) continue;
      const h = Math.round((cfg.h / cfg.w) * w);
      await sharp(src)
        .resize(w, h, { fit: 'cover', position: 'centre' })
        .webp({ quality: 80, effort: 5 })
        .toFile(path.join(IMG_OUT, `${slug}-${w}.webp`));
    }
    console.log(`  still ${slug}`);
  }
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
  await buildStills();

  fs.mkdirSync(path.resolve('src/data'), { recursive: true });
  fs.writeFileSync(
    path.resolve('src/data/sequences.js'),
    `// AUTO-GENERATED by scripts/process-frames.mjs — do not edit by hand.\n` +
      `// Frame counts here are the contract the canvas scrubber loads against.\n` +
      `export const SEQUENCES = ${JSON.stringify(manifest, null, 2)};\n`
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
