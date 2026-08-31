/**
 * Bakes the rendered markup into dist/index.html.
 *
 * This site is a React SPA, so what it shipped was an empty `<div id="root">`.
 * That matters more here than on an ordinary site: the entire page is one
 * scroll-driven document, so with JavaScript off there was no text at all — and
 * for a Mumbai counter whose link is forwarded in WhatsApp groups, the
 * link-preview fetcher (which does not run JS) is a real audience, not a
 * theoretical one.
 *
 * Rendering goes through `react-dom/server` against the SSR bundle Vite emits.
 * No headless browser, so nothing extra to install on a build machine, and the
 * output is deterministic. React hydrates over the top and the page is fully
 * interactive.
 *
 * If this fails it fails the build, rather than quietly shipping the blank page
 * it exists to prevent.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SSR_ENTRY = join(ROOT, 'dist-ssr', 'entry-server.js');

async function main() {
  let render;
  try {
    ({ render } = await import(pathToFileURL(SSR_ENTRY).href));
  } catch (err) {
    console.error('✗ could not load dist-ssr/entry-server.js');
    console.error('  Run "npm run build:ssr" first — it is part of "npm run build".');
    console.error(`  ${err.message}`);
    process.exit(1);
  }

  const markup = render();

  // A near-empty render means something broke upstream. Fail loudly rather than
  // shipping the blank page this script exists to prevent.
  if (!markup || markup.length < 5000) {
    console.error(`✗ prerender produced only ${markup?.length ?? 0} chars of markup — aborting.`);
    process.exit(1);
  }

  const indexPath = join(DIST, 'index.html');
  const html = await readFile(indexPath, 'utf8');

  if (!html.includes('<div id="root"></div>')) {
    console.error('✗ dist/index.html has no empty <div id="root"></div> to fill.');
    process.exit(1);
  }

  await writeFile(
    indexPath,
    html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
    'utf8'
  );

  console.log(`✓ prerendered homepage (${(markup.length / 1024).toFixed(0)} kB of markup)`);
}

main().catch((err) => {
  console.error('✗ prerender failed:', err);
  process.exit(1);
});
