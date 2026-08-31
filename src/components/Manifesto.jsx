import { SplitLines, ScrollText, Reveal } from './Reveal';

/**
 * Act two: the argument, in type only.
 *
 * Deliberately the one section with no photography. After five viewport heights
 * of food footage the page needs a breath, and putting an image here would make
 * the manifesto compete with the thing it is describing. The word-by-word wash
 * gives the reader something to scroll *through* so the pause never reads as a
 * dead patch.
 */
export default function Manifesto() {
  return (
    <section id="about" className="relative bg-ink py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-16 flex items-center gap-6">
          <span className="eyebrow">Our Passion</span>
          <span className="rule flex-1" />
        </Reveal>

        <SplitLines
          as="h2"
          className="font-display text-display-lg text-cream"
          lines={['Dessert is not', 'an afterthought.']}
        />

        <div className="mt-16 grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            <ScrollText
              className="text-body-lg leading-relaxed text-cream"
              text="At Craving Point .88 we treat the last course the way a kitchen treats its first. Chocolate is tempered and poured by hand, waffles come off the iron to order, and nothing is plated before someone asks for it. The result is a counter where the wait is part of the thing you came for."
            />

            <Reveal delay={0.1} className="mt-14 grid grid-cols-2 gap-10 sm:grid-cols-3">
              {[
                { n: '.88', l: 'The house number' },
                { n: '100%', l: 'Made to order' },
                { n: '01:00', l: 'Weekend close' },
              ].map((stat) => (
                <div key={stat.l}>
                  <div className="font-display text-4xl text-gold">{stat.n}</div>
                  <div className="mt-2 text-label-sm uppercase text-cream/40">{stat.l}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
