import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollTo, prefersReducedMotion } from '../lib/motion';
import { BRAND, NAV } from '../data/brand';
import ThemeToggle from './ThemeToggle';

/**
 * The header, in two pieces.
 *
 * **A top rail** — status on the left, wordmark centred, place on the right,
 * with hairlines running out to the edges. Centring the wordmark and hanging
 * information off both sides reads as signage rather than as an app chrome bar,
 * which is the point: this is a shop, and the first thing a shop tells you is
 * whether it is open.
 *
 * **A floating pill nav**, bottom-centre, carrying the signature gradient. It is
 * the one persistent element that always shows the brand colour, which is what
 * lets the gradient stay rare everywhere else. Bottom placement also puts
 * navigation within thumb reach on the sizes that have it, and keeps the top of
 * the film clear.
 *
 * Over the hero both use the fixed `film-*` colours — the footage is dark in
 * both themes, so theme-following text would disappear on the light setting.
 * `overFilm` is that handover.
 */
export default function Nav() {
  const railRef = useRef(null);
  const pillRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [overFilm, setOverFilm] = useState(true);

  useEffect(() => {
    const rail = railRef.current;
    const pill = pillRef.current;
    if (!rail) return undefined;

    if (prefersReducedMotion()) {
      setOverFilm(false);
      return undefined;
    }

    let last = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setOverFilm(y < window.innerHeight * 0.6);

        // The rail hides on a downward run past 200px. The threshold matters:
        // hiding immediately makes it flicker against the small upward
        // corrections people make while reading.
        const down = y > last && y > 200;
        gsap.to(rail, { yPercent: down ? -100 : 0, duration: 0.5, ease: 'power3.out' });

        // The pill does the opposite — it is the navigation, so it should be
        // present exactly when the rail is not.
        if (pill) {
          gsap.to(pill, {
            y: down ? 0 : 0,
            opacity: y > window.innerHeight * 0.35 ? 1 : 0,
            pointerEvents: y > window.innerHeight * 0.35 ? 'auto' : 'none',
            duration: 0.45,
            ease: 'power3.out',
          });
        }
        last = y;
      },
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href, { offset: -90 });
  };

  const railText = overFilm ? 'text-film-muted' : 'text-muted';
  const railInk = overFilm ? 'text-film-ink' : 'text-ink';
  const railLine = overFilm ? 'bg-film-ink/20' : 'bg-line';

  return (
    <>
      <header
        ref={railRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-lux ${
          overFilm ? 'bg-transparent' : 'glass'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-container items-center gap-4 px-gutter md:h-20 md:gap-8">
          {/* Open/closed is computed from real hours, so the rail is never
              confidently wrong about whether you can walk in. */}
          <span className={`hidden shrink-0 font-mono text-label-sm uppercase md:block ${railText}`}>
            {openNow() ? '● Open now' : '○ Closed'} — 12:00 till late
          </span>

          <span aria-hidden="true" className={`hidden h-px flex-1 md:block ${railLine}`} />

          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className={`shrink-0 font-display text-lg font-semibold tracking-tight transition-colors duration-700 md:text-xl ${railInk}`}
          >
            Craving Point <span className="grad-text">.88</span>
          </a>

          <span aria-hidden="true" className={`hidden h-px flex-1 md:block ${railLine}`} />

          <span
            className={`ml-auto hidden shrink-0 font-mono text-label-sm uppercase md:block ${railText}`}
          >
            Cheeta Camp, Trombay
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
            <ThemeToggle className="hidden sm:flex" onFilm={overFilm} />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={`block h-px w-6 transition-transform duration-500 ease-lux ${
                  open ? 'translate-y-[3.5px] rotate-45 bg-ink' : overFilm ? 'bg-film-ink' : 'bg-ink'
                }`}
              />
              <span
                className={`block h-px w-6 transition-transform duration-500 ease-lux ${
                  open ? '-translate-y-[3.5px] -rotate-45 bg-ink' : overFilm ? 'bg-film-ink' : 'bg-ink'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* The floating pill. Desktop only — on phones the bottom edge belongs to
          the order bar, and two stacked floating bars is one too many. */}
      <div
        ref={pillRef}
        style={{ opacity: 0, pointerEvents: 'none' }}
        className="fixed inset-x-0 bottom-7 z-50 hidden justify-center px-gutter lg:flex"
      >
        <nav
          aria-label="Primary"
          className="grad-102 flex items-center gap-1 rounded-full p-1.5 shadow-frame"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              data-cursor-label="Go"
              // White at 80% rather than a token: this sits on the gradient in
              // both themes, so it must not follow the theme.
              className="rounded-full px-5 py-2.5 font-mono text-label uppercase text-white/80 transition-colors duration-400 ease-lux hover:bg-white/20 hover:text-white"
            >
              {item.label}
            </a>
          ))}

          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="Order"
            className="ml-1 rounded-full bg-white px-5 py-2.5 font-mono text-label uppercase text-[#7e2a14] transition-transform duration-400 ease-lux hover:scale-[1.03]"
          >
            Order
          </a>
        </nav>
      </div>

      {/* Kept mounted and clipped rather than unmounted, so the close animation
          has something to animate. `invisible` removes it from the tab order. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-ground transition-[clip-path,visibility] duration-700 ease-lux lg:hidden ${
          open ? 'visible' : 'invisible'
        }`}
        style={{ clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
      >
        <nav aria-label="Mobile" className="flex h-full flex-col justify-center gap-1 px-gutter">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              tabIndex={open ? 0 : -1}
              className="font-display text-display-md text-ink transition-colors duration-300 hover:text-accent"
              style={{
                transform: open ? 'translateY(0)' : 'translateY(30px)',
                opacity: open ? 1 : 0,
                transition: `transform 700ms cubic-bezier(0.22,1,0.36,1) ${i * 70}ms, opacity 700ms ${
                  i * 70
                }ms`,
              }}
            >
              {item.label}
            </a>
          ))}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="btn-primary"
            >
              Order on WhatsApp
            </a>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </>
  );
}

/**
 * Whether the counter is open, from the hours in brand.js.
 *
 * Deliberately naive — it reads the visitor's clock, not Asia/Kolkata, so a
 * customer abroad may see the wrong state. That is an acceptable trade for a
 * neighbourhood shop whose visitors are overwhelmingly local, and it avoids
 * shipping a timezone library for one line of chrome. Swap in `Intl.DateTimeFormat`
 * with `timeZone: 'Asia/Kolkata'` if that stops being true.
 */
function openNow() {
  const now = new Date();
  const day = now.getDay(); // 0 Sun … 6 Sat
  const hour = now.getHours() + now.getMinutes() / 60;
  const lateNight = day === 5 || day === 6 || day === 0; // Fri–Sun close at 01:00
  const close = lateNight ? 25 : 23.5;
  // Before noon the shop is shut; after midnight we are in the previous day's
  // late session, which is why `close` can exceed 24.
  if (hour < 12) return lateNight && hour < close - 24;
  return hour < close;
}
