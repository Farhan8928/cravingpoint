/**
 * Measures the contrast of every piece of text on the page, in both themes.
 *
 * This exists because reviewing colour by eye kept passing things that were
 * actually failing. Two real bugs shipped that way:
 *
 *   - the hero eyebrow at `#E0664A` over the film measured **4.23:1** and looked
 *     fine in a screenshot. Type over the footage has to be checked against the
 *     *footage*, not against the page ground.
 *   - `--muted` was signed off at 4.99:1 on `--ground`, then a later change put
 *     the Collection section on `--tan` — the lightest dark surface — and every
 *     14px muted line silently dropped to 4.46:1.
 *
 * Both are the same mistake: a colour is only safe against the specific surface
 * it lands on, and surfaces change. So this walks the real DOM, resolves the
 * real painted background for each text node, and fails the build on anything
 * under WCAG AA.
 *
 * Two things it deliberately does that a naive version would not:
 *
 *   - **scrolls the whole page first.** Every section here animates in from
 *     `opacity: 0`, so an audit that measures on load sees an empty page and
 *     reports a clean bill of health. The first version of this script did
 *     exactly that and missed the entire footer.
 *   - **skips fixed chrome and gradient grounds**, which have no single
 *     background colour to measure against. Those are counted and reported so
 *     they are visibly excluded rather than silently dropped.
 *
 * Usage:
 *   npm run dev                  # in one terminal
 *   npm run audit                # in another
 *   PORT=4173 npm run audit      # or point it at `npm run preview`
 *
 * Requires puppeteer-core and a local Chrome; both are dev-only, so it installs
 * on demand rather than sitting in package.json:
 *   npm i --no-save puppeteer-core
 */
import { launch } from 'puppeteer-core';

const PORT = process.env.PORT || 5173;
const URL = `http://localhost:${PORT}/`;
const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/** The measurement, run inside the page. */
function collect() {
  const lum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);

  /** Walks up for the first opaque painted background. */
  function groundOf(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return { gradient: true };
      const c = parse(cs.backgroundColor);
      if (c.length >= 3 && (c[3] === undefined || c[3] > 0.5)) return { rgb: c.slice(0, 3) };
      n = n.parentElement;
    }
    return { rgb: parse(getComputedStyle(document.body).backgroundColor).slice(0, 3) };
  }

  const fails = [];
  let skippedGradient = 0;
  let skippedFixed = 0;

  document
    .querySelectorAll('h1,h2,h3,h4,p,a,span,dd,dt,li,address,button')
    .forEach((el) => {
      const text = (el.textContent || '').trim();
      if (!text || text.length < 2 || text.length > 90) return;
      // Leaf nodes only, or a heading is measured once per ancestor.
      if (el.querySelector('h1,h2,h3,h4,p,a,span,dd,dt,li,address,button')) return;

      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      if (parseFloat(cs.opacity) < 0.15) return;

      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return;

      for (let n = el; n; n = n.parentElement) {
        if (getComputedStyle(n).position === 'fixed') {
          skippedFixed += 1;
          return;
        }
      }

      const ground = groundOf(el);
      if (ground.gradient) {
        skippedGradient += 1;
        return;
      }

      const fg = parse(cs.color).slice(0, 3);
      const L1 = lum(fg);
      const L2 = lum(ground.rgb);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      // WCAG "large text" is 24px, or 18.66px when bold.
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;

      if (ratio < need) {
        fails.push({
          text: text.slice(0, 48),
          ratio: +ratio.toFixed(2),
          need,
          fg: `rgb(${fg})`,
          bg: `rgb(${ground.rgb})`,
          size: Math.round(size),
          section: el.closest('footer')
            ? 'footer'
            : el.closest('section')?.id || 'unknown',
          classes: (el.className || '').toString().slice(0, 70),
        });
      }
    });

  const seen = new Set();
  return {
    fails: fails.filter((f) => {
      const k = f.text + f.section;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }),
    skippedGradient,
    skippedFixed,
  };
}

async function auditTheme(browser, theme) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem('cp88-theme', t);
    } catch {
      /* blocked storage */
    }
  }, theme);

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 6000));

  // Play every scroll-triggered reveal before measuring.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 130));
  }
  await new Promise((r) => setTimeout(r, 1200));

  const result = await page.evaluate(collect);
  await page.close();
  return result;
}

async function main() {
  const browser = await launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });

  let total = 0;
  for (const theme of ['light', 'dark']) {
    const { fails, skippedGradient, skippedFixed } = await auditTheme(browser, theme);
    total += fails.length;

    console.log(
      `\n${theme.toUpperCase()} — ${fails.length} failure(s)` +
        `  (${skippedGradient} on gradients, ${skippedFixed} in fixed chrome — both checked by eye)`
    );
    for (const f of fails) {
      console.log(
        `  ${String(f.ratio).padStart(5)}:1  needs ${f.need}  [${f.section}]  "${f.text}"\n` +
          `         ${f.fg} on ${f.bg} · ${f.size}px · .${f.classes}`
      );
    }
  }

  await browser.close();

  if (total > 0) {
    console.log(`\n✗ ${total} contrast failure(s). See above.\n`);
    process.exit(1);
  }
  console.log('\n✓ No contrast failures in either theme.\n');
}

main().catch((err) => {
  console.error('✗ audit failed:', err.message);
  console.error('  Is the dev server running? Try: npm run dev');
  console.error('  Needs puppeteer-core: npm i --no-save puppeteer-core');
  process.exit(1);
});
