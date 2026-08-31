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
  tagline: 'Made when you ask, not before',
  description:
    'Brownies, waffles and charcoal wraps in Cheeta Camp, Trombay. Made when you ask, not before.',

  // ⚠ PLACEHOLDER — replace with the real number, digits only, country code first.
  phone: '+919999999999',
  phoneDisplay: '+91 99999 99999',
  whatsapp: 'https://wa.me/919999999999',
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

  hours: [
    { days: 'Monday to Thursday', time: '12:00 – 23:30' },
    { days: 'Friday to Sunday', time: '12:00 – 01:00' },
  ],

  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'WhatsApp', href: 'https://wa.me/919999999999' },
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
  { label: 'Collection', href: '#collection' },
  { label: 'The Grill', href: '#craft' },
  { label: 'Gifting', href: '#gifting' },
  { label: 'Visit', href: '#visit' },
];
