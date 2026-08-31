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
  tagline: 'The Art of Indulgence',
  description:
    'A dessert atelier and grill in Trombay, Mumbai — where chocolate is poured by hand and nothing leaves the pass unfinished.',

  // ⚠ PLACEHOLDER — replace with the real number, digits only, country code first.
  phone: '+919999999999',
  phoneDisplay: '+91 99999 99999',
  whatsapp: 'https://wa.me/919999999999',
  email: 'hello@cravingpoint.example',

  address: {
    line1: 'Chembur Camp',
    line2: 'Trombay, Mumbai',
    region: 'Maharashtra 400088',
    country: 'IN',
  },

  hours: [
    { days: 'Monday — Thursday', time: '12:00 — 23:30' },
    { days: 'Friday — Sunday', time: '12:00 — 01:00' },
  ],

  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'WhatsApp', href: 'https://wa.me/919999999999' },
  ],

  // ⚠ PLACEHOLDER — paste the embed URL from Google Maps → Share → Embed.
  mapEmbed: '',
};

export const NAV = [
  { label: 'Collection', href: '#collection' },
  { label: 'The Grill', href: '#craft' },
  { label: 'Gifting', href: '#gifting' },
  { label: 'Visit', href: '#visit' },
];
