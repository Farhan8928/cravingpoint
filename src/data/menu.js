/**
 * The menu, transcribed from the client's four cards: two dessert boards, a momo
 * board and a shawarma PDF.
 *
 * Live HTML, deliberately — not the card photographs. A menu shipped as an image
 * or a PDF cannot be searched, selected, read aloud, translated or resized, and
 * this is the page most likely to be opened on a phone by someone standing
 * outside the shop. Restaurants moving a menu from PDF to real markup report
 * materially more completed orders. The cards stay in `assets-src/` as the source
 * of truth for proofreading, not as the thing visitors read.
 *
 * ## Shape
 *
 * `group`    'sweet' | 'savoury' — the two counters the section switches between.
 * `columns`  turns a category into a two-price table. The cards price waffles by
 *            Slice 1 / Slice 2 and bowls by Small / Large; `prices` is an array
 *            positionally matching `columns`. `null` means the card leaves that
 *            cell blank — the overloaded waffle cake has no second slice price.
 * `image`    a category's feature photo. Only some have one, on purpose: a photo
 *            per row across 80 items is a scroll nobody finishes.
 * `photos`   set when every item in the category has its own picture, which is
 *            true only of the momos. That category renders as a photo grid.
 *
 * ## ⚠ For the client to confirm
 *
 * 1. **"Milkst chocolate bowl"** is transcribed exactly as printed and is almost
 *    certainly a typo on the card. Left alone rather than guessed at.
 * 2. Clear misspellings **were** corrected, since the site is not a facsimile of
 *    the card: Brawnie → Brownie, Crape → Crepe, Tendori → Tandoori, Chatptta →
 *    Chatpata, Chipodli → Chipotle, Sawarma → Shawarma, Romali → Rumali. Say the
 *    word and any of them go back.
 * 3. The **shawarma card has no photographs**, so that counter leans on the two
 *    wrap images the client sent separately.
 *
 * Prices are the client's own, in rupees, exactly as printed.
 */
