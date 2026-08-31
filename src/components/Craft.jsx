import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import FrameSequence from './FrameSequence';

/**
 * Act three: the grill, scrubbed across the second film.
 *
 * Where the hero holds one piece of copy and fades it out, this sequence hands
 * off between three captions as the wrap is built — each one crossfading in over
 * its own third of the scroll. The captions are the reason the section is not
 * just "the hero again with different footage": the film is a process, so the
 * type narrates the process.
 *
 * Only three captions for 151 frames. The temptation is one per beat, but each
 * additional caption shortens the time the reader has with the frame, and at
 * four they start swapping faster than they can be read.
 */
const BEATS = [
  {
    step: '01',
    title: 'Charcoal first',
    body: 'Thigh meat, marinated overnight, marked hard over open flame before anything else touches it.',
  },
  {
    step: '02',
    title: 'Built cold, served hot',
    body: 'Red onion, cucumber ribbons and tomato go on straight from the chill so the wrap keeps its snap.',
  },
  {
    step: '03',
    title: 'Folded to order',
    body: 'Rolled tight, pressed on the tawa, cut and out. Ninety seconds from the pass to your hand.',
  },
];

export default function Craft() {
  const wrapRef = useRef(null);
  // Drives the layout swap below. `false` on the server and on the first client
  // render, which is correct — the media query can only be read in the browser,
  // and the animated layout is the one the markup should prerender as.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const beats = el.querySelectorAll('[data-beat]');

    if (prefersReducedMotion()) {
      setReduced(true);
      gsap.set(beats, { opacity: 1, y: 0 });
      return undefined;
    }

    const section = el.closest('section');
    const triggers = [];

    beats.forEach((beat, i) => {
      const span = 1 / BEATS.length;
      const start = i * span;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          // Each caption owns its slice of the scroll, with a short lead-in and
          // lead-out so two are never fully opaque at once.
          start: `${(start + 0.02) * 100}% top`,
          end: `${(start + span - 0.02) * 100}% top`,
          scrub: 0.7,
        },
      });

      tl.fromTo(beat, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
        .to(beat, { opacity: 1, duration: 2 })
        .to(beat, { opacity: 0, y: -40, duration: 1, ease: 'power2.in' });

      triggers.push(tl);
    });

    return () => {
      triggers.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  }, []);

  return (
    <FrameSequence
      id="craft"
      sequence="craft"
      // With the scrub gone there is no reason to hold 3.5 screens of empty
      // scroll — the section collapses to a single readable viewport.
      scrollLength={reduced ? 1 : 3.5}
      className="bg-ink-deep"
    >
      {/* The subject of this film sits low and centre-right, directly under the
          captions. FrameSequence's own scrim is symmetrical and darkens the top
          and bottom, which does nothing for type sitting over the tortilla — so
          this section adds a directional one: left-weighted on desktop where
          the captions are, bottom-weighted on mobile where they stack. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#0a0a0a_0%,rgba(10,10,10,0.82)_34%,transparent_68%)] md:bg-[linear-gradient(to_right,#0a0a0a_0%,rgba(10,10,10,0.88)_28%,rgba(10,10,10,0.6)_50%,transparent_78%)]"
      />

      <div ref={wrapRef} className="absolute inset-0 mx-auto max-w-container px-gutter">
        {/* This inner box carries no padding of its own, so the absolutely
            positioned captions below resolve against a box that already
            respects the gutter — `inset-x-0` on a padded ancestor would sit
            flush to the viewport edge instead. */}
        <div
          className={`relative h-full ${reduced ? 'flex flex-col justify-center gap-8' : ''}`}
        >
          {BEATS.map((beat) => (
            <div
              key={beat.step}
              data-beat
              // Only one caption is visible at a time, so stacking them removes
              // the dead space the hidden two would otherwise reserve — and it
              // pins the visible one to the bottom on mobile, which is where the
              // scrim is heaviest and the frame is emptiest.
              className={
                reduced
                  ? ''
                  : 'absolute inset-x-0 bottom-24 md:bottom-auto md:top-1/2 md:w-1/2 md:-translate-y-1/2'
              }
              style={{ opacity: 0 }}
            >
              <span className="eyebrow block">{beat.step} — The Grill</span>
              <h3
                className={`mt-4 font-display text-cream ${
                  reduced ? 'text-headline' : 'mt-6 text-display-md'
                }`}
              >
                {beat.title}
              </h3>
              <p className="lede mt-4">{beat.body}</p>
            </div>
          ))}
        </div>
      </div>
    </FrameSequence>
  );
}
