import { BRAND, NAV } from '../data/brand';
import { scrollTo } from '../lib/motion';
import { Reveal } from './Reveal';
import ThemeToggle from './ThemeToggle';

/**
 * The footer, built around one very large wordmark.
 *
 * The oversized name is the closing frame of the film the page has been running.
 * It is set in `text-display-xl`, which clamps against viewport width, so it
 * fills the measure at every size without a media query — and it is clipped to
 * the section rather than allowed to overflow, so it never causes a horizontal
 * scrollbar on narrow screens.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-sunken pt-section">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid gap-12 pb-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-sm font-display text-headline text-ink">{BRAND.description}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-8">
            <h2 className="font-mono text-label-sm uppercase text-muted">Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href, { offset: -80 });
                    }}
                    className="text-ink-soft transition-colors duration-300 hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="font-mono text-label-sm uppercase text-muted">Connect</h2>
            <ul className="mt-5 space-y-3">
              {BRAND.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft transition-colors duration-300 hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${BRAND.phone}`}
                  className="text-ink-soft transition-colors duration-300 hover:text-accent"
                >
                  {BRAND.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The wordmark. aria-hidden because the same name is already the page's
            h1 and the copyright line — this instance is a graphic. */}
        {/* Clipped to its own box so the descenders cannot cross the rule below
            — an oversized wordmark bleeding through a border reads as a bug
            rather than as a flourish. */}
        <Reveal y={50} duration={1.3} className="overflow-hidden pb-10">
          <div
            aria-hidden="true"
            className="select-none whitespace-nowrap text-center font-display text-display-xl leading-[0.82] text-ink/[0.08]"
          >
            Craving Point<span className="text-accent/25">.88</span>
          </div>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-7 text-sm text-muted sm:flex-row lg:pb-28">
          <p>
            © {year} {BRAND.full}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => scrollTo('#top', { offset: 0 })}
              className="font-mono text-label-sm uppercase transition-colors duration-300 hover:text-accent"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
