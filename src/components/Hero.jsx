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
 * sitting statically on top. The title holds through the opening — there is
 * nothing on the slate to compete with it — then lifts and fades as the food
 * arrives. By the end of the section the frame is doing the talking.
 *
 * All type here uses the fixed `film-*` colours, not the theme tokens. The
 * footage is dark in both modes, so theme-following text would vanish into the
 * slate the moment someone switched to light.
 *
 * `scrollLength={5}` gives 281 frames five viewport heights. Much shorter and
 * the pour goes by too fast to register; much longer and the page feels stuck.
 */
export default function Hero({ onProgress }) {
  const copyRef = useRef(null);

  useEffect(() => {
    const el = copyRef.current;
    if (!el || prefersReducedMotion()) return undefined;

    // Entrance — slow and late, playing as the preloader lifts.
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
        // Gone by 40% of the sequence — the spread deserves a clear frame.
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
    <FrameSequence id="hero" sequence="hero" scrollLength={5} onProgress={onProgress}>
      <div
        ref={copyRef}
        className="absolute inset-0 flex flex-col justify-end px-gutter pb-28 md:pb-28"
      >
        <div className="mx-auto w-full max-w-container">
          <span data-fade className="eyebrow block translate-y-4 !text-film-accent opacity-0">
            Open till late · Cheeta Camp, Trombay
          </span>

          {/* Left-aligned and bottom-set rather than centred. A centred stack
              over a centred subject is the arrangement every template ships;
              anchoring the type to the lower-left lets the pour own the frame. */}
          <h1 className="mt-5 font-display text-display-xl text-film-ink">
            <span className="split-line">
              <span>Craving Point</span>
            </span>
          </h1>

          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p
              data-fade
              className="max-w-sm translate-y-4 text-body-lg text-film-muted opacity-0"
            >
              Waffles off the iron. Tubs filled to the rim. Four minutes, every time.
            </p>

            <div data-fade className="translate-y-4 opacity-0">
              <Magnetic>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#collection', { offset: -80 });
                  }}
                  data-cursor-label="Menu"
                  className="btn rounded-full bg-film-ink text-film-ground transition-colors hover:bg-white"
                >
                  See the counter
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll affordance. A scaleY loop that reads as a drip — on theme, and
          cheaper than animating height. */}
      {/* Visible on every size. This was `hidden md:flex`, which left phones
          with no scroll cue at all on a five-viewport-tall hero — the one layout
          where the cue matters most, because the screen is a single dark frame
          with nothing in it that suggests more is below. Centred on mobile,
          where the copy stacks and the right gutter is occupied. */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8 md:left-auto md:right-gutter md:translate-x-0 md:gap-3"
      >
        <span className="font-mono text-label-sm uppercase text-film-muted">Scroll</span>
        <span className="relative block h-8 w-px overflow-hidden bg-film-ink/20 md:h-12">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-drip bg-film-accent" />
        </span>
      </div>
    </FrameSequence>
  );
}
