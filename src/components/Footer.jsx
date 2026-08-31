import { BRAND, NAV } from '../data/brand';
import { scrollTo } from '../lib/motion';
import { Reveal } from './Reveal';

/**
 * The footer, built around one very large wordmark.
 *
 * The oversized name is the closing frame of the film the rest of the page has
 * been running — it is set in `text-display-xl`, which clamps against viewport
 * width, so it fills the measure at every size without a single media query.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink pt-section">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid gap-12 pb-20 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-sm font-display text-headline text-cream">
              {BRAND.description}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-8">
            <h2 className="text-label uppercase text-cream/40">Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href, { offset: -80 });
                    }}
                    className="text-cream/60 transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="text-label uppercase text-cream/40">Connect</h2>
            <ul className="mt-5 space-y-3">
              {BRAND.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/60 transition-colors duration-300 hover:text-gold"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="text-cream/60 transition-colors duration-300 hover:text-gold"
                >
                  {BRAND.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The wordmark. aria-hidden because the same name is already the page's
            h1 and the footer's copyright line — this instance is a graphic. */}
        <Reveal y={60} duration={1.4}>
          <div
            aria-hidden="true"
            className="select-none whitespace-nowrap text-center font-display text-display-xl leading-none text-cream/[0.07]"
          >
            {BRAND.name}
            <span className="text-gold/20">{BRAND.suffix}</span>
          </div>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant/30 py-8 text-sm text-cream/35 sm:flex-row">
          <p>
            © {year} {BRAND.full}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => scrollTo('#top', { offset: 0 })}
            className="text-label uppercase transition-colors duration-300 hover:text-gold"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
