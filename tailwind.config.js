/**
 * Semantic tokens, not literal colours.
 *
 * Every colour resolves to a CSS custom property defined in index.css, so a
 * class like `bg-ground` is correct in both light and dark without a single
 * `dark:` variant anywhere in the components. Swapping the theme rewrites eight
 * variables on <html>; nothing in the markup changes.
 *
 * The `rgb(var(--x) / <alpha-value>)` form is what keeps Tailwind's opacity
 * modifiers working — `text-ink/60` still composites correctly, which a plain
 * `var(--ink)` would silently break.
 *
 * Palette: Cocoa & Bone. Bone paper, espresso ink, one burnt-cacao accent —
 * pulled from the footage itself (chocolate, cream, charcoal) so the page and
 * the film read as one object. Deliberately no gold and no pure black: that
 * pairing is the default "luxury" costume every generated food site wears.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ground: 'rgb(var(--ground) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        sunken: 'rgb(var(--sunken) / <alpha-value>)',
        tan: 'rgb(var(--tan) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
        },
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },
        // Fixed values for type that sits over the film, which is dark in both
        // themes — these must NOT follow the theme or the hero headline
        // disappears in light mode.
        film: {
          ink: '#F4EEE4',
          muted: '#B9AE9E',
          ground: '#100C09',
          // Type over film uses this in both themes — the light theme's accent
          // (#B0432B) is a dark red, correct on paper and invisible on footage.
          //
          // This was #E0664A, which measures **4.23:1** on the hero's slate and
          // therefore fails AA for the 10px eyebrow set in it. Contrast over the
          // film has to be checked against the footage, not against the page
          // ground, which is the check that was missing. #FFAE8C is 8.02:1.
          accent: '#FFAE8C',
        },
        // Type inside `.block-cacao` / `.block-ember`. Those blocks are dark and
        // saturated in both themes, so their contents must not follow the theme.
        block: {
          ink: '#FBF3E9',
          muted: '#E4C9BC',
          accent: '#FFC9A8',
        },
      },
      fontFamily: {
        // Three roles, on the same structure the reference sites use:
        //
        //   display — Fraunces. A variable serif with an optical-size axis, so
        //             the display cut is genuinely high-contrast while small
        //             sizes stay sturdy. (Playfair at 14px is the single most
        //             common tell of a template.)
        //   mono    — Martian Mono. Carries the entire UI layer: labels, nav,
        //             buttons, prices, stats. This is the biggest single reason
        //             the page reads as designed rather than assembled.
        //   sans    — Instrument Sans. Body copy only, where a mono would be a
        //             readability tax on anything longer than a line. This was
        //             Inter Tight; Inter is the single most-cited typographic
        //             tell of a generated site, and a face from that family was
        //             doing nothing here that a more characterful one could not.
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"Martian Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 11.5vw, 11rem)', { lineHeight: '0.9', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.25rem, 7vw, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.028em' }],
        'display-md': ['clamp(1.875rem, 4.5vw, 3.25rem)', { lineHeight: '1.06', letterSpacing: '-0.02em' }],
        headline: ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.18', letterSpacing: '-0.012em' }],
        'body-lg': ['clamp(1rem, 1.3vw, 1.1875rem)', { lineHeight: '1.65', letterSpacing: '0' }],
        // Martian Mono is a wide face and already carries generous sidebearings.
        // The 0.18em/0.22em tracking these had while they were set in Inter now
        // reads as broken-apart lettering, so both come right down.
        label: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.06em' }],
        'label-sm': ['0.625rem', { lineHeight: '1', letterSpacing: '0.08em' }],
      },
      spacing: {
        section: 'clamp(5rem, 12vw, 10rem)',
        gutter: 'clamp(1.25rem, 4vw, 4rem)',
      },
      maxWidth: {
        container: '1320px',
        prose: '60ch',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        lg: '0.75rem',
        xl: '1.25rem',
      },
      boxShadow: {
        // Neutral and soft. A coloured shadow on a paper ground reads as a
        // mistake rather than as warmth.
        frame: '0 32px 64px -32px rgb(var(--shadow) / 0.28)',
        lift: '0 12px 32px -16px rgb(var(--shadow) / 0.22)',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      // 400ms is the site's standard UI transition and is not a Tailwind default.
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        drip: {
          '0%': { transform: 'translateY(-100%)' },
          '60%': { transform: 'translateY(200%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
      animation: {
        drip: 'drip 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
