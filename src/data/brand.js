/**
 * Every fact about the business that appears on the page, in one place.
 *
 * The prototypes this site replaces carried the address inline in three
 * different sections and the WhatsApp link as a bare `wa.me/` with no number,
 * which is a dead link that still looks alive. Centralising it means the phone
 * number is wrong in one place or right in one place, never both at once.
 *
 * ⚠ PLACEHOLDERS — the source prototypes contained no real contact details.
 * Replace `phone`, `whatsapp`, `email`, `instagram` and `mapEmbed` before this
 * goes live. Anything still reading `PLACEHOLDER` is not shippable.
 */
export const BRAND = {
  name: 'Craving Point',
  suffix: '.88',
  full: 'Craving Point .88',
  // Was 'The Art of Indulgence'. A vague aspirational line that could sit on
  // any dessert brand on earth is the textbook generated-copy tell; this one
  // says something only this shop can say.
  // The counter's own line, printed on every card.
  tagline: 'Every bite, pure delight',
  description:
    'Waffles, loaded tubs and charcoal wraps in Cheeta Camp, Trombay. Made when you ask, not before.',

  // Both numbers are printed on the counter's own momo card. The first is the
  // one the site dials and opens WhatsApp on; the second is listed as a backup.
  phone: '+917021235530',
  phoneDisplay: '+91 70212 35530',
  phoneAlt: '+919004756897',
  phoneAltDisplay: '+91 90047 56897',
  whatsapp: 'https://wa.me/917021235530',
  // ⚠ PLACEHOLDER — replace with the real address or drop it from the footer.
  email: 'hello@cravingpoint.example',

  address: {
    line1: 'Shop No. 29, F-Sector',
    line2: 'Cheeta Camp Road, near Noor Masjid',
    line3: 'Cheeta Camp, Trombay, Mumbai',
    region: 'Maharashtra 400088',
    country: 'IN',
  },

  /**
   * Straight from the Google Maps listing, so directions and the embed both
   * resolve to the real pin rather than to a text search that can drift onto a
   * similarly-named place.
   */
  geo: { lat: 19.0394646, lng: 72.9470021 },
  mapsPlaceId: '0x3be7c5935772838b:0x126007ebe0ae162e',
  mapsDirections:
    'https://www.google.com/maps/dir//Craving+Point,+SHOP+NO.+29,+F-SECTOR,+Cheeta+Camp+Rd,+near+Noor+Masjid,+Cheeta+Camp,+Trombay,+Mumbai,+Maharashtra+400088/@19.0394646,72.9470021,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3be7c5935772838b:0x126007ebe0ae162e!2m2!1d72.9470021!2d19.0394646',

  /**
   * The founder, for the About section.
   *
   * ⚠ THREE FIELDS STILL NEED THE CLIENT'S ANSWER. They are marked `null`
   * rather than filled with a plausible guess, and the About section is built to
   * *omit* whatever is still null rather than print a placeholder. A fabricated
   * name, founding year or quote attributed to a real person is worse than a
   * shorter section — it is a false statement about someone who exists, sitting
   * next to their photograph.
   *
   * Fill these three in and the section completes itself. Nothing else to touch.
   */
  founder: {
    /** e.g. 'Farhan Shaikh' — the name shown under the portrait. */
    name: null,
    /** e.g. 'Founder' or 'Owner'. Falls back to 'Founder' if left null. */
    role: 'Founder',
    /** e.g. 2023 — the year the counter opened. Omitted entirely if null. */
    since: null,
    /**
     * One or two sentences in his own words: why he started it, what he wanted
     * the counter to be. Omitted entirely if null.
     */
    quote: null,
  },

  hours: [
    { days: 'Monday to Thursday', time: '12:00 – 23:30' },
    { days: 'Friday to Sunday', time: '12:00 – 01:00' },
  ],

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/cravingpoint88/' },
    { label: 'WhatsApp', href: 'https://wa.me/919819940231' },
  ],

  /**
   * The classic `/maps?q=...&output=embed` form takes coordinates directly and
   * needs no API key, so the map works on first deploy. Swap in a Maps
   * Embed API URL later if you want the branded pin and Street View controls.
   */
  mapEmbed:
    'https://www.google.com/maps?q=19.0394646,72.9470021&z=16&hl=en&output=embed',
};

export const NAV = [
  { label: 'Menu', href: '#collection' },
  { label: 'About', href: '#about-us' },
  { label: 'The Grill', href: '#craft' },
  { label: 'Gifting', href: '#gifting' },
  { label: 'Visit', href: '#visit' },
];
