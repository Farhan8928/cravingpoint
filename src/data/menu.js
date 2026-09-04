/**
 * The menu, split by counter.
 *
 * Rewritten from the client's own product photography. The previous version was
 * largely invented — "Signature Sea Salt Brownie", "Gold Leaf Petit Fours",
 * "Molten Chocolate Jar" — and described a patisserie this shop is not. The real
 * counter is waffle slices, kraft tubs loaded with chocolate, sundaes,
 * cream doughnuts and a chicken wrap. Writing a menu the shop does not serve is
 * worse than a short one.
 *
 * ⚠ ONE THING THE CLIENT STILL NEEDS TO CONFIRM:
 *
 * **This is only what the photographs show.** If the counter serves more —
 * shakes, brownies, other wraps — add them here with a photo each; the
 * Collection section is driven entirely by this file.
 *
 * Prices are deliberately **not** on the site. A street counter changes them
 * more often than a website gets redeployed, and a stale price is worse than no
 * price: it is a promise the counter has to either honour or argue about. The
 * WhatsApp button is the quote.
 *
 * `image` names an asset emitted by scripts/process-images.mjs. Every item needs
 * one: the layout uses a thumbnail on mobile and a sticky panel on desktop, and
 * an item without a photograph would render as a hole in both.
 */
export const COLLECTIONS = [
  {
    id: 'desserts',
    eyebrow: 'The Sweet Counter',
    title: 'Desserts',
    blurb:
      'Everything is finished at the pass. If it can take warm chocolate, it gets warm chocolate.',
    items: [
      {
        name: 'Belgian Waffle Slice',
        note: 'Cut thick, drizzled warm, eaten off the board',
        tags: ['Signature'],
        image: 'dish-waffle',
      },
      {
        name: 'The Loaded Tub',
        note: 'Chocolate chunk, Ferrero, Oreo or caramel. Filled to the rim',
        tags: ['Bestseller'],
        image: 'dish-tub',
      },
      {
        name: 'Sundae',
        note: 'Cream, crushed nuts, wafer, sauce and a cherry on top',
        tags: [],
        image: 'dish-sundae',
      },
      {
        name: 'Cream Doughnut',
        note: 'Sugar-dusted, filled to order, still soft',
        tags: [],
        image: 'dish-doughnut',
      },
    ],
  },
  {
    id: 'grill',
    eyebrow: 'The Hot Counter',
    title: 'The Grill',
    blurb: 'Marked on charcoal, folded to order, cut while the tawa is still loud.',
    items: [
      {
        name: 'Steamed Momos',
        note: 'Hand-pleated, steamed to order, with the red chutney',
        tags: [],
        image: 'dish-momos',
      },
      {
        name: 'Chicken Wrap',
        note: 'Grilled strips, red onion, cucumber, house sauce',
        tags: ['Signature'],
        image: 'dish-wrap',
      },
      {
        name: 'The Combo',
        note: 'Wrap, waffle slice, a loaded tub and a cold drink',
        tags: ['Sharing'],
        image: 'dish-combo',
      },
    ],
  },
];

/** Words for the infinite marquee between acts. */
export const MARQUEE_WORDS = [
  'Poured warm',
  'Lit at noon',
  'Four minutes',
  'Open till one',
  'Cheeta Camp',
  'Twenty boxes, three days',
];
