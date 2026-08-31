/**
 * End-to-end checks for the two failure modes that shipped to the client.
 *
 * Both were invisible to every check that existed at the time, for the same
 * reason: they only appear after the user *does* something. A screenshot of a
 * freshly loaded page cannot see either.
 *
 * **1. Colour-block foreground.** The footer sits on a dark block in both
 * themes. It used a separate `block-ink` / `block-muted` vocabulary, and where a
 * class was missed the text fell back to `--ink` — dark espresso on near-black.
 * Invisible, and invisible in a way that reads as a rendering glitch rather than
 * a missing class. Fixed at the root by having `.block-*` redefine the semantic
 * tokens for its subtree, so `text-ink` is simply correct inside a block. This
 * asserts the result rather than the mechanism, so it keeps working if the
 * mechanism changes again.
 *
 * **2. Stranded cursor label.** Hover an element with `data-cursor-label`, then
 * scroll without moving the mouse. The browser fires no pointer event, so
 * `mouseout` never runs and the expanded label pill stays on screen — floating
 * over an unrelated section, showing a price for a row that is long gone. Fixed
 * with a scroll handler that re-hit-tests under the last known pointer position.
 *
 * Usage:
 *   npm run dev                          # one terminal
 *   npm i --no-save puppeteer-core       # dev-only
 *   npm run smoke                        # another
 *   PORT=4173 npm run smoke              # or against `npm run preview`
 */
import { launch } from 'puppeteer-core';

const PORT = process.env.PORT || 5173;
const URL = `http://localhost:${PORT}/`;
const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

async function run(browser, theme) {
  const page = await browser.newPage();
  // The client reviews at 1920×1080; bugs that only appear at one width are
  // exactly the kind this file exists to catch.
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem('cp88-theme', t);
    } catch {
      /* blocked storage */
    }
  }, theme);

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));

  const failures = [];

  // ---- 1. Footer text against the footer's own background ----
  await page.evaluate(() => document.querySelector('footer').scrollIntoView());
  await new Promise((r) => setTimeout(r, 2500));

  const footer = await page.evaluate(() => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
    const f = document.querySelector('footer');
    const lede = [...f.querySelectorAll('p')].find((e) => e.textContent.trim().length > 30);
    const link = f.querySelector('nav a');
    const head = f.querySelector('h2');
    return {
      bg: rgb(getComputedStyle(f).backgroundColor),
      lede: rgb(getComputedStyle(lede).color),
      link: rgb(getComputedStyle(link).color),
      head: rgb(getComputedStyle(head).color),
    };
  });

  for (const key of ['lede', 'link', 'head']) {
    const ratio = contrast(footer[key], footer.bg);
    const ok = ratio >= 4.5;
    console.log(
      `  footer.${key.padEnd(5)} rgb(${footer[key]}) on rgb(${footer.bg}) = ` +
        `${ratio.toFixed(2)}:1  ${ok ? 'ok' : '*** FAIL ***'}`
    );
    if (!ok) failures.push(`footer ${key} at ${ratio.toFixed(2)}:1`);
  }

  // ---- 2. Cursor label must not survive a scroll ----
  await page.evaluate(() => document.querySelector('#collection').scrollIntoView());
  await new Promise((r) => setTimeout(r, 2000));

  const cta = await page.$('#collection a.btn-primary');
  if (!cta) {
    failures.push('no labelled CTA found to test the cursor against');
  } else {
    const width = () =>
      page.evaluate(() => document.querySelector('.grad-102.fixed')?.offsetWidth ?? 0);

    await cta.hover();
    await new Promise((r) => setTimeout(r, 900));
    const expanded = await width();

    // Scroll far away WITHOUT moving the mouse — the exact situation that
    // stranded the pill on screen.
    await page.evaluate(() => window.scrollBy(0, 2500));
    await new Promise((r) => setTimeout(r, 1400));
    const after = await width();

    const ok = expanded > 40 && after <= 20;
    console.log(
      `  cursor      expanded ${expanded}px -> after scroll ${after}px  ` +
        `${ok ? 'ok (collapsed)' : '*** FAIL (stranded) ***'}`
    );
    if (!ok) failures.push(`cursor label stranded at ${after}px`);
  }

  await page.close();
  return failures;
}

async function main() {
  const browser = await launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });

  let total = 0;
  for (const theme of ['light', 'dark']) {
    console.log(`\n${theme.toUpperCase()}`);
    const failures = await run(browser, theme);
    total += failures.length;
    if (failures.length) console.log(`  → ${failures.join(' | ')}`);
  }

  await browser.close();

  if (total > 0) {
    console.log(`\n✗ ${total} failure(s).\n`);
    process.exit(1);
  }
  console.log('\n✓ All smoke checks passed in both themes.\n');
}

main().catch((err) => {
  console.error('✗ smoke run failed:', err.message);
  console.error('  Is the dev server running? Try: npm run dev');
  console.error('  Needs puppeteer-core: npm i --no-save puppeteer-core');
  process.exit(1);
});
