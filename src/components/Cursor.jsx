import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * The custom cursor: a small accent dot with a trailing ring.
 *
 * Mounted only where there is a real pointer. A custom cursor on a touchscreen
 * is invisible dead weight, and on a hybrid laptop it should appear the moment a
 * mouse is used — hence `(pointer: fine)` rather than a one-time touch sniff.
 *
 * The native cursor is *not* hidden globally. Hiding it and then failing to draw
 * a replacement — a JS error, a slow chunk — leaves a page with no pointer at
 * all. It is hidden by this component, on mount, once its own elements exist.
 *
 * Position is written with `gsap.quickTo`, which keeps one interpolating tween
 * per axis alive instead of allocating a tween per mousemove. An earlier version
 * also drove a full-screen radial-gradient spotlight from CSS variables — that
 * repainted the entire viewport on every pointer move and was a measurable part
 * of why scrolling felt heavy. Transform-only from here.
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

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // The dot tracks tightly; the ring lags, which is what reads as weight.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

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
    };

    // Delegation rather than per-element listeners, so anything rendered later
    // is covered without re-binding.
    const INTERACTIVE = 'a, button, [data-cursor="grow"], input, textarea, select';

    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 2.2, duration: 0.4 });
        gsap.to(dot, { scale: 0, duration: 0.3 });
      }
    };
    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1, duration: 0.4 });
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
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {/* mix-blend-difference keeps both marks visible over paper and over the
          film without needing to know which is underneath. */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border border-accent mix-blend-difference"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{ opacity: 0 }}
      />
    </div>
  );
}

/**
 * A button that leans toward the pointer when it comes close.
 *
 * Capped at `strength` px and released with a slight elastic ease. Applied to
 * primary CTAs only — on every link it stops reading as a special affordance and
 * starts reading as a page that will not sit still.
 */
export function Magnetic({ children, strength = 16, className = '' }) {
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
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });

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
