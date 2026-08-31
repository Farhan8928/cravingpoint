import { BRAND } from '../data/brand';
import { SplitLines, Reveal, Parallax } from './Reveal';
import { Magnetic } from './Cursor';
import Img from './Img';

/**
 * Corporate and bulk gifting — the commercial ask.
 *
 * This is the one section allowed a full-bleed still, because it is selling a
 * volume order rather than a dessert, and a wide table shot is the argument. The
 * image parallaxes inside an overflow-hidden frame: the picture is oversized by
 * the parallax travel so no edge is ever exposed as it moves.
 */
export default function Gifting() {
  return (
    <section id="gifting" className="relative overflow-hidden bg-ink">
      <div className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
        <Parallax amount={18} className="absolute inset-0 -top-[9%] h-[118%]">
          <Img
            slug="still-spread"
            alt="A full table of desserts, brownies, cupcakes and pancakes laid out for service"
            width={2000}
            height={1125}
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </Parallax>

        <div className="cinema-scrim absolute inset-0" />

        <div className="absolute inset-0 mx-auto flex max-w-container flex-col justify-end px-gutter pb-20">
          <Reveal className="mb-6">
            <span className="eyebrow">Bulk & Corporate</span>
          </Reveal>

          <SplitLines
            as="h2"
            className="max-w-3xl font-display text-display-lg text-cream"
            lines={['Gifting that arrives', 'before you do.']}
          />

          <Reveal delay={0.15} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end">
            <p className="lede">
              Festival hampers, office celebrations and event dessert tables, packed in our
              own boxes and delivered across Mumbai. Minimum order twenty boxes; lead time
              is three days.
            </p>

            <Magnetic>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shrink-0"
              >
                Enquire for Bulk Orders
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
