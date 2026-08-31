import { SplitLines, ScrollText, Reveal } from './Reveal';

/**
 * Act two: the argument, in type only.
 *
 * Deliberately the one section with no photography. After five viewport heights
 * of food footage the page needs a breath, and an image here would compete with
 * the thing the words are describing. The word-by-word wash gives the reader
 * something to scroll *through* so the pause never reads as a dead patch.
 *
 * This is also the first bone-paper section, so it carries the handover from the
 * cinematic opening to the editorial body of the site.
 */
export default function Manifesto() {
  return (
    <section id="about" className="relative bg-ground py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-14 flex items-baseline gap-6">
          <span className="eyebrow">01 — Our Passion</span>
          <span className="rule flex-1" />
        </Reveal>

        <SplitLines
          as="h2"
          className="font-display text-display-lg text-ink"
          lines={['Dessert is not', 'an afterthought.']}
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            <ScrollText
              className="text-body-lg leading-relaxed text-ink"
              text="We treat the last course the way a kitchen treats its first. Chocolate is tempered and poured by hand, waffles come off the iron to order, and nothing is plated before someone asks for it. The result is a counter where the wait is part of what you came for."
            />

            <Reveal delay={0.1} className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                { n: '.88', l: 'The house number' },
                { n: '100%', l: 'Made to order' },
                { n: '01:00', l: 'Weekend close' },
              ].map((stat) => (
                <div key={stat.l}>
                  <div className="font-display text-3xl text-accent">{stat.n}</div>
                  <div className="mt-2 text-label-sm uppercase text-muted">{stat.l}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
