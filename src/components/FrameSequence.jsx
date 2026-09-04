import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { loadSequence, pickTier, warmWindow, disposeFrames, TIER_WIDTH } from '../lib/frameLoader';
import { SEQUENCES } from '../data/sequences';

/**
 * The bars either side of a letterboxed frame. Matches `--film-ground`, the
 * section's own background, so on this dark vignetted footage they read as the
 * frame's surround rather than as empty canvas.
 */
const LETTERBOX = '#100C09';

/**
 * A scroll-scrubbed film sequence painted to a canvas.
 *
 * The section is `N * 100vh` with a sticky viewport inside it; scroll progress
 * across that height maps to a frame index. Four things keep it smooth:
 *
 * **The frame index is animated, not assigned.** Mapping scroll position
 * straight onto a frame number means the canvas only changes when a scroll event
 * fires — a fast flick skips a dozen frames, a slow drag quantises visibly.
 * ScrollTrigger scrubs a tweened `{ frame }` object instead and the canvas
 * redraws from that, so it interpolates between scroll positions.
 *
 * **The backing store is capped at the source resolution.** A 1440px-wide canvas
 * at DPR 2 is 2880px of fill rate per frame — for a 1280px master, which cannot
 * supply that detail. Backing it beyond the source buys nothing and costs the
 * whole difference on every single frame. This was a real part of the stutter.
 *
 * **Decoded frames are windowed**, not all retained — see frameLoader.js, which
 * is where the 988 MB of held RGBA in the first build came from.
 *
 * **Drawing is decoupled from React.** Frame state lives in refs and paints in a
 * `gsap.ticker` callback; routing 280 frames through `setState` would schedule
 * 280 reconciliations a second for a canvas React does not own.
 *
 * Frames that have not arrived are not blanks — `paint` walks back to the
 * nearest loaded frame, so a partly-loaded sequence scrubs coarsely rather than
 * flickering to black.
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
  const backdropRef = useRef(null);
  const framesRef = useRef([]);
  const stateRef = useRef({ frame: 1, drawn: -1, warmed: -1 });
  const [loaded, setLoaded] = useState(0);
  // Drives the LQIP's removal. Keeping a blurred, upscaled full-screen image
  // permanently under the canvas means compositing a 40px blur on every frame
  // for the whole section — pure cost once a real frame is up.
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    if (!meta) return undefined;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    /**
     * The ambient backdrop's context, at a fixed 32x32.
     *
     * Its whole output is blurred past recognition by CSS, so resolution is
     * wasted on it — the point is the colour, not the detail. Fixed size means
     * it never participates in resize, and one 32x32 drawImage per frame is
     * close to free.
     */
    const backdrop = backdropRef.current;
    const bctx = backdrop?.getContext('2d', { alpha: false }) ?? null;
    if (backdrop) {
      backdrop.width = 32;
      backdrop.height = 32;
    }
    const controller = new AbortController();
    const frames = framesRef.current;
    const reduced = prefersReducedMotion();
    const tier = pickTier();
    const sourceWidth = TIER_WIDTH[tier];

    function resize() {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Never back the canvas wider than the frames can fill. `cover` may crop
      // horizontally, so allow a little headroom for the vertical-fit case.
      const maxWidth = sourceWidth * 1.15;
      const scale = Math.min(dpr, Math.max(1, maxWidth / w));
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      stateRef.current.drawn = -1; // force a repaint at the new size
      paint();
    }

    /** Draws the nearest available frame at or before `frame`, object-fit style. */
    function paint() {
      const target = Math.round(stateRef.current.frame);
      if (target === stateRef.current.drawn) return;

      let index = Math.min(Math.max(target, 1), meta.count);
      while (index > 1 && !frames[index]) index -= 1;
      const img = frames[index];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;

      /**
       * Plain cover — and it crops almost nothing, because the *asset* already
       * matches the box.
       *
       * An earlier version letterboxed here instead, capping how much cover was
       * allowed to crop. That treated the symptom: the real fix is to stop asking
       * a 16:9 frame to fill a 0.46-aspect screen at all. `pickTier` now serves a
       * 4:5 re-framed tier to portrait viewports and the canvas below is a square
       * block on those sizes, so source and box agree and there is nothing to
       * crop or to letterbox.
       */
      const cover = Math.max(cw / iw, ch / ih);
      const contain = Math.min(cw / iw, ch / ih);
      const scale = fit === 'contain' ? contain : cover;

      const dw = iw * scale;
      const dh = ih * scale;

      // Letterbox bars have to be painted: the canvas is opaque, so without this
      // the previous frame stays visible in the margins.
      if (dw < cw || dh < ch) {
        ctx.fillStyle = LETTERBOX;
        ctx.fillRect(0, 0, cw, ch);
      }

      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      // Same frame, cover-fitted into the tiny backdrop. Drawn from the centre
      // so the glow tracks the subject's colour rather than the frame's edges.
      if (bctx) {
        const bs = Math.max(32 / iw, 32 / ih);
        const bw = iw * bs;
        const bh = ih * bs;
        bctx.drawImage(img, (32 - bw) / 2, (32 - bh) / 2, bw, bh);
      }

      stateRef.current.drawn = target;
      if (!painted) setPainted(true);

      // Re-warm only when the playhead has actually travelled, not every frame.
      if (Math.abs(target - stateRef.current.warmed) > 8) {
        stateRef.current.warmed = target;
        warmWindow(frames, target, meta.count);
      }
    }

    resize();

    // Priority order: frame 1, then a coarse spread across the sequence, so an
    // early scroll always lands on something instead of holding frame 1 until
    // the pool catches up.
    const spread = Array.from({ length: 12 }, (_, i) =>
      Math.max(1, Math.round((i / 11) * meta.count))
    );

    loadSequence({
      key: sequence,
      count: meta.count,
      tier,
      priority: [1, ...spread],
      signal: controller.signal,
      onFrame: (index, img) => {
        frames[index] = img;
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
          // A little scrub latency is what gives the film weight. Past ~1s it
          // stops feeling connected to the input.
          scrub: 0.5,
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
    // `painted` is written by this effect and must not re-run it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence, meta, fit, onProgress]);

  if (!meta) return null;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative bg-film-ground ${className}`}
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 24px LQIP, blurred up. Removed as soon as a real frame is on the
            canvas — see the note on `painted`. */}
        {!painted && (
          <img
            src={meta.lqip}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
          />
        )}

        {/* Ambient backdrop — the square block's surround on portrait.

            The block leaves bare ground above and below it. The established fix
            is a blurred, scaled copy of the frame filling that space: editors
            call it "blanking fill", YouTube ships it as Ambient Mode, pulling
            colour out of the frame and diffusing it outward. It turns dead bars
            into a glow that belongs to the shot.

            Deliberately tiny — 32px, upscaled by CSS. The output is blurred to
            nothing anyway, so a 32x32 drawImage plus one GPU-composited CSS
            filter costs almost nothing per frame, where blurring a full-screen
            canvas in 2D context would cost a great deal. Hidden from md up,
            where the film is already full-bleed and there is nothing to fill. */}
        <canvas
          ref={backdropRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-[42px] saturate-150 md:hidden"
        />

        {/* A block on portrait, full-bleed from md up.
            Apple's mobile media is roughly square rather than full viewport
            height, and that is the half of the pattern the asset alone cannot
            deliver: a 4:5 frame stretched over a 0.46-aspect screen would just
            be cropped again. */}
        <canvas
          ref={canvasRef}
          className="absolute inset-x-0 top-1/2 aspect-square h-auto w-full -translate-y-1/2 md:inset-0 md:top-0 md:aspect-auto md:h-full md:translate-y-0"
          // Decorative: the section's own copy carries the meaning.
          role="img"
          aria-label={meta.label}
        />

        <div className="cinema-scrim pointer-events-none absolute inset-0" />

        {children}

        {/* A hairline progress rule, not a spinner. Fades out once complete. */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-px bg-film-accent transition-opacity duration-1000"
          style={{ width: `${loaded * 100}%`, opacity: loaded >= 1 ? 0 : 1 }}
        />
      </div>
    </section>
  );
}
