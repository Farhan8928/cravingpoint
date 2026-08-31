/**
 * A responsive `<img>` over the WebP sets that scripts/process-frames.mjs emits.
 *
 * Every asset exists at up to four widths; this picks between them with a plain
 * `srcset` and lets the browser decide, which beats any width heuristic we could
 * write here because only the browser knows the DPR, the layout width and
 * whether the user asked to save data.
 *
 * `width`/`height` are required rather than optional. Without an intrinsic ratio
 * the reveal animations run against a box that resizes when the image lands,
 * which is both a layout shift and a visibly wrong animation.
 */
const WIDTHS = [480, 800, 1200, 2000];

export default function Img({
  slug,
  alt,
  width,
  height,
  sizes = '100vw',
  className = '',
  priority = false,
  max = 2000,
}) {
  const available = WIDTHS.filter((w) => w <= max);
  const srcSet = available.map((w) => `/images/${slug}-${w}.webp ${w}w`).join(', ');
  const fallback = `/images/${slug}-${available[available.length - 1]}.webp`;

  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
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
