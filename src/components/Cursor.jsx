import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * The custom cursor: a small gold dot with a trailing ring.
 *
 * Mounted only for devices that actually have a pointer. A custom cursor on a
 * touchscreen is invisible dead weight, and on a hybrid laptop it should appear
 * the moment a mouse is used — hence the `(pointer: fine)` query rather than a
 * one-time touch sniff.
 *
 * The native cursor is *not* hidden globally. Hiding it and then failing to draw
 * a replacement — a JS error, a slow chunk — leaves a page with no pointer at
 * all, which is close to unusable. It is hidden by this component, on mount,
 * only once its own elements are in the DOM.
 *
 * Position is written with `gsap.quickTo`, which keeps one interpolating tween
 * alive per axis instead of allocating a tween per mousemove.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    document.documentElement.classList.add('has-custom-cursor');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // The dot tracks tightly; the ring lags, which is what reads as weight.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

    let shown = false;

    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.4 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      // Feeds the gold spotlight that follows the pointer across the hero.
      document.documentElement.style.setProperty('--px', `${e.clientX}px`);
      document.documentElement.style.setProperty('--py', `${e.clientY}px`);
    };

    // Interactive targets grow the ring. Delegation rather than per-element
    // listeners, so cards rendered later are covered without re-binding.
    const INTERACTIVE = 'a, button, [data-cursor="grow"], input, textarea, select';

    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 2.4, borderColor: 'rgba(242,202,80,0.9)', duration: 0.4 });
        gsap.to(dot, { scale: 0, duration: 0.3 });
      }
    };

    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(242,202,80,0.35)', duration: 0.4 });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      }
    };

    // Leaving the window should take the cursor with it, or it freezes at the
    // last known point and looks stuck.
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 });

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-gold/35"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

/**
 * A button that leans toward the pointer when it comes close.
 *
 * The magnetism is capped at `strength` px and released on leave with a slight
 * elastic ease. Applied to primary CTAs only — on every link it stops reading as
 * a special affordance and starts reading as a page that will not sit still.
 */
export function Magnetic({ children, strength = 18, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      xTo(Math.max(-1, Math.min(1, dx)) * strength);
      yTo(Math.max(-1, Math.min(1, dy)) * strength);
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
