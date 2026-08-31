import { useEffect, useState } from 'react';
import { getStoredTheme, applyTheme } from '../lib/theme';

/**
 * Light/dark switch.
 *
 * Rendered as a two-position track rather than a single icon button: an icon
 * alone is ambiguous about whether it shows the current state or the action, and
 * on a site whose whole premise is the light ground, which mode you are in
 * should be readable at a glance.
 *
 * State initialises to the module default rather than to `getStoredTheme()`,
 * then syncs in an effect. Reading storage during render would return a
 * different value on the client than on the server and produce a hydration
 * mismatch — the boot script in index.html has already applied the real theme to
 * <html>, so there is no flash while this catches up.
 */
export default function ThemeToggle({ className = '', onFilm = false }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const set = (next) => {
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div
      className={`relative flex items-center rounded-full border p-0.5 transition-colors duration-700 ${
        onFilm ? 'border-film-ink/25' : 'border-line'
      } ${className}`}
      role="group"
      aria-label="Colour theme"
    >
      {/* The moving thumb carries the gradient — the same identity as the nav
          pill and the primary CTA, at a third size. `transform` rather than
          `left` so it composites. */}
      <span
        aria-hidden="true"
        className="grad-102 absolute left-0.5 top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full transition-transform duration-400 ease-lux"
        style={{ transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {[
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
      ].map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => set(opt.id)}
          aria-pressed={theme === opt.id}
          data-cursor-label={theme === opt.id ? undefined : `${opt.label} mode`}
          className={`relative z-10 rounded-full px-3 py-1.5 font-mono text-label-sm uppercase transition-colors duration-400 ease-lux ${
            theme === opt.id
              ? 'text-white'
              : onFilm
                ? 'text-film-muted hover:text-film-ink'
                : 'text-muted hover:text-ink'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
