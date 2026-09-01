import { IMAGES } from '../data/images';
import { STILLS } from '../data/sequences';

/**
 * Two pipelines write into public/images: process-images.mjs (client photography)
 * and process-frames.mjs (stills lifted out of the footage). Both declare what
 * they wrote, and this is the single place they are read together.
 */
const ALL = { ...IMAGES, ...STILLS };

/**
 * A responsive `<img>` over the WebP sets that scripts/process-images.mjs emits.
 *
 * **The srcset comes from a generated manifest, not a hardcoded list.** The
 * previous version carried `[480, 800, 1200, 2000]` in this file and relied on
 * every call site passing a correct `max` to trim it. That is a rule nobody can
 * follow reliably, and it was already wrong: no asset had a 2000px rendition, so
 * the browser was free to pick a URL that 404s. Now the pipeline records exactly
 * which widths it wrote and this reads that back, so the two cannot drift.
 *
 * `width`/`height` come from the manifest too, which means every image reserves
 * its correct box before it loads — no layout shift, and the reveal animations
 * run against a box that will not resize underneath them.
 */
export default function Img({
  slug,
  alt,
  sizes = '100vw',
  className = '',
  priority = false,
  /** Optional ceiling, for a slot that is never displayed large (a thumbnail). */
  max,
}) {
  const meta = ALL[slug];

  if (!meta) {
    // Loud in development, invisible in production: a missing slug is a build
    // mistake, not a runtime state worth rendering a broken icon for.
    if (import.meta.env?.DEV) console.warn(`<Img> unknown slug: ${slug}`);
    return null;
  }

  const widths = max ? meta.widths.filter((w) => w <= max) : meta.widths;
  const usable = widths.length ? widths : [meta.widths[0]];
  const largest = usable[usable.length - 1];

  return (
    <img
      src={`/images/${slug}-${largest}.webp`}
      srcSet={usable.map((w) => `/images/${slug}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt ?? meta.alt ?? ''}
      width={meta.w}
      height={meta.h}
      // Above-the-fold art is fetched eagerly and at high priority; everything
      // else waits, so it never competes with the hero frame sequence.
      loading={priority ? 'eager' : 'lazy'}
      // Lowercase: React 18 does not know this attribute and passes camelCase
      // through with a warning. React 19 renames it to `fetchPriority`.
      fetchpriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  );
}
