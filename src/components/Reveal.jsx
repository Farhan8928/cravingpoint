import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';

/**
 * Scroll-triggered entrance for a single block.
 *
 * The starting state lives in CSS (`.reveal-mask`, `.split-line`) rather than in
 * the GSAP `from` values, for one reason: this site prerenders. If the opening
 * state were set by JS there would be a frame where the fully-visible SSR markup
 * paints before hydration hides it — the flash that makes prerendered animated
 * sites look like they load twice. CSS holds the closed state from the first
 * paint, and GSAP only ever opens it.
 *
 * The corollary is that a JS failure would leave the page permanently hidden, so
 * `index.html` sets `.is-in` on everything if the bundle never boots, and this
 * component sets it immediately under reduced motion.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 40,
  duration = 1.1,
  start = 'top 85%',
  className = '',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return undefined;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y, duration, start]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Line-by-line masked type reveal.
 *
 * Splitting is done on explicit `lines` passed by the caller rather than by
 * measuring rendered text. Measuring is what SplitText does and it is better at
 * it — but it also means the DOM the server renders and the DOM after hydration
 * differ, which React logs as a mismatch and which reflows the block on load.
 * Authoring the line breaks costs a little editorial control and buys a stable,
 * prerenderable, screen-reader-correct heading.
 */
export function SplitLines({
  lines,
  as: Tag = 'h2',
  className = '',
  stagger = 0.09,
  delay = 0,
  start = 'top 85%',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const inner = el.querySelectorAll('.split-line > span');

    if (prefersReducedMotion()) {
      el.querySelectorAll('.split-line').forEach((l) => l.classList.add('is-in'));
      return undefined;
    }

    const tween = gsap.to(inner, {
      y: '0%',
      duration: 1.2,
      delay,
      stagger,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger, delay, start]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        // Lines are a visual split of one sentence, so the wrappers are
        // presentational and the whole heading reads as one string to AT.
        <span className="split-line" key={i}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Word-by-word opacity wash driven by scroll position.
 *
 * The manifesto pattern: text starts dim and lights up as it crosses the middle
 * of the viewport. Unlike the entrance reveals this one is scrubbed, so it reads
 * as the user "reading through" the paragraph rather than as an animation that
 * plays at them.
 */
export function ScrollText({ text, className = '', as: Tag = 'p' }) {
  const ref = useRef(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const spans = el.querySelectorAll('span[data-w]');

    if (prefersReducedMotion()) {
      gsap.set(spans, { opacity: 1 });
      return undefined;
    }

    const tween = gsap.fromTo(
      spans,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.4,
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: 0.8,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span data-w key={i} style={{ opacity: 0.16 }}>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/** Vertical parallax for a child element. Subtle by default — 12% of travel. */
export function Parallax({ children, amount = 12, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const tween = gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Named exports throughout — this module is a set of peer primitives, and
// picking one of them to be "the" default only invites inconsistent imports.
export default Reveal;
