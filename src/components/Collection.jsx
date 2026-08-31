import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { COLLECTIONS } from '../data/menu';
import { BRAND } from '../data/brand';
import { SplitLines, Reveal } from './Reveal';
import Img from './Img';

/**
 * The menu, as two switchable counters.
 *
 * A tab pattern rather than two stacked lists: the sweet and hot counters are
 * genuinely alternatives — nobody scrolls the desserts to reach the wraps — and
 * stacking them would put 10 rows of text between the hero and the visit
 * details. Switching is animated, but the inactive panel is unmounted, so the
 * DOM only ever holds the menu the reader asked for.
 *
 * Rows, not cards. Only four items have photography (the stills pulled from the
 * two films); a card grid would leave six holes that want stock imagery, and
 * stock food photography is the fastest way to make a real kitchen look fake. So
 * the list is typographic, and the photographed items get a hover preview that
 * follows the cursor — the images are a reward for exploring, not a grid to fill.
 */
export default function Collection() {
  const [active, setActive] = useState(COLLECTIONS[0].id);
  const collection = COLLECTIONS.find((c) => c.id === active);

  const listRef = useRef(null);
  const previewRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  // Rows stagger in whenever the active counter changes.
  useEffect(() => {
    const el = listRef.current;
    if (!el || prefersReducedMotion()) return undefined;

    const tween = gsap.fromTo(
      el.querySelectorAll('[data-row]'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' }
    );
    return () => tween.kill();
  }, [active]);

  // The floating preview tracks the pointer with a lag, like the cursor ring.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });

    const onMove = (e) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 140);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.to(el, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.92,
      duration: 0.45,
      ease: 'power3.out',
    });
  }, [hovered]);

  return (
    <section id="collection" className="relative bg-ink-deep py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-center gap-6">
          <span className="eyebrow">The Collection</span>
          <span className="rule flex-1" />
        </Reveal>

        <div className="mb-16 grid gap-10 md:grid-cols-12 md:items-end">
          <SplitLines
            as="h2"
            className="font-display text-display-lg text-cream md:col-span-7"
            lines={['Two counters,', 'one obsession.']}
          />
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="lede">{collection.blurb}</p>
          </Reveal>
        </div>

        {/* Counter switch. Real buttons with aria-selected rather than styled
            divs, so the control is operable from the keyboard as a tablist. */}
        <div role="tablist" aria-label="Menu counters" className="mb-12 flex flex-wrap gap-3">
          {COLLECTIONS.map((c) => {
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                id={`tab-${c.id}`}
                onClick={() => setActive(c.id)}
                className={`btn text-label ${
                  selected
                    ? 'bg-gold text-gold-ink'
                    : 'border border-outline-variant text-cream/60 hover:border-gold hover:text-gold'
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        <div
          ref={listRef}
          role="tabpanel"
          id={`panel-${collection.id}`}
          aria-labelledby={`tab-${collection.id}`}
          className="border-t border-outline-variant/40"
        >
          {collection.items.map((item) => (
            <article
              key={item.name}
              data-row
              data-cursor={item.still ? 'grow' : undefined}
              onMouseEnter={() => item.still && setHovered(item)}
              onMouseLeave={() => setHovered(null)}
              className="group grid grid-cols-12 items-baseline gap-4 border-b border-outline-variant/40 py-7 transition-colors duration-500 ease-lux hover:bg-white/[0.02] md:py-8"
            >
              <h3 className="col-span-9 font-display text-2xl text-cream transition-transform duration-500 ease-lux group-hover:translate-x-2 md:col-span-5 md:text-3xl">
                {item.name}
              </h3>

              <p className="col-span-12 order-3 text-sm text-cream/50 md:order-none md:col-span-5">
                {item.note}
              </p>

              <div className="col-span-3 flex items-center justify-end gap-4 md:col-span-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="hidden rounded-full border border-gold/30 px-3 py-1 text-label-sm uppercase text-gold/80 lg:inline-block"
                  >
                    {tag}
                  </span>
                ))}
                <span className="font-display text-xl text-gold">{item.price}</span>
              </div>
            </article>
          ))}
        </div>

        <Reveal className="mt-16 flex flex-wrap items-center gap-6" delay={0.1}>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Order on WhatsApp
          </a>
          <p className="text-sm text-cream/40">
            Prices are indicative — confirm at the counter.
          </p>
        </Reveal>
      </div>

      {/* The hover preview. Fixed, pointer-events-none, and hidden from AT — the
          row text is the accessible content; this is decoration on top of it. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-64 w-96 overflow-hidden rounded-lg shadow-lift md:block"
        style={{ opacity: 0 }}
      >
        {hovered?.still && (
          <Img
            slug={hovered.still}
            alt=""
            width={800}
            height={450}
            max={800}
            sizes="384px"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </section>
  );
}
