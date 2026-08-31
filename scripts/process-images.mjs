/**
 * Downloads the placeholder dish photography and bakes it into WebP sets.
 *
 * ⚠ These are Unsplash stand-ins, not Craving Point's food. They exist so the
 * layout can be judged with real photographs in it instead of grey boxes, and
 * they are meant to be swapped for the shop's own shots. Everything needed to do
 * that is in `SOURCES` below: replace a `photo` id with a local path and the
 * rest of the pipeline is unchanged.
 *
 * Attribution for every image is written to CREDITS.md, which the Unsplash
 * licence asks for and which also serves as the swap-out checklist.
 *
 * Downloads are cached in `.cache/photos/` so re-running is free and works
 * offline. Delete that folder to re-fetch.
 *
 * Run with: npm run assets:images
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const CACHE = path.resolve('.cache/photos');
const OUT = path.resolve('public/images');

/**
 * 4:5 portrait for every dish.
 *
 * A single ratio across the whole menu is what makes a list of ten photographs
 * from ten different photographers read as one set. Mixing landscape and
 * portrait here would look like a scrape, which is exactly what it is.
 */
const RATIO = { w: 1000, h: 1250 };
const WIDTHS = [480, 800, 1200];

const SOURCES = {
  'dish-brownie': {
    photo: 'photo-1606313564200-e75d5e30476c',
    by: 'Pushpak Dsilva',
    at: 'https://unsplash.com/@pushpak88',
    alt: 'Dark chocolate brownies stacked with chocolate sauce poured over them',
  },
  'dish-waffle': {
    photo: 'photo-1721078917681-40f74d16d7b7',
    by: 'Manu Camargo',
    at: 'https://unsplash.com/@manucmg',
    alt: 'Belgian waffles on a plate under a heavy chocolate sauce drizzle',
  },
  'dish-molten-jar': {
    photo: 'photo-1648857529887-28d03f6774ea',
    by: 'Céline Druguet',
    at: 'https://unsplash.com/@celala',
    alt: 'Layered chocolate and cream dessert served in a glass jar with a spoon',
  },
  'dish-sundae': {
    photo: 'photo-1695886855588-47117bca2fe6',
    by: 'Jesus Arango',
    at: 'https://unsplash.com/@txus111m',
    alt: 'Tall sundae glass with vanilla ice cream, chocolate sauce and wafer rolls',
  },
  'dish-pancakes': {
    photo: 'photo-1650134973809-d8c3a2da59ba',
    by: 'Amber Fisher',
    at: 'https://unsplash.com/@lindsaysworld',
    alt: 'A tall stack of buttermilk pancakes with syrup being poured over them',
  },
  'dish-petitfours': {
    photo: 'photo-1526081715791-7c538f86060e',
    by: 'Monique Carrati',
    at: 'https://unsplash.com/@moniquecarrati',
    alt: 'An overhead box of assorted chocolate truffles and pralines',
  },
  'dish-wrap': {
    photo: 'photo-1529006557810-274b9b2fc783',
    by: 'Alexander Mils',
    at: 'https://unsplash.com/@alexandermils',
    alt: 'A grilled chicken wrap cut open, showing meat and red onion',
  },
  'dish-periperi': {
    photo: 'photo-1727280376746-b89107a5b0df',
    by: 'Madhurima Basak',
    at: 'https://unsplash.com/@bskmadhu_15',
    alt: 'Charred herb-flecked grilled chicken pieces on a dark tray',
  },
  'dish-cheesemelt': {
    photo: 'photo-1623405252454-c7d7da3cb7fe',
    by: 'Khalid Boutchich',
    at: 'https://unsplash.com/@khalidboutchich',
    alt: 'A toasted flatbread lifted to show a long stretch of melted cheese',
  },
  'dish-fries': {
    photo: 'photo-1700835880456-2e5519fa54d6',
    by: 'Jonathan Borba',
    at: 'https://unsplash.com/@jonathanborba',
    alt: 'A dark bowl of loaded fries with cheese sauce and spring onion',
  },
};

/** Fetches once and caches. `w=1600` is ample for a 1200px-wide output. */
async function fetchPhoto(slug, id) {
  const file = path.join(CACHE, `${slug}.jpg`);
  if (fs.existsSync(file) && fs.statSync(file).size > 10000) return file;

  const url = `https://images.unsplash.com/${id}?w=1600&q=85&fm=jpg&fit=max`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${slug}`);
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(file));
  return file;
}

async function main() {
  fs.mkdirSync(CACHE, { recursive: true });
  fs.mkdirSync(OUT, { recursive: true });

  const alts = {};
  let made = 0;

  for (const [slug, cfg] of Object.entries(SOURCES)) {
    const src = await fetchPhoto(slug, cfg.photo);

    for (const w of WIDTHS) {
      const h = Math.round((RATIO.h / RATIO.w) * w);
      await sharp(src)
        // `attention` picks the crop around the most salient region rather than
        // the geometric centre — on a plated dish that is the food, not the rim.
        .resize(w, h, { fit: 'cover', position: sharp.strategy.attention })
        .webp({ quality: 80, effort: 5 })
        .toFile(path.join(OUT, `${slug}-${w}.webp`));
      made += 1;
    }

    alts[slug] = cfg.alt;
    console.log(`ok  ${slug}`);
  }

  // Alt text lives with the image, not with the menu copy — the two are edited
  // at different times by different people.
  fs.writeFileSync(
    path.resolve('src/data/alts.js'),
    `// AUTO-GENERATED by scripts/process-images.mjs — do not edit by hand.\n` +
      `export const ALTS = ${JSON.stringify(alts, null, 2)};\n`
  );

  const credits = Object.entries(SOURCES)
    .map(([slug, c]) => `| \`${slug}\` | [${c.by}](${c.at}) | \`${c.photo}\` |`)
    .join('\n');

  fs.writeFileSync(
    path.resolve('CREDITS.md'),
    `# Image credits\n\n` +
      `⚠ **These are placeholders.** Every photograph below is an Unsplash\n` +
      `stand-in, not Craving Point's own food. Replace them with the shop's\n` +
      `photography before launch — see \`scripts/process-images.mjs\`.\n\n` +
      `Used under the [Unsplash License](https://unsplash.com/license).\n\n` +
      `| Asset | Photographer | Unsplash ID |\n|---|---|---|\n${credits}\n\n` +
      `The two film sequences and the stills pulled from them (\`still-*\`,\n` +
      `\`poster-*\`) are the client's own footage.\n`
  );

  console.log(`\n✓ ${made} webp files, CREDITS.md written.`);
}

main().catch((err) => {
  console.error('✗ image processing failed:', err);
  process.exit(1);
});
