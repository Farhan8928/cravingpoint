/**
 * The menu, split by counter rather than by course.
 *
 * `still` names an asset emitted by scripts/process-frames.mjs — the product
 * photography on this site is pulled straight out of the two film sequences, so
 * the cards and the scroll footage are literally the same shoot. Cards without
 * a still fall back to a typographic treatment rather than a stock placeholder;
 * a wrong photo of a dessert is worse than no photo.
 *
 * ⚠ Prices are illustrative. Confirm against the current counter menu.
 */
export const COLLECTIONS = [
  {
    id: 'desserts',
    eyebrow: 'The Sweet Counter',
    title: 'Desserts',
    blurb:
      'Built to order, finished at the pass. Chocolate is poured warm over everything that asks for it.',
    items: [
      {
        name: 'Signature Sea Salt Brownie',
        note: 'Molten dark chocolate, Atlantic sea salt, served warm',
        price: '₹280',
        tags: ['Signature'],
        still: 'still-pour',
      },
      {
        name: 'Belgian Waffle Cup',
        note: 'Waffle bites, brownie chunk, hand-poured couverture',
        price: '₹320',
        tags: ['Bestseller'],
        still: 'still-spread',
      },
      {
        name: 'Molten Chocolate Jar',
        note: 'Layered ganache and sponge, taken to the table still warm',
        price: '₹300',
        tags: [],
        still: null,
      },
      {
        name: 'Vanilla Bean Sundae',
        note: 'Madagascar vanilla, dark chocolate ribbon, candied pecan',
        price: '₹260',
        tags: [],
        still: null,
      },
      {
        name: 'Buttermilk Pancake Stack',
        note: 'Four high, maple butter, seasonal fruit',
        price: '₹290',
        tags: [],
        still: null,
      },
      {
        name: 'Gold Leaf Petit Fours',
        note: 'Delicate chocolate ganache, 24k gold leaf — by order',
        price: '₹640',
        tags: ['Limited'],
        still: null,
      },
    ],
  },
  {
    id: 'grill',
    eyebrow: 'The Hot Counter',
    title: 'The Grill',
    blurb:
      'Charcoal-marked, folded to order, wrapped while the tawa is still loud. The savoury half of the room.',
    items: [
      {
        name: 'Signature Chicken Wrap',
        note: 'Charcoal-grilled thigh, red onion, cucumber, house sauce',
        price: '₹260',
        tags: ['Signature'],
        still: 'still-wrap',
      },
      {
        name: 'Peri Peri Grill Wrap',
        note: 'Double-marinated, finished on the flame',
        price: '₹280',
        tags: ['Hot'],
        still: 'still-grill',
      },
      {
        name: 'Cheese Melt Wrap',
        note: 'Three cheeses, caramelised onion, pressed till it gives',
        price: '₹250',
        tags: [],
        still: null,
      },
      {
        name: 'Loaded Fries',
        note: 'Grill trimmings, molten cheese, house seasoning',
        price: '₹220',
        tags: [],
        still: null,
      },
    ],
  },
];

/** The three cards that carry the Collection section. Kept short on purpose. */
export const SIGNATURES = COLLECTIONS.flatMap((c) => c.items)
  .filter((i) => i.still)
  .slice(0, 4);

/** Words for the infinite marquee between acts. */
export const MARQUEE_WORDS = [
  'Hand-poured chocolate',
  'Charcoal grill',
  'Made to order',
  'Trombay, Mumbai',
  'Open till late',
  'Bulk & corporate gifting',
];
