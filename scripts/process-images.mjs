/**
 * Builds every still image the site uses, from `assets-src/client/`.
 *
 * ## Why the sources live in this repo
 *
 * The frame masters taught this lesson the hard way: a build step that reads
 * from a path on one person's machine cannot run on a deploy host, and the first
 * Vercel deploy shipped a blank hero because of it. The client's photographs are
 * small enough to commit (~15 MB), so they live in `assets-src/client/` and this
 * script is reproducible on any machine.
 *
 * ## Provenance
 *
 * Not all of these are equal, and the difference matters enough to record:
 *
 *   - **owner-1 / owner-2** are genuine photographs of the founder. They are the
 *     only real people on the site and they carry the About section.
 *   - **logo** is the client's own brand asset.
 *   - **the six dish photographs are AI-generated** (their source filenames were
 *     literally `ChatGPT Image ...`). They are used anyway, deliberately: they
 *     depict *this shop's actual products* — the kraft tubs match the client's
 *     own film footage exactly — which is worth more than a stock photograph of
 *     a stranger's dessert. That trade is the client's call, and they made it.
 *     `aiGenerated: true` records it per-asset and CREDITS.md prints it, so
 *     nobody later mistakes them for photographs of the real counter.
 *
 * Run with: npm run assets:images
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const SRC = path.resolve('assets-src/client');
const CACHE = path.resolve('.cache/photos');
const OUT = path.resolve('public/images');

/**
 * 4:5 portrait for dishes; a single ratio across the menu is what makes a set of
 * photographs from different sources read as one shoot. Landscape and square are
 * for the pieces that are not menu items.
 */
const PORTRAIT = { w: 1000, h: 1250 };
const LANDSCAPE = { w: 1600, h: 1200 };
const SQUARE = { w: 1200, h: 1200 };
const WIDTHS = [480, 800, 1200];

const SOURCES = {
  // ---- Menu, from the client's own product photography ----
  'dish-waffle': {
    file: 'waffle.png',
    aiGenerated: true,
    alt: 'A Belgian waffle slice under a heavy chocolate drizzle',
  },
  'dish-tub': {
    file: 'tubs.png',
    aiGenerated: true,
    alt: 'Kraft tubs packed with chocolate chunks, wafers and sauce',
  },
  'dish-sundae': {
    file: 'sundaes.png',
    aiGenerated: true,
    alt: 'Sundaes in glass coupes with cream, wafer, nuts and a cherry',
  },
  'dish-doughnut': {
    file: 'doughnuts.png',
    aiGenerated: true,
    alt: 'Cream-filled doughnuts dusted with sugar on a plate',
  },
  'dish-wrap': {
    file: 'wrap.png',
    aiGenerated: true,
    alt: 'A chicken wrap cut open, showing grilled strips, onion and cucumber',
  },
  'dish-combo': {
    file: 'combo.png',
    aiGenerated: true,
    alt: 'The combo: waffle slices, a chicken wrap, a loaded tub, mini pancakes and drinks',
  },

  // ---- Gifting. The tubs are the actual bulk product. ----
  'gift-boxes': {
    file: 'tubs.png',
    ratio: LANDSCAPE,
    aiGenerated: true,
    alt: 'A row of kraft tubs packed for a bulk order',
  },

  // ---- The founder. Real photographs. ----
  'owner-portrait': {
    file: 'owner-1.jpeg',
    ratio: PORTRAIT,
    // Portraits crop from the top, never by salience. `attention` scores
    // contrast, and on a standing shot the brightest, busiest region is the
    // shirt — it cropped this man's head clean off. Heads live at the top of a
    // portrait; that is a rule, not a heuristic.
    position: 'top',
    alt: 'The founder of Craving Point .88, smiling outside the shop',
  },
  'owner-candid': {
    file: 'owner-2.jpeg',
    ratio: SQUARE,
    position: 'top',
    alt: 'The founder of Craving Point .88',
  },
};

/**
 * Still fetched from Unsplash: one genuine photograph of a human hand passing a
 * box across. Every client-supplied dish image is AI-generated and has no people
 * in it at all, so this is the only real hand on the page — worth keeping.
 */
const REMOTE = {
  'gift-detail': {
    photo: 'photo-1622071726728-c32575ae96a3',
    by: 'Jojo Yuen',
    at: 'https://unsplash.com/@jojoyuen',
    alt: 'A person holding out an open bakery box of filled doughnuts',
  },
};

async function fetchRemote(slug, id) {
  const file = path.join(CACHE, `${slug}.jpg`);
  if (fs.existsSync(file) && fs.statSync(file).size > 10000) return file;
  const res = await fetch(`https://images.unsplash.com/${id}?w=1600&q=85&fm=jpg&fit=max`);
  if (!res.ok) throw new Error(`${res.status} for ${slug}`);
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(file));
  return file;
}

async function emit(slug, srcFile, cfg) {
  const ratio = cfg.ratio || PORTRAIT;
  for (const w of WIDTHS) {
    const h = Math.round((ratio.h / ratio.w) * w);
    await sharp(srcFile)
      // `attention` crops around the most salient region rather than the
      // geometric centre — on a plated dish that is the food, and on a portrait
      // it is the face.
      .resize(w, h, { fit: 'cover', position: cfg.position || sharp.strategy.attention })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(OUT, `${slug}-${w}.webp`));
  }
}

