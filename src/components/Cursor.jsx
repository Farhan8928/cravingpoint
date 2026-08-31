import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * The cursor: a drop of chocolate.
 *
 * A dot with a trailing ring is the default custom cursor and reads as one. This
 * one is built from the brand instead: a blob carrying the signature gradient
 * that **squashes and stretches along its direction of travel**, so moving fast
 * pulls it into a teardrop and stopping lets it settle back into a round drop.
 * On a site whose hero is chocolate being poured, that is the one cursor that
 * could only belong here.
 *
 * The physics is deliberately cheap. Velocity comes from the gap between the
 * pointer and the blob's own lagging position — no event-timing maths, no
 * history buffer — and drives exactly three properties: rotation to face the
 * direction of travel, `scaleX` to stretch along it, `scaleY` to pinch across
 * it. Volume is roughly conserved (stretch one axis, squeeze the other), which
 * is what makes it read as a liquid rather than as a shape being scaled.
 *
 * It also **carries a label**. Anything with `data-cursor-label` expands the
 * blob into a pill showing that word, so the cursor tells you what a thing does
 * instead of just decorating it. That is the part that earns its place: it is a
 * genuine affordance, not an effect.
 *
 * Everything is transform-only and runs on one rAF, so the whole thing composites
 * on the GPU and never touches layout.
 */
export default function Cursor() {
  const blobRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const blob = blobRef.current;
    const label = labelRef.current;
    if (!blob) return undefined;

    // The pointer's true position, and the blob's lagging position. The gap
    // between them *is* the velocity.
    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let visible = false;
    let labelled = false;

    gsap.set(blob, { xPercent: -50, yPercent: -50, opacity: 0 });

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        gsap.to(blob, { opacity: 1, duration: 0.4 });
      }
    };

    const tick = () => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;

      // Lag factor. Lower is heavier; 0.18 is loose enough to deform visibly
      // without feeling disconnected from the hand.
      pos.x += dx * 0.18;
      pos.y += dy * 0.18;

      const speed = Math.min(Math.hypot(dx, dy), 90);

      // While labelled the blob is a pill of text — deforming it would make the
      // word unreadable, so the physics is suspended and only position tracks.
      if (labelled) {
        gsap.set(blob, { x: pos.x, y: pos.y, rotate: 0, scaleX: 1, scaleY: 1 });
        return;
      }

      const stretch = speed / 90; // 0..1
      gsap.set(blob, {
        x: pos.x,
        y: pos.y,
        // atan2 gives the heading; the blob's long axis is X, so no offset.
        rotate: speed > 1 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0,
        scaleX: 1 + stretch * 0.85,
        // Volume roughly conserved: what the drop gains in length it loses in
        // width. Without this it reads as a growing circle, not a liquid.
        scaleY: 1 - stretch * 0.42,
      });
    };

    gsap.ticker.add(tick);

    /**
     * Delegated, so anything rendered later is covered without re-binding.
     * `[data-cursor-label]` opts an element in and supplies the word; plain
     * interactive elements just get a bigger drop.
     */
    const INTERACTIVE = 'a, button, input, textarea, select, [data-cursor-label]';

    const onOver = (e) => {
      const hit = e.target.closest?.(INTERACTIVE);
      if (!hit) return;

      const text = hit.getAttribute('data-cursor-label');
      if (text) {
        labelled = true;
        label.textContent = text;
        gsap.to(blob, {
          width: label.offsetWidth + 26,
          height: 28,
          borderRadius: 999,
          duration: 0.45,
          ease: 'power3.out',
        });
        gsap.to(label, { opacity: 1, duration: 0.3, delay: 0.08 });
      } else {
        gsap.to(blob, { width: 34, height: 34, duration: 0.4, ease: 'power3.out' });
      }
    };

    /** Collapses back to the plain drop. Safe to call repeatedly. */
    function reset() {
      if (!labelled && blob.offsetWidth <= 15) return;
      labelled = false;
      gsap.to(label, { opacity: 0, duration: 0.15 });
      gsap.to(blob, { width: 14, height: 14, duration: 0.4, ease: 'power3.out' });
    }

    const onOut = (e) => {
      if (!e.target.closest?.(INTERACTIVE)) return;
      reset();
    };

    /**
     * Scroll is the case `mouseout` cannot cover.
     *
     * If the pointer does not move, the browser fires no pointer event when the
     * page scrolls out from under it — so a labelled cursor stays expanded, and
     * the label pill ends up stranded in the middle of an unrelated section
     * showing a price for a row that is no longer on screen. Re-testing what is
     * actually under the pointer on scroll is the fix; `elementFromPoint` is a
     * hit-test, not a layout read, so it is cheap enough for a scroll handler.
     */
    let lastX = -1;
    let lastY = -1;
    const trackPointer = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onScroll = () => {
      if (lastX < 0) return;
      const under = document.elementFromPoint(lastX, lastY);
      if (!under || !under.closest(INTERACTIVE)) reset();
    };

    // Leaving the window should take the cursor with it, or it freezes at the
    // last known point and looks stuck.
    const onLeave = () => gsap.to(blob, { opacity: 0, duration: 0.3 });
    const onEnter = () => gsap.to(blob, { opacity: 1, duration: 0.3 });

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousemove', trackPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', trackPointer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
      <div
        ref={blobRef}
        className="grad-102 fixed left-0 top-0 flex items-center justify-center rounded-full"
        style={{ width: 14, height: 14, opacity: 0, willChange: 'transform' }}
      >
        <span
          ref={labelRef}
          className="whitespace-nowrap px-2 font-mono text-label-sm uppercase text-white"
          style={{ opacity: 0 }}
        />
      </div>
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
