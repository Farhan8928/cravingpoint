import { SplitLines, ScrollText, Reveal } from './Reveal';
import Img from './Img';

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
    <section id="about" className="relative bg-ground pb-24 pt-section">
      <div className="mx-auto max-w-container px-gutter">
        {/* No eyebrow, no rule. Every section used to open with an identical
            `0N — Label` + hairline scaffold; five of those in a row is the
            "every section is the same block" tell, and the numbering makes it
            read as a generated outline. This one opens cold on the headline. */}
        <SplitLines
          as="h2"
          className="font-display text-display-lg text-ink"
          lines={['Cocoa. Butter.', 'Salt. Fire.']}
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          {/* A still from the reel, filling what was a large empty quarter.
              Big voids on wide monitors are the "responsive by default, empty by
              design" tell — the layout reads as unfinished rather than airy. It
              is also the one frame that shows the thing the copy describes, so
              it earns its place beyond just occupying space. */}
          <Reveal delay={0.15} y={40} className="md:col-span-4 md:col-start-1 md:row-start-1 md:self-end">
            <figure className="overflow-hidden shadow-frame">
              <Img
                slug="still-waffle"
                alt="Warm chocolate being poured over a Belgian waffle"
                width={1600}
                height={900}
                max={800}
                sizes="(min-width: 768px) 30vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </figure>
            <figcaption className="mt-3 font-mono text-label-sm uppercase text-muted">
              Couverture, poured at the pass
            </figcaption>
          </Reveal>

          <div className="md:col-span-7 md:col-start-6">
            <ScrollText
              className="text-body-lg leading-relaxed text-ink"
              text="Nothing is plated before you ask for it. Chocolate is tempered by hand and poured warm. Waffles come off the iron in front of you. The charcoal is lit at noon and stays lit. You will wait four minutes, and that wait is the whole point."
            />

            <Reveal delay={0.1} className="mt-12 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:max-w-md">
              {/* Two facts, not a three-up stat grid. An evenly divided row of
                  big numbers is decorative by default, and ".88 / the house
                  number" was filler dressed as data. These two are things a
                  customer actually acts on. */}
              {[
                { n: '4 min', l: 'Average wait at the pass' },
                { n: '01:00', l: 'Friday to Sunday close' },
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
