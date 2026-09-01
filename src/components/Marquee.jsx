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
 * the ticker up, scrolling up reverses it. It is the cheapest way to make a page
 * feel physically connected to the input, and it costs one ScrollTrigger and a
 * `timeScale` write.
 *
 * Under reduced motion the track stops and renders as a static row — a marquee
 * is precisely the continuous motion that setting exists for.
 */
export default function Marquee({ words = MARQUEE_WORDS, className = '' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return undefined;

    const loop = gsap.to(track, { xPercent: -50, duration: 34, ease: 'none', repeat: -1 });

    let direction = 1;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        // `getVelocity` is px/s and spikes into the thousands on a flick;
        // clamped so a hard scroll does not turn the words into a blur.
        const v = self.getVelocity();
        if (v !== 0) direction = v > 0 ? 1 : -1;
        const boost = Math.min(Math.abs(v) / 280, 4);
        gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.4, overwrite: true });
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

  /**
   * The separator is drawn, not typed.
   *
   * It was `✳` (U+2733). That codepoint has `Emoji=Yes`, so although its
   * *default* presentation is text, phones resolve it from the system colour
   * font — Noto Color Emoji on Android, Apple Color Emoji on iOS — and it
   * rendered as a **green emoji tile** on real devices. Desktop Chrome on
   * Windows picks Segoe UI Symbol and shows the intended glyph, which is exactly
   * why it survived every check: the bug is invisible on the platform the tests
   * run on.
   *
   * `U+FE0E` would force text presentation, but it depends on the font stack
   * honouring it. An inline SVG has no font dependency at all and takes
   * `currentColor`, so it is identical on every device by construction.
   */
  const star = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0 fill-current text-accent md:h-4 md:w-4"
    >
      <path d="M12 0l1.9 8.2L22 6.3l-5.5 6 5.5 6-8.1-1.9L12 24l-1.9-8.2L2 17.7l5.5-6-5.5-6 8.1 1.9z" />
    </svg>
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-display text-3xl text-ink md:text-5xl">
            {word}
          </span>
          {star}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`block-cacao relative overflow-hidden py-8 ${className}`}>
      {/* The track is duplicated for the loop, so the second copy is hidden from
          assistive tech — otherwise every phrase is announced twice. */}
      <div ref={trackRef} className="marquee-track">
        {row}
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {row.props.children}
        </div>
      </div>

      {/* Edge fades, so words enter and leave rather than being clipped. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#5f1f0f] to-transparent dark:from-[#6d2512]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#5f1f0f] to-transparent dark:from-[#6d2512]" />
    </div>
  );
}
