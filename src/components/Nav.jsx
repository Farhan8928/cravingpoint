import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollTo, prefersReducedMotion } from '../lib/motion';
import { BRAND, NAV } from '../data/brand';
import { Magnetic } from './Cursor';

/**
 * The header, and the full-screen menu behind it on small viewports.
 *
 * Two behaviours worth naming:
 *
 * **Hide on scroll down, show on scroll up.** Standard, but the threshold
 * matters — hiding immediately makes the header flicker on the small upward
 * corrections people make while reading. It only hides past 200px and only on a
 * downward run.
 *
 * **The bar goes glass only once it is off the hero.** Over the opening frames
 * it is fully transparent, so the film runs edge to edge; the frosted panel
 * fades in when there is content behind it that needs separating.
 */
export default function Nav() {
  const barRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    if (prefersReducedMotion()) {
      setSolid(true);
      return undefined;
    }

    let last = 0;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setSolid(y > window.innerHeight * 0.6);

        const down = y > last && y > 200;
        gsap.to(bar, { yPercent: down ? -100 : 0, duration: 0.5, ease: 'power3.out' });
        last = y;
      },
    });

    return () => st.kill();
  }, []);

  // The overlay traps scroll while it is open, and Escape closes it.
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

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-lux ${
          solid ? 'glass' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-container items-center justify-between px-gutter">
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className="font-display text-lg tracking-wide"
          >
            <span className="text-cream">{BRAND.name}</span>
            <span className="text-gold"> {BRAND.suffix}</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                // The underline grows from the left on hover — a scale-x on a
                // pseudo-element, so it costs no layout.
                className="group relative text-label uppercase text-cream/60 transition-colors duration-500 hover:text-cream"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-lux group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Magnetic className="hidden sm:block">
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-6 !py-3"
              >
                Order Now
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
                className={`block h-px w-6 bg-cream transition-transform duration-500 ease-lux ${
                  open ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-6 bg-cream transition-transform duration-500 ease-lux ${
                  open ? '-translate-y-[3.5px] -rotate-45' : ''
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
        className={`fixed inset-0 z-40 bg-ink-deep transition-[clip-path,visibility] duration-700 ease-lux md:hidden ${
          open ? 'visible' : 'invisible'
        }`}
        style={{ clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
      >
        <nav
          aria-label="Mobile"
          className="flex h-full flex-col justify-center gap-2 px-gutter"
        >
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              tabIndex={open ? 0 : -1}
              className="font-display text-display-md text-cream transition-colors duration-300 hover:text-gold"
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

          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="btn-primary mt-10 self-start"
          >
            Order on WhatsApp
          </a>
        </nav>
      </div>
    </>
  );
}
