import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { MARQUEE_WORDS } from '../data/menu';

/**
 * The infinite ticker between acts.
 *
 * The loop is seamless because the track holds the word list twice and animates
 * to exactly -50% — no measuring, no resize handler, correct at every width.
 *
 * The scroll-velocity coupling is the part worth the JS: scrolling down speeds
 * the ticker up, scrolling up reverses it. It is the cheapest possible way to
 * make a page feel physically connected to the input, and it costs one
 * ScrollTrigger and a `timeScale` write.
 *
 * Under reduced motion the track stops entirely and renders as a static row —
 * a marquee is exactly the kind of continuous motion that setting exists for.
 */
export default function Marquee({ words = MARQUEE_WORDS, className = '' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return undefined;

    const loop = gsap.to(track, {
      xPercent: -50,
      duration: 32,
      ease: 'none',
      repeat: -1,
    });

    let direction = 1;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        // `getVelocity` is px/s and can spike into the thousands on a flick;
        // clamped so a hard scroll does not turn the words into a blur.
        const v = self.getVelocity();
        if (v !== 0) direction = v > 0 ? 1 : -1;
        const boost = Math.min(Math.abs(v) / 260, 5);
        gsap.to(loop, {
          timeScale: direction * (1 + boost),
          duration: 0.4,
          overwrite: true,
        });
      },
    });

    // Settle back to a walking pace once the scroll stops.
    const idle = gsap.ticker.add(() => {
      if (Math.abs(loop.timeScale()) > 1.02) {
        loop.timeScale(gsap.utils.interpolate(loop.timeScale(), direction, 0.03));
      }
    });

    return () => {
      st.kill();
      gsap.ticker.remove(idle);
      loop.kill();
    };
  }, []);

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="whitespace-nowrap px-8 font-display text-4xl text-cream/80 md:text-6xl">
            {word}
          </span>
          <span aria-hidden="true" className="text-2xl text-gold">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden border-y border-outline-variant/40 bg-ink py-10 ${className}`}
    >
      {/* The track is duplicated for the loop, so the second copy is hidden from
          assistive tech — otherwise every phrase is announced twice. */}
      <div ref={trackRef} className="marquee-track">
        {row}
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {row.props.children}
        </div>
      </div>

      {/* Edge fades, so words enter and leave rather than being clipped. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
