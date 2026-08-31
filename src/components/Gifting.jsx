import { BRAND } from '../data/brand';
import { SplitLines, Reveal, Parallax } from './Reveal';
import { Magnetic } from './Cursor';
import Img from './Img';

/**
 * Corporate and bulk gifting — the commercial ask.
 *
 * On the paper ground the image is a *framed window* rather than a full-bleed
 * band: inset, with the copy beside it instead of on top. That is the editorial
 * move the light theme is built for, and it means the photograph never has to
 * carry white text over its bright areas.
 *
 * The picture parallaxes inside an overflow-hidden frame, oversized by exactly
 * the parallax travel so no edge is ever exposed as it moves.
 */
export default function Gifting() {
  return (
    <section id="gifting" className="block-ember py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-baseline gap-6">
          <span className="eyebrow !text-block-accent">04 — Bulk &amp; corporate</span>
          <span className="h-px flex-1 bg-white/25" />
        </Reveal>

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <SplitLines
              as="h2"
              className="font-display text-display-md text-block-ink"
              lines={['Twenty boxes.', 'Three days. One van.']}
            />

            <Reveal delay={0.12} className="mt-8">
              <p className="max-w-prose text-body-lg text-block-muted">
                Festival hampers, office parties, wedding dessert tables. Packed in our
                own boxes, sealed warm, driven across Mumbai the morning you need them.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-white/25 pt-6">
                <div>
                  <dt className="font-mono text-label-sm uppercase text-block-muted">Minimum order</dt>
                  <dd className="num mt-1.5 text-xl text-block-ink">20 boxes</dd>
                </div>
                <div>
                  <dt className="font-mono text-label-sm uppercase text-block-muted">Lead time</dt>
                  <dd className="num mt-1.5 text-xl text-block-ink">3 days</dd>
                </div>
              </dl>

              <Magnetic className="mt-10">
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Enquire"
                  className="btn rounded-full bg-block-ink text-[#7e2a14] transition-colors hover:bg-white"
                >
                  Send us the numbers
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={50} className="md:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden shadow-frame">
              <Parallax amount={14} className="absolute inset-0 -top-[8%] h-[116%]">
                <Img
                  slug="still-spread"
                  alt="A full table of desserts, brownies, cupcakes and pancakes laid out for service"
                  width={2000}
                  height={1125}
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </Parallax>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
