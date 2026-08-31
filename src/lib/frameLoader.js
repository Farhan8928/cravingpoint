/**
 * Loads a WebP frame sequence for canvas scrubbing.
 *
 * The naive version of this — `new Image()` per frame, all at once, draw
 * whatever has arrived — is what makes most image-sequence heroes stutter. Three
 * things are wrong with it, and this module exists to fix each one:
 *
 * 1. **Ordering.** 300 parallel requests saturate the connection and arrive in
 *    whatever order the network feels like, so the frames the user is scrolling
 *    through are often the last to land. Here loading runs in a bounded pool, in
 *    sequence order, so what arrives first is what is needed first.
 *
 * 2. **Decode cost.** `img.onload` fires before the bitmap is decoded; the
 *    decode then happens synchronously inside `drawImage`, on the frame you can
 *    least afford it. `decode()` (and `createImageBitmap` where available) moves
 *    that work off the critical path.
 *
 * 3. **Priority.** The first frame and the poster frame decide whether the
 *    section looks broken during load, so they jump the queue.
 *
 * Nothing is retried more than once: a sequence that has lost a frame should
 * hold the previous one and keep scrubbing, never blank the canvas.
 */

/** Concurrency high enough to saturate a good link, low enough to stay ordered. */
const POOL = 6;

/**
 * Chooses a tier from viewport width and DPR.
 *
 * Deliberately not a media query: a 700px-wide window on a 2x desktop display
 * still wants the 1440 tier, because the canvas is backed at device pixels.
 */
export function pickTier() {
  if (typeof window === 'undefined') return 'w720';
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const effective = window.innerWidth * dpr;
  // Saving data is an explicit user request; honour it over the width heuristic.
  if (navigator.connection?.saveData) return 'w720';
  return effective > 1100 ? 'w1440' : 'w720';
}

const pad = (n) => String(n).padStart(4, '0');

export const frameUrl = (key, tier, index) => `/frames/${key}/${tier}/${pad(index)}.webp`;

/**
 * Decodes one frame to something `drawImage` can take without stalling.
 *
 * `createImageBitmap` is the better path — it decodes off the main thread — but
 * Safari has historically been uneven with it over `fetch` responses, so a
 * decoded `HTMLImageElement` is the fallback rather than an error.
 */
async function loadFrame(url, signal) {
  if (typeof createImageBitmap === 'function') {
    try {
      const res = await fetch(url, { signal, cache: 'force-cache' });
      if (!res.ok) throw new Error(`${res.status}`);
      return await createImageBitmap(await res.blob());
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      // fall through to the Image path
    }
  }

  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  await img.decode().catch(() => {
    // A frame that will not decode is skipped, not fatal — the scrubber holds
    // the last good frame and moves on.
    throw new Error(`decode failed: ${url}`);
  });
  return img;
}

/**
 * Loads a sequence into a sparse array, newest-first for the frames on screen.
 *
 * @param {object}   opts
 * @param {string}   opts.key        sequence key, e.g. 'hero'
 * @param {number}   opts.count      frame count from the generated manifest
 * @param {string}   opts.tier       'w1440' | 'w720'
 * @param {number[]} opts.priority   1-based frames to fetch before the rest
 * @param {Function} opts.onFrame    (index, bitmap) as each lands
 * @param {Function} opts.onProgress (loaded / total) 0..1
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
      try {
        const bitmap = await loadFrame(frameUrl(key, tier, index), signal);
        onFrame?.(index, bitmap);
      } catch (err) {
        if (err.name === 'AbortError') return;
        // Swallowed on purpose — see the note at the top of the file.
      }
      done += 1;
      onProgress?.(done / order.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(POOL, order.length) }, worker));
}

/** Releases decoded bitmaps. ImageBitmaps hold GPU memory until closed. */
export function disposeFrames(frames) {
  for (const frame of frames) {
    if (frame && typeof frame.close === 'function') frame.close();
  }
}
