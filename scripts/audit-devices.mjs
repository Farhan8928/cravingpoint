/**
 * Responsive UI/UX audit across real device sizes.
 *
 * This exists because "no horizontal overflow at 390px" was being treated as
 * "mobile is fine", and it is not the same claim. A page can fit the viewport
 * perfectly and still be unusable: affordances hidden behind `md:` breakpoints,
 * tap targets under the 44px minimum, content sitting underneath a fixed bar,
 * type below 12px. None of those move the scroll width by a single pixel.
 *
 * The specific miss that prompted this: the hero's scroll indicator was
 * `hidden md:flex`, so on a **five-viewport-tall** hero a phone user got no cue
 * to scroll at all — on the one layout where the cue matters most, because the
 * screen is nearly filled by a single dark frame.
 *
 * What it checks, per device:
 *
 *   overflow   horizontal scroll — the cheap check, kept because it is real
 *   tap        interactive elements under 44x44 (WCAG 2.5.5 / platform HIG)
 *   type       rendered text under 11px (iOS HIG floor)
 *   occluded   interactive elements sitting under the fixed bottom bar
 *   offscreen  content whose box extends past the viewport edge
 *   affordance the hero scroll cue is actually visible at this size
 *
 * Usage:
 *   npm run dev
 *   npm i --no-save puppeteer-core
 *   npm run audit:devices
 */
import { launch } from 'puppeteer-core';

const PORT = process.env.PORT || 5173;
const URL = `http://localhost:${PORT}/`;
const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/** Real sizes, not round numbers. 375 and 320 are the ones that actually break. */
const DEVICES = [
  { name: 'iPhone SE', w: 375, h: 667, dpr: 2, touch: true },
  { name: 'iPhone 13/14', w: 390, h: 844, dpr: 3, touch: true },
  { name: 'Pixel 7', w: 412, h: 915, dpr: 2.6, touch: true },
  { name: 'iPhone Pro Max', w: 430, h: 932, dpr: 3, touch: true },
  { name: 'iPad Mini', w: 768, h: 1024, dpr: 2, touch: true },
  { name: 'iPad Pro', w: 1024, h: 1366, dpr: 2, touch: true },
  { name: 'Laptop', w: 1280, h: 800, dpr: 1, touch: false },
  { name: 'Desktop', w: 1920, h: 1080, dpr: 1, touch: false },
];

/**
 * WCAG has two target-size rules and they are not the same number.
 * 2.5.5 (AAA) asks for 44x44 and is the right bar for a thumb; 2.5.8 (AA, 2.2)
 * asks for 24x24 and is the right bar for a mouse. Holding a desktop nav to 44px
 * reports every well-built site as broken, so the threshold follows the input.
 */
const TAP_TOUCH = 44;
const TAP_POINTER = 24;
const MIN_TYPE = 11;

