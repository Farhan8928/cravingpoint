import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, getLenis } from '../lib/motion';

/**
 * The opening curtain.
 *
 * A preloader is only justified if it is doing work. This one is: the hero
 * cannot scrub until its first frames have decoded, and a hero that hitches on
 * the first scroll is worse than two seconds of held colour. So it waits on real
 * progress from the hero sequence — not a fake timer — and the counter shows
 * what has actually landed.
 *
 * Two guards stop it becoming the problem it solves:
 *
 *   - a hard 5s ceiling. On a bad connection the site opens anyway and the
 *     sequence fills in behind it. Never hold the page hostage to an asset.
 *   - scroll is locked and unlocked in the same place, including on the timeout
 *     path and on an unmount mid-flight.
 *
 * Skipped entirely under reduced motion, where it is pure theatre.
 */
export default function Preloader({ progress = 0, onDone }) {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const [display, setDisplay] = useState(0);
  const finished = useRef(false);

  // The counter eases toward real progress rather than snapping, so a sequence
  // that arrives in two big chunks still reads as a smooth climb.
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
    // `display` is deliberately not a dependency — including it restarts the
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
        .to(innerRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' })
        // Lifts as a clip rather than a fade, so the hero is revealed from the
        // bottom edge instead of dissolving through a flat wash.
        .to(root, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power4.inOut' }, '-=0.05');
    };

    const timeout = setTimeout(finish, progress >= 0.999 ? 300 : 5000);

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
      // The counter would otherwise be announced as a stream of changing numbers.
      aria-hidden="true"
      className="fixed inset-0 z-[200] bg-ground"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      <div ref={innerRef} className="flex h-full flex-col justify-between px-gutter py-12">
        <div className="flex items-start justify-between">
          {/* The client's own mark, given room to be itself. The header keeps the
              typographic wordmark instead — the logo is a glossy 3D drawing and
              a 20px-tall version of it in a minimal rail reads as a clipart
              sticker, so each is used where it actually works. */}
          <img
            src="/images/logo-256.webp"
            alt=""
            width={96}
            height={80}
            className="h-16 w-auto md:h-20"
          />
          <span className="font-mono text-label-sm uppercase text-muted">
            Cheeta Camp, Trombay
          </span>
        </div>

        <div className="flex items-end justify-between gap-8">
          <span className="font-display text-display-lg leading-none text-ink">
            {String(display).padStart(3, '0')}
          </span>
          <span className="pb-2 text-label-sm uppercase text-muted">Loading the film</span>
        </div>

        <div className="h-px w-full bg-line">
          <div
            className="h-full bg-accent transition-[width] duration-300 ease-lux"
            style={{ width: `${display}%` }}
          />
        </div>
      </div>
    </div>
  );
}
