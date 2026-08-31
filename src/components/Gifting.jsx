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
    <section id="gifting" className="bg-sunken py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-baseline gap-6">
          <span className="eyebrow">04 — Bulk &amp; Corporate</span>
          <span className="rule flex-1" />
        </Reveal>

        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <SplitLines
              as="h2"
              className="font-display text-display-md text-ink"
              lines={['Gifting that arrives', 'before you do.']}
            />

            <Reveal delay={0.12} className="mt-8">
              <p className="lede">
                Festival hampers, office celebrations and event dessert tables, packed in
                our own boxes and delivered across Mumbai.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
                <div>
                  <dt className="font-mono text-label-sm uppercase text-muted">Minimum order</dt>
                  <dd className="num mt-1.5 text-xl text-ink">20 boxes</dd>
                </div>
                <div>
                  <dt className="font-mono text-label-sm uppercase text-muted">Lead time</dt>
                  <dd className="num mt-1.5 text-xl text-ink">3 days</dd>
                </div>
              </dl>

              <Magnetic className="mt-10">
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Enquire"
                  className="btn-primary rounded-full"
                >
                  Enquire for bulk orders
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