export const COLLECTIONS = [
  // ─────────────────────────── SWEET ───────────────────────────
  {
    id: 'waffle',
    group: 'sweet',
    title: 'Waffle',
    blurb: 'Pressed to order, drizzled warm. Priced by the slice.',
    columns: ['Slice 1', 'Slice 2'],
    image: 'dish-waffle',
    items: [
      { name: 'Waffle chocolate classic', prices: [45, 70] },
      { name: 'Waffle dark and white chocolate', prices: [65, 85] },
      { name: 'Waffle dark delight', prices: [70, 95] },
      { name: 'Triple chocolate waffle', prices: [80, 95] },
      { name: 'Almond chocolate waffle', prices: [95, 100] },
      { name: 'Brownie chocolate waffle', prices: [65, 120] },
      { name: 'Ice cream chocolate waffle', prices: [85, 130] },
      { name: 'Vanilla chocolate waffle', prices: [85, 95] },
      { name: 'Waffle chocolate sandwich', prices: [100, 120] },
      { name: 'Waffle chocolate sandwich with ice cream', prices: [120, 150] },
      { name: 'Waffle chocolate sandwich (triple chocolate)', prices: [130, 150] },
      { name: 'Waffle chocolate sandwich, ice cream & triple chocolate', prices: [150, 160] },
      { name: 'Kit Kat waffle', prices: [70, 100] },
      { name: 'Oreo waffle', prices: [75, 100] },
      { name: 'Ferrero Rocher waffle', prices: [160, 200] },
      { name: 'Biscoff waffle', prices: [100, 200] },
      { name: 'Waffle pistachio', prices: [85, 150] },
      { name: 'Waffle cake (overloaded)', prices: [250, null], tag: 'Overloaded' },
    ],
  },
  {
    id: 'bowl',
    group: 'sweet',
    title: 'Chocolate Bowl',
    blurb: 'Filled to the rim at the counter. Any bowl can be customised.',
    columns: ['Small', 'Large'],
    image: 'dish-tub',
    items: [
      { name: 'Chocolate classic bowl', prices: [90, 140] },
      { name: 'Dark chocolate bowl', prices: [110, 145] },
      { name: 'Triple chocolate bowl', prices: [120, 150] },
      { name: 'Milkst chocolate bowl', prices: [150, 200] },
      { name: 'Dark delight bowl', prices: [100, 150] },
      { name: 'Roasted almond classic bowl', prices: [110, 150] },
      { name: 'KitKat bowl', prices: [110, 150] },
      { name: 'Oreo bowl', prices: [110, 160] },
      { name: 'Strawberry spread bowl', prices: [100, 150] },
      { name: 'Ferrero Rocher bowl', prices: [150, 200] },
      { name: 'Biscoff bowl', prices: [150, 250] },
    ],
  },
  {
    id: 'pancake',
    group: 'sweet',
    title: 'Pan Cake',
    blurb: 'Off the plate in stacks, sticks and bowls.',
    items: [
      { name: 'Pan cake classic', prices: [45] },
      { name: 'Pan cake dark and white', prices: [65] },
      { name: 'Pan cake dark delight', prices: [70] },
      { name: 'Pan cake stick', prices: [50] },
      { name: 'Pan cake bowl', prices: [95] },
      { name: 'Triple chocolate pan cake', prices: [100] },
      { name: 'Roasted almond pan cake', prices: [110] },
      { name: 'Biscoff pan cake', prices: [120] },
      { name: 'Over load pan cake', prices: [220], tag: 'Overloaded' },
      { name: 'Crepe pan cake', prices: [120] },
    ],
  },
  {
    id: 'brownie',
    group: 'sweet',
    title: 'Brownie',
    blurb: 'Bites and tubs, loaded as far as they will go.',
    items: [
      { name: 'Chocolate brownie bite (bowl) classic', prices: [150] },
      { name: 'Oreo brownie bite', prices: [180] },
      { name: 'KitKat brownie bite', prices: [165] },
      { name: 'Triple chocolate brownie bite', prices: [160] },
      { name: 'Ferrero Rocher bite', prices: [200] },
      { name: 'Brownie bite over loaded', prices: [180], tag: 'Overloaded' },
      { name: 'KitKat brownie tub', prices: [280] },
    ],
  },
  {
    id: 'special',
    group: 'sweet',
    title: 'Craving Special',
    blurb: 'The house sundaes. What the counter is known for.',
    image: 'dish-sundae',
    items: [
      { name: 'Waffle sundae', prices: [250], tag: 'Signature' },
      { name: 'Oreo sundae', prices: [280] },
      { name: 'Kit Kat sundae', prices: [260] },
      { name: 'Pan cake sundae', prices: [250] },
      { name: 'Brownie sundae', prices: [280] },
    ],
  },
  {
    id: 'bombolone',
    group: 'sweet',
    title: 'Bombolone',
    note: '3 pieces',
    blurb: 'Sugar-dusted, filled to order.',
    image: 'dish-doughnut',
    items: [
      { name: 'Bombolone (classic chocolate)', prices: [120] },
      { name: 'Bombolone (triple chocolate)', prices: [150] },
    ],
  },
  {
    id: 'churro',
    group: 'sweet',
    title: 'Churro',
    note: '5 pieces',
    blurb: 'Ridged, fried to order, dipped deep.',
    items: [
      { name: 'Churro (classic chocolate)', prices: [90] },
      { name: 'Churro (triple chocolate)', prices: [150] },
    ],
  },
  {
    id: 'cake',
    group: 'sweet',
    title: 'Cake',
    items: [{ name: 'Biscoff cake', prices: [150] }],
  },

  // ────────────────────────── SAVOURY ──────────────────────────
  {
    /**
     * The only category where every item has its own photograph, so it is the
     * only one that renders as a grid. The pictures came off the client's momo
     * card, one crop per tile.
     */
    id: 'momo',
    group: 'savoury',
    title: 'Momos',
    note: '6 pieces',
    blurb: 'Steamed or fried to order, sauced at the counter.',
    photos: true,
    items: [
      { name: 'Chicken steam momo', prices: [70], image: 'momo-steam', tag: 'Bestseller' },
      { name: 'Chicken fry momo', prices: [80], image: 'momo-fry' },
      { name: 'Chicken boom boom yellow sauce momo', prices: [120], image: 'momo-boomboom' },
      { name: 'Chicken steam tandoori sauce momo', prices: [120], image: 'momo-tandoori' },
      { name: 'Chicken chatpata steam momo', prices: [120], image: 'momo-chatpata' },
      { name: 'Chicken cheese white pasta sauce momo', prices: [120], image: 'momo-cheese' },
    ],
  },
  {
    id: 'shawarma',
    group: 'savoury',
    title: 'Chicken Shawarma',
    blurb: 'Off the spit, rolled to order.',
    image: 'dish-wrap',
    items: [
      { name: 'Shawarma', prices: [50] },
      { name: 'Open shawarma', prices: [100] },
      { name: 'Chicken fries bowl', prices: [110] },
      { name: 'Special shawarma', prices: [100] },
      { name: 'Chicken seekh shawarma', prices: [100] },
      { name: 'Rumali roti shawarma', prices: [60] },
      { name: 'Rumali roti chicken seekh shawarma', prices: [110] },
    ],
  },
  {
    id: 'shawarma-special',
    group: 'savoury',
    title: 'Shawarma Special',
    blurb: 'The sauced range.',
    items: [
      { name: 'Seekh shawarma', prices: [100] },
      { name: 'BBQ shawarma', prices: [80] },
      { name: 'Tandoori shawarma', prices: [80] },
      { name: 'Chipotle shawarma', prices: [80] },
      { name: 'Liquid cheese shawarma', prices: [80] },
      { name: 'Mint sauce shawarma', prices: [80] },
      { name: 'Peri peri shawarma', prices: [80] },
      { name: 'Over load chicken shawarma', prices: [100], tag: 'Overloaded' },
    ],
  },
  {
    id: 'combo',
    group: 'savoury',
    title: 'Combo',
    blurb: 'Both counters in one order.',
    image: 'dish-combo',
    items: [
      {
        name: 'Chicken shawarma fries bowl + classic chocolate bowl',
        note: 'Campa Cola 200ml free',
        prices: [200],
        tag: 'Combo',
      },
    ],
  },
];

/** The two counters the Collection section switches between. */
export const GROUPS = [
  { id: 'sweet', title: 'Sweet' },
  { id: 'savoury', title: 'Savoury' },
];

/** Words for the infinite marquee between acts. */
export const MARQUEE_WORDS = [
  'Every bite, pure delight',
  'Poured warm',
  'Made to order',
  'Open till one',
  'Cheeta Camp',
  'Customise any bowl',
];
