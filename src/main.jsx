import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * `hydrateRoot` when the prerendered markup is present, `createRoot` otherwise.
 *
 * `npm run build` bakes the homepage into dist/index.html, but `npm run dev`
 * serves the empty shell. Calling `hydrateRoot` against an empty container
 * "works" and then silently re-renders everything client-side, so dev would be
 * quietly testing a different code path than production. Branching on the
 * container's contents keeps both honest.
 */
const container = document.getElementById('root');
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (container.hasChildNodes()) hydrateRoot(container, tree);
else createRoot(container).render(tree);
