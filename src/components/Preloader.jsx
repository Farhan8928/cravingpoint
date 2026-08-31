import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, getLenis } from '../lib/motion';
import { BRAND } from '../data/brand';

/**
 * The opening curtain.
 *
 * A preloader is only justified if it is doing work. This one is: the hero
 * cannot scrub until its first frames have decoded, and a hero that hitches on
 * the first scroll is worse than three seconds of held black. So the curtain
 * waits on real progress from the hero sequence — not a fake timer — and the
 * counter shows what has actually landed.
 *
 * Two guards keep it from becoming the problem it solves:
 *
 *   - a hard 6s ceiling. On a bad connection the site opens anyway and the
 *     sequence fills in behind it. Never hold the page hostage to an asset.
 *   - scroll is locked while it is up, and unlocked in the same place it is
 *     locked, including on the timeout path.
 *
 * Skipped entirely under reduced motion, where it is pure theatre.
 */
export default function Preloader({ progress = 0, onDone }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const [display, setDisplay] = useState(0);
  const finished = useRef(false);

  // The counter eases toward real progress instead of snapping to it, so a
  // sequence that arrives in two big chunks still reads as a smooth climb.
  useEffect(() => {
    const target = Math.round(Math.min(progress, 1) * 100);
    const proxy = { v: display };
    const tween = gsap.to(proxy, {
      v: target,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => setDisplay(Math.round(proxy.v)),
    });
    return () => tween.kill();
    // `display` is intentionally not a dependency: including it restarts the
    // tween on every frame it sets, which is an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      root.style.display = 'none';
      onDone?.();
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    getLenis()?.stop();

    let timeout;

    const finish = () => {
      if (finished.current) return;
      finished.current = true;

      gsap
        .timeline({
          onComplete: () => {
            root.style.display = 'none';
            document.body.style.overflow = '';
            getLenis()?.start();
            onDone?.();
          },
        })
        .to([countRef.current, barRef.current], {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
        })
        // The curtain lifts as a clip rather than a fade, so the hero is
        // revealed from the bottom edge instead of dissolving through grey.
        .to(root, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.1,
          ease: 'power4.inOut',
        }, '-=0.1');
    };

    // Real completion, or the ceiling — whichever comes first.
    if (progress >= 0.999) timeout = setTimeout(finish, 350);
    else timeout = setTimeout(finish, 6000);

    return () => {
      clearTimeout(timeout);
      // If this unmounts mid-flight the page must not be left unscrollable.
      document.body.style.overflow = '';
      getLenis()?.start();
    };
  }, [progress, onDone]);

  return (
    <div
      ref={rootRef}
      // aria-hidden: the counter is decorative and would otherwise be announced
      // as a stream of changing numbers.
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-deep"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <div ref={countRef} className="flex flex-col items-center gap-8">
        <div className="text-center">
          <span className="font-display text-display-md text-cream">{BRAND.name}</span>
          <span className="font-display text-display-md text-gold">{BRAND.suffix}</span>
        </div>
        <span className="eyebrow text-cream/40">{BRAND.tagline}</span>
      </div>

      <div className="absolute bottom-16 left-gutter right-gutter">
        <div ref={barRef} className="flex items-end justify-between">
          <span className="font-display text-5xl tabular-nums text-cream/80">
            {String(display).padStart(3, '0')}
          </span>
          <span className="eyebrow text-cream/30">Loading the film</span>
        </div>
        <div className="mt-4 h-px w-full bg-white/10">
          <div
            className="h-full bg-gold transition-[width] duration-300 ease-lux"
            style={{ width: `${display}%` }}
          />
        </div>
      </div>
    </div>
  );
}
