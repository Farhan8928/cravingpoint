import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { COLLECTIONS } from '../data/menu';
import { BRAND } from '../data/brand';
import { SplitLines, Reveal } from './Reveal';
import Img from './Img';

/**
 * The menu, as two switchable counters.
 *
 * A tab pattern rather than two stacked lists: sweet and hot are genuinely
 * alternatives — nobody scrolls the desserts to reach the wraps — and stacking
 * them would put ten rows of text between the hero and the visit details. The
 * inactive panel is unmounted, so the DOM only holds the menu that was asked for.
 *
 * Rows, not cards. Only four items have photography (the stills pulled from the
 * two films); a card grid would leave six holes wanting stock imagery, and stock
 * food photography is the fastest way to make a real kitchen look fake. So the
 * list is typographic, and the photographed items get a hover preview that
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
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.045, ease: 'power3.out' }
    );
    return () => tween.kill();
  }, [active]);

  // The floating preview tracks the pointer with a lag, like the cursor ring.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.65, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.65, ease: 'power3' });
    const onMove = (e) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 130);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.to(el, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.94,
      duration: 0.45,
      ease: 'power3.out',
    });
  }, [hovered]);

  return (
    <section id="collection" className="relative bg-ground py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-baseline gap-6">
          <span className="eyebrow">02 — The Collection</span>
          <span className="rule flex-1" />
        </Reveal>

        <div className="mb-14 grid gap-10 md:grid-cols-12 md:items-end">
          <SplitLines
            as="h2"
            className="font-display text-display-lg text-ink md:col-span-7"
            lines={['Two counters,', 'one obsession.']}
          />
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="lede">{collection.blurb}</p>
          </Reveal>
        </div>

        {/* Real buttons with aria-selected rather than styled divs, so the
            control is operable from the keyboard as a tablist. */}
        <div role="tablist" aria-label="Menu counters" className="mb-10 flex flex-wrap gap-2">
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
                className={`btn !py-3 ${
                  selected
                    ? 'bg-ink text-ground'
                    : 'border border-line text-muted hover:border-accent hover:text-accent'
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
          className="border-t border-line"
        >
          {collection.items.map((item) => (
            <article
              key={item.name}
              data-row
              data-cursor={item.still ? 'grow' : undefined}
              onMouseEnter={() => item.still && setHovered(item)}
              onMouseLeave={() => setHovered(null)}
              className="group grid grid-cols-12 items-baseline gap-4 border-b border-line py-6 transition-colors duration-500 ease-lux hover:bg-sunken/60 md:py-7"
            >
              <h3 className="col-span-9 font-display text-2xl text-ink transition-transform duration-500 ease-lux group-hover:translate-x-2 md:col-span-5 md:text-3xl">
                {item.name}
              </h3>

              <p className="order-3 col-span-12 text-sm text-muted md:order-none md:col-span-5">
                {item.note}
              </p>

              <div className="col-span-3 flex items-center justify-end gap-4 md:col-span-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="hidden border border-accent/40 px-2.5 py-1 text-label-sm uppercase text-accent lg:inline-block"
                  >
                    {tag}
                  </span>
                ))}
                <span className="font-display text-xl text-ink">{item.price}</span>
              </div>
            </article>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center gap-6" delay={0.1}>
          <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Order on WhatsApp
          </a>
          <p className="text-sm text-muted">Prices are indicative — confirm at the counter.</p>
        </Reveal>
      </div>

      {/* The hover preview. Fixed, pointer-events-none, hidden from AT — the row
          text is the accessible content; this is decoration on top of it. */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-60 w-80 overflow-hidden shadow-frame md:block"
        style={{ opacity: 0 }}
      >
        {hovered?.still && (
          <Img
            slug={hovered.still}
            alt=""
            width={800}
            height={450}
            max={800}
            sizes="320px"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </section>
  );
}
