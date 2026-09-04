import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, scrollTo } from '../lib/motion';
import { COLLECTIONS, GROUPS } from '../data/menu';
import { ALTS } from '../data/alts';
import { BRAND } from '../data/brand';
import { SplitLines, Reveal } from './Reveal';
import Img from './Img';

/**
 * The menu: 12 categories, ~80 items, two counters.
 *
 * The previous version was a seven-item list beside a sticky photo panel. That
 * shape does not survive the real menu — a photo panel idling next to eighty
 * rows is dead weight, and eighty rows in one column is a scroll with no
 * landmarks. Rebuilt around what actually works for a menu this size:
 *
 * **A sticky category rail.** Anchors are the standard answer to a long menu,
 * and they are what let someone hunting for "shawarma" get there in one tap
 * instead of a thumb-flick marathon. Horizontally scrollable on phones, where
 * twelve chips will not fit on one line.
 *
 * **Two columns on desktop, one on mobile.** `columns-2` with
 * `break-inside-avoid` mirrors how the printed card is laid out, which is not
 * nostalgia: a menu read as two narrow columns is faster to scan than one wide
 * one, because the eye travels less per item.
 *
 * **Photos where they earn it, not per row.** Photo menus convert better, but
 * that finding is about *feature* photography, not a thumbnail beside every
 * line. Categories with a picture get one at their head; momos are the only
 * category where every item has its own shot, so it is the only grid.
 *
 * **Prices as a real table.** Waffles are priced by slice and bowls by size, so
 * those categories carry column headers and aligned figures. Mono numerals keep
 * the columns true without a per-cell hack.
 */
export default function Collection() {
  const [group, setGroup] = useState('sweet');
  const cats = COLLECTIONS.filter((c) => c.group === group);
  const listRef = useRef(null);

  // Categories stagger in when the counter changes.
  useEffect(() => {
    const el = listRef.current;
    if (!el || prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      el.querySelectorAll('[data-cat]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
    );
    return () => tween.kill();
  }, [group]);

  return (
    <section id="collection" className="relative bg-tan py-section">
      <div className="mx-auto max-w-container px-gutter">
        <div className="mb-10 grid gap-8 md:grid-cols-12 md:items-end">
          <SplitLines
            as="h2"
            className="font-display text-display-lg text-ink md:col-span-7"
            lines={['Waffle. Bowl.', 'Momo. Shawarma.']}
          />
          <Reveal className="md:col-span-5" delay={0.15}>
            <p className="lede">
              Every bite, pure delight. Both counters run till one on weekends, and any
              bowl can be built the way you want it.
            </p>
          </Reveal>
        </div>

        {/* Counter switch. Real buttons with aria-selected, so it is operable
            from the keyboard as a tablist. */}
        <div role="tablist" aria-label="Menu counters" className="mb-8 flex flex-wrap gap-2">
          {GROUPS.map((g) => {
            const selected = g.id === group;
            return (
              <button
                key={g.id}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${g.id}`}
                id={`tab-${g.id}`}
                onClick={() => setGroup(g.id)}
                data-cursor-label="Switch"
                className={`btn ${
                  selected
                    ? 'bg-ink text-ground'
                    : 'border border-line text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {g.title}
              </button>
            );
          })}
        </div>

        {/* The category rail. Sticky under the header so the landmarks stay
            reachable through eighty rows; `overflow-x-auto` because twelve chips
            do not fit on a phone in one line. */}
        <div className="sticky top-16 z-20 -mx-gutter mb-10 border-y border-line bg-tan/95 px-gutter py-3 backdrop-blur-md md:top-20">
          <div className="scrollbar-none flex gap-2 overflow-x-auto">
            {cats.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(`#cat-${c.id}`, { offset: -150 });
                }}
                data-cursor-label="Jump"
                className="flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-line px-4 font-mono text-label-sm uppercase text-muted transition-colors duration-400 ease-lux hover:border-accent hover:text-accent"
              >
                {c.title}
              </a>
            ))}
          </div>
        </div>

        <div
          ref={listRef}
          role="tabpanel"
          id={`panel-${group}`}
          aria-labelledby={`tab-${group}`}
          className="md:columns-2 md:gap-14"
        >
          {cats.map((cat) => (
            <section
              key={cat.id}
              id={`cat-${cat.id}`}
              data-cat
              // `break-inside-avoid` keeps a category whole when the two columns
              // reflow — a price table split across a column break is unreadable.
              className="mb-12 break-inside-avoid scroll-mt-40"
            >
              <header className="border-b border-ink pb-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-ink md:text-3xl">{cat.title}</h3>
                  {cat.note && (
                    <span className="shrink-0 font-mono text-label-sm uppercase text-muted">
                      {cat.note}
                    </span>
                  )}
                </div>
                {cat.blurb && <p className="mt-2 text-sm text-muted">{cat.blurb}</p>}
              </header>

              {/* Feature photo, for the categories that have one. */}
              {cat.image && !cat.photos && (
                <div className="mt-5 aspect-[16/9] w-full overflow-hidden">
                  <Img
                    slug={cat.image}
                    alt={ALTS[cat.image] ?? ''}
                    sizes="(min-width: 768px) 44vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Column headers, only where the card prices two ways. */}
              {cat.columns && (
                <div className="mt-4 flex items-baseline justify-end gap-4 font-mono text-label-sm uppercase text-muted">
                  {cat.columns.map((c) => (
                    <span key={c} className="w-16 whitespace-nowrap text-right">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {cat.photos ? (
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
                  {cat.items.map((item) => (
                    <li key={item.name}>
                      <div className="aspect-square w-full overflow-hidden bg-sunken">
                        <Img
                          slug={item.image}
                          alt={ALTS[item.image] ?? ''}
                          sizes="(min-width: 768px) 20vw, 45vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mt-2.5 flex items-baseline justify-between gap-2">
                        <span className="text-sm leading-snug text-ink">{item.name}</span>
                        <span className="num shrink-0 text-sm text-ink">₹{item.prices[0]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-1">
                  {cat.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-baseline gap-3 border-b border-line py-2.5"
                    >
                      <span className="min-w-0 flex-1 text-sm leading-snug text-ink">
                        {item.name}
                        {item.note && (
                          <span className="block text-xs text-muted">{item.note}</span>
                        )}
                        {item.tag && (
                          <span className="ml-2 whitespace-nowrap font-mono text-label-sm uppercase text-accent">
                            {item.tag}
                          </span>
                        )}
                      </span>

                      {item.prices.length ? (
                        <span className="flex shrink-0 items-baseline gap-4">
                          {item.prices.map((p, i) => (
                            <span
                              key={i}
                              className={`num text-sm text-ink ${cat.columns ? 'w-16 text-right' : ''}`}
                            >
                              {p == null ? <span className="text-muted">—</span> : `₹${p}`}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="shrink-0 font-mono text-label-sm uppercase text-muted">
                          Ask
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <Reveal className="mt-6 flex flex-wrap items-center gap-6" delay={0.1}>
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="WhatsApp"
            className="btn-primary rounded-full"
          >
            Order on WhatsApp
          </a>
          <p className="text-sm text-muted">
            Prices as printed on the counter card. Any bowl can be customised.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
