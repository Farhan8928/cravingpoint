import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { COLLECTIONS } from '../data/menu';
import { ALTS } from '../data/alts';
import { BRAND } from '../data/brand';
import { SplitLines, Reveal } from './Reveal';
import Img from './Img';

/**
 * The menu: a list on the left, one large photograph on the right.
 *
 * The previous version floated a raw film frame under the cursor. It read as a
 * bug — an unstyled rectangle covering the row you were trying to read, cropped
 * at whatever aspect the frame happened to be. The problem was not the polish,
 * it was the pattern: a cursor-following image has nowhere to *be*, so it always
 * lands on top of content.
 *
 * Giving the image its own column fixes that. It is a sticky, framed panel that
 * crossfades as you move down the list, and it holds the last hovered dish
 * rather than snapping to empty — so it behaves like a viewfinder onto the menu
 * instead of a tooltip.
 *
 * On touch there is no hover to drive it, so the panel is dropped entirely and
 * each row carries its own thumbnail. Same content, honest to the input.
 */
export default function Collection() {
  const [active, setActive] = useState(COLLECTIONS[0].id);
  const collection = COLLECTIONS.find((c) => c.id === active);

  const listRef = useRef(null);
  // Index rather than the item itself, so switching counters resets cleanly.
  const [focused, setFocused] = useState(0);
  const item = collection.items[focused] ?? collection.items[0];

  useEffect(() => {
    setFocused(0);
  }, [active]);

  // Rows stagger in whenever the active counter changes.
  useEffect(() => {
    const el = listRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      el.querySelectorAll('[data-row]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' }
    );
    return () => tween.kill();
  }, [active]);

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
          role="tabpanel"
          id={`panel-${collection.id}`}
          aria-labelledby={`tab-${collection.id}`}
          className="grid gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div ref={listRef} className="border-t border-line lg:col-span-7">
            {collection.items.map((entry, i) => (
              <article
                key={entry.name}
                data-row
                onMouseEnter={() => setFocused(i)}
                // Keyboard users move through the rows too, so focus drives the
                // panel exactly as hover does.
                onFocus={() => setFocused(i)}
                tabIndex={0}
                className={`group flex cursor-default items-center gap-5 border-b border-line py-5 transition-colors duration-500 ease-lux md:py-6 ${
                  focused === i ? 'lg:bg-sunken/50' : ''
                }`}
              >
                {/* Thumbnail carries the photography on touch and narrow
                    screens, where the sticky panel is hidden. */}
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-sunken lg:hidden">
                  <Img
                    slug={entry.image}
                    alt={ALTS[entry.image] ?? ''}
                    width={480}
                    height={600}
                    max={480}
                    sizes="64px"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl text-ink transition-transform duration-500 ease-lux group-hover:translate-x-1.5 md:text-2xl">
                      {entry.name}
                    </h3>
                    <span className="shrink-0 font-display text-lg text-ink md:text-xl">
                      {entry.price}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <p className="text-sm text-muted">{entry.note}</p>
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="hidden shrink-0 border border-accent/40 px-2 py-0.5 text-label-sm uppercase text-accent xl:inline-block"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* The viewfinder. Hidden below lg, where there is no hover to drive
              it and the row thumbnails do the job instead. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-sunken shadow-frame">
                {collection.items.map((entry, i) => (
                  <Img
                    key={entry.image}
                    slug={entry.image}
                    alt={ALTS[entry.image] ?? ''}
                    width={1000}
                    height={1250}
                    max={1200}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    // All frames are stacked and crossfaded on opacity rather
                    // than swapped by src — swapping means a decode on every
                    // hover, which shows as a flash of empty panel.
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-lux ${
                      focused === i ? 'opacity-100' : 'opacity-0'
                    }`}
                    // Only the first is eager; the rest load as the list is used.
                    priority={i === 0}
                  />
                ))}
              </div>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <div>
                  <h3 className="font-display text-2xl text-ink">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.note}</p>
                </div>
                <span className="shrink-0 font-display text-2xl text-accent">{item.price}</span>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="mt-14 flex flex-wrap items-center gap-6" delay={0.1}>
          <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Order on WhatsApp
          </a>
          <p className="text-sm text-muted">Prices are indicative — confirm at the counter.</p>
        </Reveal>
      </div>
    </section>
  );
}