function collect(minTap, minType) {
  const issues = [];
  const seen = new Set();
  const add = (kind, detail, el) => {
    const key = kind + detail;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push({ kind, detail, tag: el?.tagName?.toLowerCase() ?? '' });
  };

  const vw = document.documentElement.clientWidth;
  const overflow = document.documentElement.scrollWidth - vw;
  if (overflow > 1) add('overflow', `page scrolls ${overflow}px horizontally`, null);

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // The fixed bottom bar, if this size has one. Anything interactive whose
  // centre falls inside it is unreachable.
  const bar = [...document.querySelectorAll('div')].find((el) => {
    const cs = getComputedStyle(el);
    return (
      cs.position === 'fixed' &&
      visible(el) &&
      el.getBoundingClientRect().bottom >= window.innerHeight - 2 &&
      el.querySelector('a,button')
    );
  });
  const barTop = bar ? bar.getBoundingClientRect().top : Infinity;

  document.querySelectorAll('a, button, [role="tab"], input, select').forEach((el) => {
    if (!visible(el)) return;
    const r = el.getBoundingClientRect();
    const label = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 28);

    // Inline text links inside a paragraph are exempt: the target is the line
    // box, and padding them to 44px would wreck the prose.
    const inProse = el.closest('p, address, li, dd');
    // Skip links are visually hidden until focused; a 1x1 box is the mechanism,
    // not a defect.
    const srOnly = el.className.toString().includes('sr-only');
    // Half a pixel of slack: sub-pixel layout routinely lands a 44px control on
    // 43.98, and reporting that helps nobody.
    const short = r.width < minTap - 0.5 || r.height < minTap - 0.5;
    if (!inProse && !srOnly && short) {
      add('tap', `${Math.round(r.width)}x${Math.round(r.height)}px "${label}"`, el);
    }

    let n = el;
    let fixed = false;
    while (n) {
      if (getComputedStyle(n).position === 'fixed') { fixed = true; break; }
      n = n.parentElement;
    }
    // Only meaningful at the very bottom of the document: anywhere else the
    // user can simply keep scrolling to bring the element out from under the
    // bar. Checking mid-page reports every element on the page in turn.
    const atBottom =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 2;
    if (!fixed && atBottom && r.top < barTop && r.bottom > barTop - 4) {
      add('occluded', `"${label}" is trapped under the fixed bottom bar at page end`, el);
    }
  });

  document.querySelectorAll('h1,h2,h3,p,span,a,dd,dt,li,button').forEach((el) => {
    if (!visible(el)) return;
    if (el.children.length) return;
    const txt = (el.textContent || '').trim();
    if (txt.length < 3) return;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < minType) add('type', `${size}px "${txt.slice(0, 32)}"`, el);
  });

  document.querySelectorAll('section, footer, header, figure, article').forEach((el) => {
    if (!visible(el)) return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 2) add('offscreen', `${el.id || el.tagName} extends ${Math.round(r.right - vw)}px past the right edge`, el);
    if (r.left < -2) add('offscreen', `${el.id || el.tagName} starts ${Math.round(-r.left)}px left of the viewport`, el);
  });

  /**
   * Characters that a phone will draw from its colour-emoji font.
   *
   * This check exists because `✳` (U+2733) shipped as a **green emoji tile** on
   * Android and iOS while looking perfectly correct in every desktop test. Its
   * default presentation is text, but the system emoji font claims the codepoint
   * and sits earlier in the mobile fallback chain — so the defect is invisible on
   * the platform the tests run on, and no amount of screenshotting Windows Chrome
   * would ever have caught it.
   *
   * Scanning the source is therefore the only reliable check. A trailing U+FE0E
   * (text presentation selector) counts as handled; drawing the mark as SVG,
   * which is what the marquee does now, avoids the question entirely.
   */
  const EMOJI_RANGES = [
    [0x203c, 0x2049], [0x2122, 0x2122], [0x2139, 0x2139], [0x2194, 0x21aa],
    [0x231a, 0x231b], [0x2328, 0x2328], [0x23cf, 0x23fa], [0x24c2, 0x24c2],
    [0x25aa, 0x25ab], [0x25b6, 0x25b6], [0x25c0, 0x25c0], [0x25fb, 0x25fe],
    [0x2600, 0x27bf], [0x2934, 0x2935], [0x2b00, 0x2bff], [0x3030, 0x3030],
    [0x303d, 0x303d], [0x3297, 0x3299], [0x1f000, 0x1faff],
  ];
  const isEmojiCapable = (cp) => EMOJI_RANGES.some(([a, b]) => cp >= a && cp <= b);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || !visible(parent)) continue;
    const text = node.nodeValue || '';
    for (let i = 0; i < text.length; i += 1) {
      const cp = text.codePointAt(i);
      if (!isEmojiCapable(cp)) continue;
      // U+FE0E immediately after forces text presentation.
      if (text[i + 1] === '︎') continue;
      add(
        'emoji-font',
        `U+${cp.toString(16).toUpperCase()} "${text.trim().slice(0, 24)}" may render as a colour emoji on mobile`,
        parent
      );
    }
  }

  return issues;
}

async function run(browser, device) {
  const page = await browser.newPage();
  await page.setViewport({
    width: device.w,
    height: device.h,
    deviceScaleFactor: device.dpr,
    isMobile: device.touch,
    hasTouch: device.touch,
  });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));

  const issues = [];

  // The hero scroll cue, checked while still at the top of the page.
  const affordance = await page.evaluate(() => {
    const hero = document.querySelector('#hero');
    if (!hero) return { ok: false, why: 'no #hero' };
    const cue = [...hero.querySelectorAll('*')].some((el) => {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t !== 'scroll' && !el.dataset.scrollCue) return false;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.top < window.innerHeight;
    });
    return { ok: cue };
  });
  if (!affordance.ok) {
    issues.push({ kind: 'affordance', detail: 'hero has no visible scroll cue at this size', tag: '' });
  }

  // Walk the page so every reveal has played, then audit each screenful.
  const height = await page.evaluate(() => document.body.scrollHeight);
  const minTap = device.touch ? TAP_TOUCH : TAP_POINTER;
  for (let y = 0; y < height; y += Math.round(device.h * 0.8)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 220));
    issues.push(...(await page.evaluate(collect, minTap, MIN_TYPE)));
  }

  await page.close();

  const seen = new Set();
  return issues.filter((i) => {
    const k = i.kind + i.detail;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function main() {
  const browser = await launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });

  let total = 0;
  for (const device of DEVICES) {
    const issues = await run(browser, device);
    total += issues.length;
    const head = `${device.name.padEnd(15)} ${String(device.w).padStart(4)}x${device.h}`;
    if (!issues.length) {
      console.log(`  ${head}  ok`);
      continue;
    }
    console.log(`\n  ${head}  ${issues.length} issue(s)`);
    for (const i of issues) console.log(`      [${i.kind}] ${i.detail}`);
  }

  await browser.close();
  console.log(total ? `\n✗ ${total} issue(s) across devices.\n` : '\n✓ All devices clean.\n');
  if (total) process.exit(1);
}

main().catch((err) => {
  console.error('✗ device audit failed:', err.message);
  console.error('  Is the dev server running? Try: npm run dev');
  process.exit(1);
});
