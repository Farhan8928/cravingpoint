import { BRAND } from '../data/brand';
import { SplitLines, Reveal } from './Reveal';
import { Magnetic } from './Cursor';

/**
 * Where to find the place, and how to order from it.
 *
 * The last section before the footer is the one people scroll to on purpose,
 * usually on a phone, usually already outside. So it is the plainest block on
 * the site: no scrub, no parallax, no hover states that a thumb cannot trigger.
 * Address, hours, and two tappable actions.
 *
 * The map is an iframe only when `mapEmbed` is configured. An empty Google Maps
 * embed renders as a grey box with an error in it, which is worse than a text
 * address and a link out.
 */
export default function Visit() {
  const { address, hours } = BRAND;
  const mapQuery = encodeURIComponent(
    `${BRAND.full}, ${address.line1}, ${address.line2}, ${address.region}`
  );

  return (
    <section id="visit" className="bg-ink-deep py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-center gap-6">
          <span className="eyebrow">Visit</span>
          <span className="rule flex-1" />
        </Reveal>

        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <SplitLines
              as="h2"
              className="font-display text-display-md text-cream"
              lines={['Find the', 'counter.']}
            />

            <Reveal delay={0.1} className="mt-10 space-y-10">
              <div>
                <h3 className="text-label uppercase text-cream/40">Address</h3>
                <address className="mt-3 not-italic text-body-lg text-cream/80">
                  {address.line1}
                  <br />
                  {address.line2}
                  <br />
                  {address.region}
                </address>
              </div>

              <div>
                <h3 className="text-label uppercase text-cream/40">Hours</h3>
                <dl className="mt-3 space-y-2">
                  {hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-6 text-cream/80">
                      <dt>{h.days}</dt>
                      <dd className="tabular-nums text-cream/60">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-wrap gap-4">
                <Magnetic>
                  <a
                    href={BRAND.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Message on WhatsApp
                  </a>
                </Magnetic>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Get Directions
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-outline-variant/40 bg-ink-low">
              {BRAND.mapEmbed ? (
                <iframe
                  src={BRAND.mapEmbed}
                  title={`Map to ${BRAND.full}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0 grayscale-[0.9] contrast-125 invert-[0.92] hue-rotate-180"
                />
              ) : (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full flex-col items-center justify-center gap-3 text-center transition-colors duration-500 hover:bg-white/[0.03]"
                >
                  <span className="font-display text-2xl text-cream">
                    {address.line1}, {address.line2}
                  </span>
                  <span className="eyebrow">Open in Google Maps →</span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
