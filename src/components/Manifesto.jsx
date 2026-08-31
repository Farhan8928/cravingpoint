import { SplitLines, ScrollText, Reveal } from './Reveal';

/**
 * Act two: the argument, in type only.
 *
 * Deliberately the one section with no photography. After five viewport heights
 * of food footage the page needs a breath, and an image here would compete with
 * the thing the words are describing. The word-by-word wash gives the reader
 * something to scroll *through* so the pause never reads as a dead patch.
 *
 * The headline is an ingredient list, not a sentence. That is the single biggest
 * copy lesson from the winners in this category — Sunbeam's section headings are
 * "Bagel. Sausage. Cheese. Egg." and "Espresso. Milk. Cinnamon. Maple." Concrete
 * nouns and full stops make a reader taste something; an abstract line about
 * philosophy ("Dessert is not an afterthought", which is what was here) is
 * well-written and completely cold. Appetite first, argument second.
 */
export default function Manifesto() {
  return (
    <section id="about" className="relative bg-ground py-section">
      <div className="mx-auto max-w-container px-gutter">
        <Reveal className="mb-12 flex items-baseline gap-6">
          <span className="eyebrow">01 — What goes in</span>
          <span className="rule flex-1" />
        </Reveal>

        <SplitLines
          as="h2"
          className="font-display text-display-lg text-ink"
          lines={['Cocoa. Butter.', 'Salt. Fire.']}
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 md:col-start-6">
            <ScrollText
              className="text-body-lg leading-relaxed text-ink"
              text="Nothing is plated before you ask for it. Chocolate is tempered by hand and poured warm. Waffles come off the iron in front of you. The charcoal is lit at noon and stays lit. You will wait four minutes, and that wait is the whole point."
            />

            <Reveal delay={0.1} className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                { n: '.88', l: 'The house number' },
                { n: '4 min', l: 'Average wait' },
                { n: '01:00', l: 'Weekend close' },
              ].map((stat) => (
                <div key={stat.l}>
                  <div className="num grad-text text-2xl font-medium">{stat.n}</div>
                  <div className="mt-2 font-mono text-label-sm uppercase text-muted">{stat.l}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
