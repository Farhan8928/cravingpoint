import { BRAND } from '../data/brand';
import { SplitLines, Reveal } from './Reveal';
import { Magnetic } from './Cursor';

/**
 * Where to find the place, and how to order from it.
 *
 * The last section before the footer is the one people scroll to on purpose,
 * usually on a phone, usually already outside. So it is the plainest block on
 * the site: no scrub, no parallax, no hover states a thumb cannot trigger.
 * Address, hours, two tappable actions.
 *
 * The map is an iframe only when `mapEmbed` is configured. An empty Google Maps
 * embed renders as a grey box with an error in it, which is worse than a text
 * address and a link out.
 */
export default function Visit() {
  const { address, hours } = BRAND;
  // Prefer the real Google listing link over a text search — a search for a
  // café name in Mumbai can and does resolve onto the wrong pin.
  const directions = BRAND.mapsDirections;

  return (
    <section id="visit" className="bg-ground py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-baseline gap-6">
          <span className="eyebrow">05 — Visit</span>
          <span className="rule flex-1" />
        </Reveal>

        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SplitLines
              as="h2"
              className="font-display text-display-md text-ink"
              lines={['Find the', 'counter.']}
            />

            <Reveal delay={0.1} className="mt-10 space-y-9">
              <div>
                <h3 className="font-mono text-label-sm uppercase text-muted">Address</h3>
                <address className="mt-3 text-body-lg not-italic text-ink">
                  {address.line1}
                  <br />
                  {address.line2}
                  <br />
                  {address.line3}
                  <br />
                  {address.region}
                </address>
              </div>

              <div>
                <h3 className="font-mono text-label-sm uppercase text-muted">Hours</h3>
                <dl className="mt-3 space-y-2 border-t border-line pt-3">
                  {hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-6">
                      <dt className="text-ink">{h.days}</dt>
                      <dd className="num text-sm text-muted">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href={BRAND.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="WhatsApp"
                    className="btn-primary rounded-full"
                  >
                    Message on WhatsApp
                  </a>
                </Magnetic>
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Maps"
                  className="btn-ghost rounded-full"
                >
                  Get directions
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-sunken">
              {BRAND.mapEmbed ? (
                <iframe
                  src={BRAND.mapEmbed}
                  title={`Map to ${BRAND.full}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0 grayscale-[0.35] contrast-[1.05]"
                />
              ) : (
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full flex-col items-center justify-center gap-3 text-center transition-colors duration-500 hover:bg-line/40"
                >
                  <span className="font-display text-2xl text-ink">
                    {address.line3}
                  </span>
                  <span className="eyebrow">Open in Google Maps →</span>
                </a>
              )}
            </div>

            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-label-sm uppercase text-muted transition-colors hover:text-accent"
            >
              Open in Google Maps →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
