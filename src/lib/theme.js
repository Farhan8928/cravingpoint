/**
 * Theme state, shared by the toggle and the inline boot script in index.html.
 *
 * The boot script sets `data-theme` before first paint — the constants here must
 * stay in sync with it, which is why the storage key and default live in one
 * place and are referenced by name in the README.
 *
 * Light is the default rather than the system preference. The page is designed
 * for paper: the food photography is dark and warm, and it is framed against
 * bone the way the reference sites frame theirs. Following `prefers-color-scheme`
 * on a first visit would mean most visitors never see the designed-for case.
 * The toggle is one click away and the choice is remembered.
 */
export const THEME_KEY = 'cp88-theme';
export const DEFAULT_THEME = 'light';

export const isBrowser = typeof window !== 'undefined';

export function getStoredTheme() {
  if (!isBrowser) return DEFAULT_THEME;
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark' || stored === 'light' ? stored : DEFAULT_THEME;
  } catch {
    // Private mode / blocked storage. The theme still works, it just does not
    // persist — never let a storage failure take the page down.
    return DEFAULT_THEME;
  }
}

export function applyTheme(theme) {
  if (!isBrowser) return;
  document.documentElement.setAttribute('data-theme', theme);
  // Keeps the browser UI (address bar, scrollbars) from staying light behind a
  // dark page on mobile.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#17110D' : '#F2ECE1');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* not persisted */
  }
}