/**
 * The logo, with its white background removed.
 *
 * The client supplied a JPEG on solid white. Dropped straight into the dark
 * preloader or footer it would show as a white rectangle, so the background is
 * keyed out here rather than worked around in CSS.
 *
 * A flat threshold is enough because the source really is pure white, but a hard
 * cutoff leaves a jagged halo on the antialiased edge — so alpha ramps across
 * the last few levels instead of switching. JPEG compression also lifts "white"
 * off 255, hence the 232 floor.
 */
async function buildLogo() {
  const src = path.join(SRC, 'logo.jpeg');
  const { data, info } = await sharp(src)
    .resize(1024, 1024, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = Buffer.from(data);
  const LOW = 232;
  const HIGH = 252;
  for (let i = 0; i < px.length; i += info.channels) {
    const min = Math.min(px[i], px[i + 1], px[i + 2]);
    if (min >= HIGH) px[i + 3] = 0;
    else if (min > LOW) px[i + 3] = Math.round(255 * (1 - (min - LOW) / (HIGH - LOW)));
  }

  const cut = sharp(px, { raw: { width: info.width, height: info.height, channels: info.channels } });
  // `trim` removes the transparent margin so the mark can be positioned by its
  // own edges rather than by the original square canvas.
  const trimmed = await cut.png().trim({ threshold: 1 }).toBuffer();

  for (const w of [256, 512]) {
    await sharp(trimmed).resize({ width: w }).webp({ quality: 92, effort: 5 })
      .toFile(path.join(OUT, `logo-${w}.webp`));
  }
  await sharp(trimmed).resize({ width: 512 }).png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'logo.png'));

  // Favicons. Flattened onto the brand ground — a transparent favicon renders
  // on whatever the browser chrome happens to be, which is rarely flattering.
  for (const [name, size] of [['favicon-32.png', 32], ['favicon-180.png', 180]]) {
    await sharp(trimmed)
      .resize(size - Math.round(size * 0.12), size - Math.round(size * 0.12), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: Math.round(size * 0.06), bottom: Math.round(size * 0.06),
        left: Math.round(size * 0.06), right: Math.round(size * 0.06),
        background: { r: 0x17, g: 0x11, b: 0x0d, alpha: 1 },
      })
      .flatten({ background: '#17110d' })
      .png()
      .toFile(path.resolve('public', name));
  }
  console.log('ok  logo (background keyed out) + favicons');
}

async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });

  const missing = Object.values(SOURCES)
    .map((c) => c.file)
    .filter((f, i, a) => a.indexOf(f) === i)
    .filter((f) => !fs.existsSync(path.join(SRC, f)));
  if (missing.length) {
    console.error(`✗ missing source images in assets-src/client: ${missing.join(', ')}`);
    process.exit(1);
  }

  const alts = {};

  for (const [slug, cfg] of Object.entries(SOURCES)) {
    await emit(slug, path.join(SRC, cfg.file), cfg);
    alts[slug] = cfg.alt;
    console.log(`ok  ${slug}${cfg.aiGenerated ? '  (AI-generated source)' : ''}`);
  }

  for (const [slug, cfg] of Object.entries(REMOTE)) {
    await emit(slug, await fetchRemote(slug, cfg.photo), cfg);
    alts[slug] = cfg.alt;
    console.log(`ok  ${slug}  (unsplash)`);
  }

  await buildLogo();

  fs.writeFileSync(
    path.resolve('src/data/alts.js'),
    `// AUTO-GENERATED by scripts/process-images.mjs — do not edit by hand.\n` +
      `export const ALTS = ${JSON.stringify(alts, null, 2)};\n`
  );

  const ai = Object.entries(SOURCES).filter(([, c]) => c.aiGenerated);
  const real = Object.entries(SOURCES).filter(([, c]) => !c.aiGenerated);

  fs.writeFileSync(
    path.resolve('CREDITS.md'),
    `# Image credits and provenance\n\n` +
      `## Real photographs\n\n` +
      `| Asset | Source |\n|---|---|\n` +
      real.map(([s, c]) => `| \`${s}\` | Client photograph (\`${c.file}\`) |`).join('\n') +
      `\n| \`gift-detail\` | [Jojo Yuen](https://unsplash.com/@jojoyuen) via [Unsplash](https://unsplash.com/license) |\n` +
      `\nThe logo is the client's own brand asset. The two film sequences are the\n` +
      `client's footage.\n\n` +
      `## ⚠ AI-generated\n\n` +
      `The dish photography below was **generated, not photographed** — the source\n` +
      `files were named \`ChatGPT Image ...\`. It is used because it depicts this\n` +
      `shop's actual products (the kraft tubs match the client's own footage), which\n` +
      `beats stock photographs of someone else's food. It is **not** a photograph of\n` +
      `the real counter, and should be replaced as soon as real product shots exist.\n\n` +
      `| Asset | Source file |\n|---|---|\n` +
      ai.map(([s, c]) => `| \`${s}\` | \`${c.file}\` |`).join('\n') +
      `\n`
  );

  console.log(`\n✓ ${Object.keys(alts).length} image sets, logo, favicons, CREDITS.md.`);
}

main().catch((err) => {
  console.error('✗ image processing failed:', err);
  process.exit(1);
});
