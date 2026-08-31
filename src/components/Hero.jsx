import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, scrollTo } from '../lib/motion';
import FrameSequence from './FrameSequence';
import { BRAND } from '../data/brand';
import { Magnetic } from './Cursor';

/**
 * Act one: the hero, scrubbed across the first film.
 *
 * The sequence runs empty slate → chocolate pour → the full spread, which is the
 * brand argument in three beats, so the copy is timed against it rather than
 * sitting statically on top. The title holds through the opening (there is
 * nothing on the slate to compete with it), then lifts and fades as the food
 * arrives — by the end of the section the frame is doing the talking and the
 * type is gone.
 *
 * `scrollLength={5}` gives 281 frames five viewport heights to play across. Much
 * shorter and the pour goes by too fast to register; much longer and it starts
 * to feel like the page has stopped responding.
 */
export default function Hero({ onProgress }) {
  const copyRef = useRef(null);

  useEffect(() => {
    const el = copyRef.current;
    if (!el || prefersReducedMotion()) return undefined;

    // Entrance. Deliberately slow and late — it plays as the preloader lifts.
    const intro = gsap
      .timeline({ delay: 0.35 })
      .to(el.querySelectorAll('.split-line > span'), {
        y: '0%',
        duration: 1.4,
        stagger: 0.12,
        ease: 'power4.out',
      })
      .to(
        el.querySelectorAll('[data-fade]'),
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' },
        '-=0.9'
      );

    // Exit, tied to scroll. Pinned inside the sequence's sticky viewport, so it
    // scrolls "in place" while the film runs underneath.
    const exit = gsap.to(el, {
      opacity: 0,
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section'),
        start: 'top top',
        // Copy is gone by 40% of the sequence — the spread deserves a clear frame.
        end: '40% top',
        scrub: 0.8,
      },
    });

    return () => {
      intro.kill();
      exit.scrollTrigger?.kill();
      exit.kill();
    };
  }, []);

  return (
    <FrameSequence sequence="hero" scrollLength={5} onProgress={onProgress}>
      {/* The pointer-following spotlight. Pure CSS off the --px/--py vars the
          cursor writes; on touch it stays centred and reads as a vignette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(320px circle at var(--px) var(--py), rgba(242,202,80,0.28), transparent 70%)',
        }}
      />

      <div
        ref={copyRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-gutter text-center"
      >
        <span
          data-fade
          className="eyebrow mb-8 translate-y-4 opacity-0"
        >
          Trombay · Mumbai · Est. 2024
        </span>

        <h1 className="font-display text-display-xl text-cream">
          <span className="split-line">
            <span>Craving Point</span>
          </span>
          <span className="split-line">
            <span className="text-gold">{BRAND.suffix}</span>
          </span>
        </h1>

        <p
          data-fade
          className="mt-8 max-w-md translate-y-4 font-display text-xl italic text-cream/60 opacity-0"
        >
          “{BRAND.tagline}”
        </p>

        <div data-fade className="mt-12 translate-y-4 opacity-0">
          <Magnetic>
            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#collection', { offset: -80 });
              }}
              className="btn-primary"
            >
              Explore the Collection
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Scroll affordance. The line is a scaleY loop, which reads as a drip —
          on-theme, and cheaper than animating height. */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-label-sm uppercase text-cream/40">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[drip_2.4s_ease-in-out_infinite] bg-gold" />
        </span>
      </div>

      <style>{`
        @keyframes drip {
          0%   { transform: translateY(-100%); }
          60%  { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </FrameSequence>
  );
}
