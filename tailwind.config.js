/**
 * The token set here is DESIGN.md made machine-readable.
 *
 * Only the values the site actually uses are lifted across — the source design
 * doc ships a full Material palette (fifty-odd roles), and carrying all of it
 * would leave most of the theme dead weight that autocompletes over the names
 * that matter. The rule of thumb: a role earns a token once two components need
 * it, otherwise it stays an arbitrary value at the call site.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Matte black canvas. `ink` is the base; the containers step up in tone
        // rather than in shadow, which is how the design doc builds hierarchy.
        ink: {
          DEFAULT: '#131313',
          deep: '#0a0a0a',
          low: '#1c1b1b',
          mid: '#20201f',
          high: '#2a2a2a',
          top: '#353535',
        },
        // Champagne gold — the "finishing touch on a dessert". Used sparingly.
        gold: {
          DEFAULT: '#f2ca50',
          dim: '#e9c349',
          deep: '#d4af37',
          ink: '#3c2f00',
        },
        cream: {
          DEFAULT: '#e5e2e1',
          warm: '#d0c5af',
          dim: '#99907c',
        },
        outline: {
          DEFAULT: '#99907c',
          variant: '#4d4635',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid editorial scale. The clamp middles are viewport-relative so the
        // big display type keeps its "fashion magazine" proportion between
        // breakpoints instead of stepping.
        'display-xl': ['clamp(3rem, 13vw, 13rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'headline': ['clamp(1.75rem, 3.4vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body-lg': ['clamp(1rem, 1.4vw, 1.125rem)', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'label': ['0.75rem', { lineHeight: '1', letterSpacing: '0.22em' }],
        'label-sm': ['0.625rem', { lineHeight: '1', letterSpacing: '0.28em' }],
      },
      spacing: {
        // 8px rhythm, plus the two section rhythms the design doc calls for.
        section: 'clamp(6rem, 14vw, 12rem)',
        gutter: 'clamp(1.25rem, 4vw, 4rem)',
      },
      maxWidth: {
        container: '1280px',
        prose: '58ch',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
      },
      boxShadow: {
        // High-diffusion, gold-tinted — "a warm glow under gold-bordered
        // elements", never a hard drop shadow.
        glow: '0 0 60px -12px rgba(212, 175, 55, 0.35)',
        lift: '0 40px 80px -40px rgba(0, 0, 0, 0.9)',
      },
      transitionTimingFunction: {
        // The single easing curve the whole site moves on. Matching CSS
        // transitions to the GSAP default keeps hover and scroll motion from
        // reading as two different systems.
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '30%': { transform: 'translate(3%, -8%)' },
          '50%': { transform: 'translate(-4%, 6%)' },
          '70%': { transform: 'translate(6%, 3%)' },
          '90%': { transform: 'translate(-2%, 7%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        grain: 'grain 1.2s steps(3) infinite',
      },
    },
  },
  plugins: [],
};
