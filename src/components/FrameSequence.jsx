import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { loadSequence, pickTier, disposeFrames } from '../lib/frameLoader';
import { SEQUENCES } from '../data/sequences';

/**
 * A scroll-scrubbed film sequence painted to a canvas.
 *
 * The section is `height: N * 100vh` with a sticky viewport inside it; scroll
 * progress across that height maps to a frame index. Two details separate this
 * from the version that stutters:
 *
 * **The frame index is animated, not assigned.** Mapping scroll position
 * straight onto a frame number means the canvas only ever changes when a scroll
 * event fires, so a fast flick skips a dozen frames and a slow drag quantises
 * visibly. Instead ScrollTrigger scrubs a tweened `{ frame }` object and the
 * canvas redraws from that, which interpolates through the frames between two
 * scroll positions and gives the sequence its own momentum.
 *
 * **Drawing is decoupled from React.** Frame state lives in refs and paints in a
 * `gsap.ticker` callback. Routing 280 frames through `setState` would schedule
 * 280 reconciliations a second for a canvas React does not own.
 *
 * Frames that have not arrived yet are not blanks — `paint` walks backwards to
 * the nearest loaded frame, so a partly-loaded sequence scrubs coarsely rather
 * than flickering to black.
 */
export default function FrameSequence({
  id,
  sequence,
  scrollLength = 4,
  children,
  className = '',
  fit = 'cover',
  onProgress,
}) {
  const meta = SEQUENCES[sequence];
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const stateRef = useRef({ frame: 1, drawn: -1 });
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!meta) return undefined;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const controller = new AbortController();
    const frames = framesRef.current;
    const reduced = prefersReducedMotion();

    /** Backs the canvas at device pixels, capped at 2x — 3x costs fill rate for
     *  no visible gain on food photography this soft. */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      stateRef.current.drawn = -1; // force a repaint at the new size
      paint();
    }

    /** Draws the nearest available frame at or before `frame`, object-fit style. */
    function paint() {
      const target = Math.round(stateRef.current.frame);
      if (target === stateRef.current.drawn) return;

      let index = Math.min(Math.max(target, 1), meta.count);
      while (index > 1 && !frames[index]) index -= 1;
      const bitmap = frames[index];
      if (!bitmap) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = bitmap.width;
      const ih = bitmap.height;
      const scale = fit === 'contain' ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;

      ctx.drawImage(bitmap, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      stateRef.current.drawn = target;
    }

    resize();

    // Priority order: the frame the poster shows, the first frame, then a coarse
    // spread across the whole sequence. The spread means an early scroll always
    // has *something* to land on instead of holding frame 1 until the pool
    // catches up.
    const spread = Array.from({ length: 12 }, (_, i) =>
      Math.max(1, Math.round((i / 11) * meta.count))
    );

    loadSequence({
      key: sequence,
      count: meta.count,
      tier: pickTier(),
      priority: [1, ...spread],
      signal: controller.signal,
      onFrame: (index, bitmap) => {
        frames[index] = bitmap;
        // The very first frames should appear immediately rather than waiting
        // for a scroll event to invalidate the canvas.
        if (index <= 2 || stateRef.current.drawn < 0) {
          stateRef.current.drawn = -1;
          paint();
        }
      },
      onProgress: (p) => {
        setLoaded(p);
        onProgress?.(p);
      },
    });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let trigger;
    let ticker;

    if (reduced) {
      // No scrub. The sequence becomes a still of its most meaningful frame,
      // which is what `poster` already points at.
      stateRef.current.frame = meta.count;
    } else {
      ticker = () => paint();
      gsap.ticker.add(ticker);

      trigger = gsap.to(stateRef.current, {
        frame: meta.count,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          // A little scrub latency is what turns a 1:1 mapping into something
          // with weight. Above ~1s it starts to feel disconnected from input.
          scrub: 0.6,
        },
      });
    }

    return () => {
      controller.abort();
      ro.disconnect();
      if (ticker) gsap.ticker.remove(ticker);
      trigger?.scrollTrigger?.kill();
      trigger?.kill();
      disposeFrames(frames);
      framesRef.current = [];
    };
  }, [sequence, meta, fit, onProgress]);

  if (!meta) return null;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* The LQIP sits under the canvas so the section is never a black hole
            during the first decode. It is 24px wide and blurred to nothing. */}
        <img
          src={meta.lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl"
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          // The canvas is decorative; the section's own copy carries the meaning.
          role="img"
          aria-label={meta.label}
        />

        <div className="cinema-scrim pointer-events-none absolute inset-0" />

        {children}

        {/* A hairline progress rule, not a spinner. Disappears once loaded. */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-px bg-gold/60 transition-opacity duration-1000"
          style={{ width: `${loaded * 100}%`, opacity: loaded >= 1 ? 0 : 1 }}
        />
      </div>
    </section>
  );
}
