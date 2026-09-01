/**
 * Loads a WebP frame sequence for canvas scrubbing.
 *
 * ## Why this does not use createImageBitmap
 *
 * The obvious implementation decodes every frame to an `ImageBitmap` and keeps
 * the array around. It is also the reason the first build stuttered. An
 * ImageBitmap is *uncompressed* RGBA that the page holds until it is explicitly
 * closed, so the hero sequence alone was:
 *
 *     281 frames x 1280 x 720 x 4 bytes = 988 MB
 *
 * — held live, on top of the craft sequence's 531 MB. Long before that fills
 * memory the browser is fighting to keep it, and the symptom is exactly what it
 * looked like: a scrub that hitches under load.
 *
 * `HTMLImageElement` inverts the ownership. The page holds the compressed WebP
 * (9.5 MB for the whole hero sequence) and the *browser* owns the decoded
 * bitmaps, evicting them under pressure the way it does for any other image on
 * a page. Memory stops being our problem.
 *
 * The cost of that trade is that an evicted frame decodes synchronously inside
 * `drawImage`. `warmWindow()` below buys it back: it keeps a sliding window of
 * frames around the playhead explicitly decoded, so the frames actually about to
 * be drawn are always ready and only far-away ones are ever allowed to lapse.
 *
 * Loading is also pooled and ordered. 300 parallel requests saturate the
 * connection and land in whatever order the network likes, which is usually not
 * the order they are needed in.
 */

/** Concurrency high enough to saturate a good link, low enough to stay ordered. */
const POOL = 6;

/** Frames either side of the playhead kept explicitly decoded. */
const WARM_RADIUS = 24;

/**
 * Chooses a tier from viewport width and DPR.
 *
 * Not a media query: a 700px-wide window on a 2x desktop display still wants the
 * larger tier, because the canvas is backed at device pixels.
 */
export function pickTier() {
  if (typeof window === 'undefined') return 'w720';
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // Saving data is an explicit request; it outranks the width heuristic.
  if (navigator.connection?.saveData) return 'w720';
  return window.innerWidth * dpr > 1100 ? 'w1280' : 'w720';
}

/** The pixel width each tier decodes to. The masters are 720p; this is the ceiling. */
export const TIER_WIDTH = { w1280: 1280, w720: 720 };

const pad = (n) => String(n).padStart(4, '0');

export const frameUrl = (key, tier, index) => `/frames/${key}/${tier}/${pad(index)}.webp`;

/**
 * Loads a sequence into a sparse array of decoded `<img>` elements.
 *
 * @param {object}      opts
 * @param {string}      opts.key        sequence key, e.g. 'hero'
 * @param {number}      opts.count      frame count from the generated manifest
 * @param {string}      opts.tier       'w1440' | 'w720'
 * @param {number[]}    opts.priority   1-based frames to fetch before the rest
 * @param {Function}    opts.onFrame    (index, img) as each lands
 * @param {Function}    opts.onProgress (loaded / total) 0..1
 * @param {AbortSignal} opts.signal
 */
export async function loadSequence({
  key,
  count,
  tier,
  priority = [1],
  onFrame,
  onProgress,
  signal,
}) {
  const order = [...new Set([...priority, ...Array.from({ length: count }, (_, i) => i + 1)])];
  let done = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < order.length) {
      if (signal?.aborted) return;
      const index = order[cursor];
      cursor += 1;

      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(key, tier, index);

      try {
        // Resolves once the bitmap is ready, so the first paint of this frame
        // never pays the decode. If it fails the frame is skipped, not fatal —
        // the scrubber holds the previous frame and keeps going.
        await img.decode();
        onFrame?.(index, img);
      } catch {
        /* skipped */
      }

      done += 1;
      onProgress?.(done / order.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(POOL, order.length) }, worker));
}

/**
 * Keeps frames near the playhead decoded and lets distant ones lapse.
 *
 * `decode()` on an already-decoded image is close to free and, importantly,
 * refreshes its position in the browser's cache — so calling this as the
 * playhead moves is what stops the browser from evicting the frames that are
 * about to be drawn.
 */
export function warmWindow(frames, center, count) {
  const from = Math.max(1, center - WARM_RADIUS);
  const to = Math.min(count, center + WARM_RADIUS);
  for (let i = from; i <= to; i += 1) {
    const img = frames[i];
    // `decode()` rejects on a detached or failed image; nothing here needs to
    // know about that.
    if (img) img.decode?.().catch(() => {});
  }
}

/**
 * Drops references so the browser can reclaim everything.
 *
 * With `<img>` there is no `close()` to call — clearing `src` detaches the
 * element from its decoded data and releasing the array does the rest.
 */
export function disposeFrames(frames) {
  for (const img of frames) {
    if (img) img.src = '';
  }
}
