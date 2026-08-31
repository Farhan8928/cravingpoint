/**
 * One place where GSAP is configured and Lenis is wired to it.
 *
 * Lenis and ScrollTrigger both want to be the authority on "where is the page".
 * If they are left to their own devices ScrollTrigger reads the native scroll
 * position while Lenis is still animating toward it, and every pinned section
 * lags the content by a frame or two — the specific ugliness where a sticky
 * canvas visibly slides before it locks. The fix is the standard one: give
 * ScrollTrigger a scrollerProxy onto Lenis and drive Lenis from GSAP's ticker so
 * there is a single rAF loop for the whole page.
 *
 * `prefersReducedMotion` is checked once, here, and every consumer branches on
 * the export. The site still tells its whole story with motion off — sequences
 * render their poster frame, reveals resolve to their end state — because a
 * scroll-driven site that goes blank under `prefers-reduced-motion` is broken,
 * not accessible.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
let lenis = null;

export const isBrowser = typeof window !== 'undefined';

export const prefersReducedMotion = () =>
  isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Registers plugins exactly once.
 *
 * Called at module scope below, *not* from a component effect. React runs child
 * effects before parent effects, so registering in `App`'s `useEffect` happens
 * after every section has already tried to build its ScrollTriggers — which
 * throws inside the ScrollTrigger constructor, on a half-initialised plugin,
 * and takes the page down with it. Plugin registration is a property of the
 * module, so it belongs at import time.
 */
export function registerMotion() {
  if (registered || !isBrowser) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 1 });
  // Pinned canvases are laid out from JS; letting ScrollTrigger refresh on every
  // resize tick thrashes them. Batching to the resize end is enough.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

registerMotion();

/**
 * Starts Lenis and hands ScrollTrigger the proxy. Returns a teardown.
 *
 * Under reduced motion Lenis is skipped entirely rather than configured to be
 * instant — a smoothing library set to zero smoothing is still a wheel handler
 * standing between the user and their browser's native scrolling.
 */
export async function startSmoothScroll() {
  if (!isBrowser || prefersReducedMotion()) return () => {};

  const { default: Lenis } = await import('lenis');

  // Everything below closes over `instance`, never the module-level `lenis`.
  // Under StrictMode two calls are in flight at once: if the teardown read the
  // module variable it would destroy whichever instance happened to be current
  // — usually the *other* mount's — leaving a live ticker calling `.raf()` on a
  // destroyed object. Owning the instance you created is the whole fix.
  const instance = new Lenis({
    // Slightly long and heavily eased: the design brief asks for motion that
    // feels "expensive", and weight is most of what reads as expensive.
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Touch scrolling is left native. Smoothing it fights the platform's own
    // momentum and is the single most common way these sites feel broken on iOS.
    smoothTouch: false,
    touchMultiplier: 1.6,
  });

  lenis = instance;
  instance.on('scroll', ScrollTrigger.update);

  const tick = (time) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    // Only clear the shared handle if this instance is still the one holding
    // it; a later mount may already have replaced it.
    if (lenis === instance) lenis = null;
  };
}

export const getLenis = () => lenis;

/** Anchor navigation has to go through Lenis or it fights the smoothing. */
export function scrollTo(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4, ...opts });
  else if (isBrowser) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export { gsap, ScrollTrigger };
