/**
 * The menu, split by counter rather than by course.
 *
 * `image` names an asset emitted by scripts/process-images.mjs. Every item has
 * one — that is what lets the Collection section be a real editorial layout
 * instead of a list with a few photographs floating over it.
 *
 * ⚠ The dish photography is currently Unsplash placeholder, not Craving Point's
 * own food. See CREDITS.md. Swapping it is a one-line change per dish in
 * scripts/process-images.mjs; nothing here needs to move.
 *
 * ⚠ Prices are illustrative. Confirm against the current counter menu.
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
        name: 'Signature Sea Salt Brownie',
        note: 'Molten dark chocolate, Atlantic sea salt, served warm',
        price: '₹280',
        tags: ['Signature'],
        image: 'dish-brownie',
      },
      {
        name: 'Belgian Waffle Cup',
        note: 'Waffle bites, brownie chunk, hand-poured couverture',
        price: '₹320',
        tags: ['Bestseller'],
        image: 'dish-waffle',
      },
      {
        name: 'Molten Chocolate Jar',
        note: 'Layered ganache and sponge, taken to the table still warm',
        price: '₹300',
        tags: [],
        image: 'dish-molten-jar',
      },
      {
        name: 'Vanilla Bean Sundae',
        note: 'Madagascar vanilla, dark chocolate ribbon, candied pecan',
        price: '₹260',
        tags: [],
        image: 'dish-sundae',
      },
      {
        name: 'Buttermilk Pancake Stack',
        note: 'Four high, maple butter, seasonal fruit',
        price: '₹290',
        tags: [],
        image: 'dish-pancakes',
      },
      {
        name: 'Gold Leaf Petit Fours',
        note: 'Delicate chocolate ganache, 24k gold leaf — by order',
        price: '₹640',
        tags: ['Limited'],
        image: 'dish-petitfours',
      },
    ],
  },
  {
    id: 'grill',
    eyebrow: 'The Hot Counter',
    title: 'The Grill',
    blurb:
      'Marked on charcoal, folded to order, cut while the tawa is still loud.',
    items: [
      {
        name: 'Signature Chicken Wrap',
        note: 'Charcoal-grilled thigh, red onion, cucumber, house sauce',
        price: '₹260',
        tags: ['Signature'],
        image: 'dish-wrap',
      },
      {
        name: 'Peri Peri Grill Wrap',
        note: 'Double-marinated, finished on the flame',
        price: '₹280',
        tags: ['Hot'],
        image: 'dish-periperi',
      },
      {
        name: 'Cheese Melt Wrap',
        note: 'Three cheeses, caramelised onion, pressed till it gives',
        price: '₹250',
        tags: [],
        image: 'dish-cheesemelt',
      },
      {
        name: 'Loaded Fries',
        note: 'Grill trimmings, molten cheese, house seasoning',
        price: '₹220',
        tags: [],
        image: 'dish-fries',
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
