import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollTo, prefersReducedMotion } from '../lib/motion';
import { BRAND, NAV } from '../data/brand';
import { Magnetic } from './Cursor';
import ThemeToggle from './ThemeToggle';

/**
 * The header, and the full-screen menu behind it on small viewports.
 *
 * Over the hero the bar is transparent and its type is the fixed `film-*`
 * colours — the footage is dark in both themes, so theme-following text would be
 * invisible on the light setting. Past the hero it becomes a glass panel and
 * switches to the theme tokens. That handover is the `overFilm` flag.
 *
 * It also hides on a downward run past 200px and returns on any upward move.
 * The threshold matters: hiding immediately makes the header flicker against the
 * small upward corrections people make while reading.
 */
export default function Nav() {
  const barRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [overFilm, setOverFilm] = useState(true);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

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

        const down = y > last && y > 200;
        gsap.to(bar, { yPercent: down ? -100 : 0, duration: 0.5, ease: 'power3.out' });
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
    scrollTo(href, { offset: -80 });
  };

  const link = overFilm
    ? 'text-film-muted hover:text-film-ink'
    : 'text-muted hover:text-ink';

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-lux ${
          overFilm ? 'bg-transparent' : 'glass'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-gutter">
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className={`font-display text-lg font-semibold tracking-tight transition-colors duration-700 ${
              overFilm ? 'text-film-ink' : 'text-ink'
            }`}
          >
            Craving Point <span className="text-accent">.88</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                // The underline grows from the left — a scale-x on a
                // pseudo-element, so it costs no layout.
                className={`group relative text-label uppercase transition-colors duration-500 ${link}`}
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-lux group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden sm:flex" />

            <Magnetic className="hidden lg:block">
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-5 !py-3"
              >
                Order
              </a>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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

      {/* Kept mounted and clipped rather than unmounted, so the close animation
          has something to animate. `invisible` removes it from the tab order. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-ground transition-[clip-path,visibility] duration-700 ease-lux md:hidden ${
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
