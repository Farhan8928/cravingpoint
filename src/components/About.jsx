import { BRAND } from '../data/brand';
import { ALTS } from '../data/alts';
import { SplitLines, Reveal, Parallax } from './Reveal';
import Img from './Img';

/**
 * About: the founder, and the only real people on the site.
 *
 * This section exists because of a specific gap. Every other image here is
 * either the client's AI-generated product photography or a stock photograph of
 * a stranger's food — no faces, no hands, nobody who actually works here. That
 * absence is the deepest reason a site reads as generated, and it is the one
 * thing design cannot fix. These two portraits are genuine, so they are given
 * real weight rather than being tucked into a corner.
 *
 * **It degrades honestly.** The founder's name, the year and his quote are still
 * unanswered, and every one of them is rendered only if present. There is no
 * "Founded in 20XX", no lorem quote, no invented name under a real person's
 * face — a fabricated fact sitting beside someone's photograph is a false
 * statement about a real human being, which is worse than a shorter section.
 * Fill in `BRAND.founder` and the missing pieces appear on their own.
 */
export default function About() {
  const { founder } = BRAND;
  const hasName = Boolean(founder?.name);
  const hasQuote = Boolean(founder?.quote);
  const hasSince = Boolean(founder?.since);

  return (
    <section id="about-us" className="bg-tan py-section">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Portrait first in the source order so it leads on mobile — the face
              is the point of the section, not a decoration beside the copy. */}
          <Reveal y={50} className="md:col-span-5">
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden shadow-frame">
                <Parallax amount={10} className="absolute inset-0 -top-[6%] h-[112%]">
                  <Img
                    slug="owner-portrait"
                    alt={ALTS['owner-portrait']}
                    width={1000}
                    height={1250}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    max={1200}
                    className="h-full w-full object-cover"
                  />
                </Parallax>
              </div>

              {/* The second portrait, breaking the lower-right edge. Two real
                  photographs of the same person read as a person; one reads as a
                  headshot. */}
              <div className="absolute -bottom-10 -right-6 hidden w-[36%] max-w-[190px] overflow-hidden border-[6px] border-tan shadow-frame sm:block">
                <div className="aspect-square w-full">
                  <Img
                    slug="owner-candid"
                    alt={ALTS['owner-candid']}
                    width={1200}
                    height={1200}
                    sizes="190px"
                    max={480}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7 md:self-center">
            <Reveal className="mb-5">
              <span className="eyebrow">The counter</span>
            </Reveal>

            <SplitLines
              as="h2"
              className="font-display text-display-md text-ink"
              lines={['One man,', 'one hot plate.']}
            />

            <Reveal delay={0.12} className="mt-8 space-y-6">
              {/* Written from what is actually known and visible: the address,
                  the hours, the products. No invented origin story. */}
              <p className="text-body-lg text-ink-soft">
                Craving Point .88 is a counter on Cheeta Camp Road, not a chain and not
                a franchise. Waffles come off the iron, tubs are filled to the rim in
                front of you, and the wrap goes on the tawa when you order it — which is
                why nothing here is sitting under a lamp waiting for you to arrive.
              </p>

              {hasQuote && (
                <blockquote className="border-l-2 border-accent pl-5">
                  <p className="font-display text-headline italic text-ink">
                    &ldquo;{founder.quote}&rdquo;
                  </p>
                </blockquote>
              )}

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
                {hasName && (
                  <div>
                    <div className="font-display text-xl text-ink">{founder.name}</div>
                    <div className="mt-1 font-mono text-label-sm uppercase text-muted">
                      {founder.role || 'Founder'}
                    </div>
                  </div>
                )}

                {hasSince && (
                  <div>
                    <div className="num grad-text text-xl font-medium">{founder.since}</div>
                    <div className="mt-1 font-mono text-label-sm uppercase text-muted">
                      Serving since
                    </div>
                  </div>
                )}

                <div>
                  <div className="num grad-text text-xl font-medium">Cheeta Camp</div>
                  <div className="mt-1 font-mono text-label-sm uppercase text-muted">
                    Trombay, Mumbai
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
