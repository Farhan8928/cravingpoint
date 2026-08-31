import { BRAND } from '../data/brand';
import { ALTS } from '../data/alts';
import { SplitLines, Reveal, Parallax } from './Reveal';
import { Magnetic } from './Cursor';
import Img from './Img';

/**
 * Corporate and bulk gifting — the commercial ask, on the ember block.
 *
 * The photography here is deliberately *not* from the client's film. That
 * footage is AI-generated, and the wide dessert-table frame that used to sit
 * here read as a render: impossibly symmetrical, every plate lit identically, no
 * hands anywhere. On the one section asking a business to place a twenty-box
 * order, a picture that looks synthetic undercuts the claim it is making. Both
 * images are now genuine photographs — creased kraft cardboard, real crumb, a
 * real hand holding the box out.
 *
 * Two images rather than one, offset and overlapping. A single rectangle beside
 * a column of text is the layout every template ships; a large frame with a
 * smaller portrait breaking its lower edge reads as art direction, and it lets
 * the section show both halves of the pitch — the box, and the handover.
 *
 * The overlap carries a cream border so it separates from the photograph it sits
 * on. Without it the two images merge into one shape.
 */
export default function Gifting() {
  return (
    <section id="gifting" className="block-ember overflow-hidden py-section">
      <div className="mx-auto max-w-container px-gutter">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal className="mb-5">
              <span className="eyebrow">Bulk &amp; corporate</span>
            </Reveal>
            <SplitLines
              as="h2"
              className="font-display text-display-md text-ink"
              lines={['Twenty boxes.', 'Three days. One van.']}
            />

            <Reveal delay={0.12} className="mt-8">
              <p className="max-w-prose text-body-lg text-muted">
                Festival hampers, office parties, wedding dessert tables. Packed in our
                own boxes, sealed warm, driven across Mumbai the morning you need them.
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-5 border-t border-white/25 pt-6">
                {[
                  ['Minimum order', '20 boxes'],
                  ['Lead time', '3 days'],
                  ['Delivery', 'All Mumbai'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-label-sm uppercase text-muted">{k}</dt>
                    <dd className="num mt-1.5 text-lg text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              <Magnetic className="mt-10">
                <a
                  href={BRAND.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="Enquire"
                  // Solid cream, not the gradient — a gradient button on a
                  // gradient block disappears into it.
                  className="btn rounded-full bg-ink text-[#7e2a14] transition-colors hover:bg-white"
                >
                  Send us the numbers
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* Bottom padding on the column reserves room for the overlap, which is
              absolutely positioned and would otherwise be clipped by the
              section's own overflow-hidden. */}
          <Reveal delay={0.1} y={50} className="md:col-span-7 md:pb-16">
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden shadow-frame">
                <Parallax amount={12} className="absolute inset-0 -top-[7%] h-[114%]">
                  <Img
                    slug="gift-boxes"
                    alt={ALTS['gift-boxes']}
                    width={1600}
                    height={1200}
                    sizes="(min-width: 768px) 58vw, 100vw"
                    max={1200}
                    className="h-full w-full object-cover"
                  />
                </Parallax>
              </div>

              {/* The handover shot, breaking the lower-left edge. Hidden on the
                  smallest screens, where two frames would be too small to read
                  and the offset just looks like a layout bug. */}
              <div className="absolute -bottom-12 -left-8 hidden w-[38%] max-w-[220px] overflow-hidden border-[6px] border-ink shadow-frame sm:block">
                <div className="aspect-[4/5] w-full">
                  <Img
                    slug="gift-detail"
                    alt={ALTS['gift-detail']}
                    width={1000}
                    height={1250}
                    sizes="220px"
                    max={480}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
