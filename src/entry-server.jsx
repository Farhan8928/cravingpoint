import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * The SSR entry scripts/prerender.mjs imports.
 *
 * No StrictMode here — it double-renders, which is useful for catching effect
 * bugs in the browser and pure waste in a one-shot string render.
 *
 * Effects never run during `renderToString`, so everything motion-related is
 * inert: the components emit their closed CSS state and their real content. That
 * is exactly what a crawler should see.
 */
export function render() {
  return renderToString(<App />);
}
