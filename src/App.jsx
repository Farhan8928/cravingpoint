import { useCallback, useEffect, useState } from 'react';
// Importing this module registers the GSAP plugins as a side effect — see the
// note on registerMotion(). Nothing here needs to do that itself.
import { startSmoothScroll, ScrollTrigger } from './lib/motion';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Marquee from './components/Marquee';
import Collection from './components/Collection';
import Craft from './components/Craft';
import Gifting from './components/Gifting';
import Visit from './components/Visit';
import Footer from './components/Footer';
import StickyBar from './components/StickyBar';

/**
 * The whole site, one page, in narrative order:
 *
 *   hero      — the chocolate pour, scrubbed (5 screens)
 *   manifesto — the argument, type only
 *   marquee   — a beat
 *   collection— both counters
 *   craft     — the grill, scrubbed (3.5 screens)
 *   gifting   — the commercial ask
 *   visit     — address, hours, order
 *
 * The two scrubbed sequences are deliberately separated by everything else. Back
 * to back they read as one long film the reader cannot get out of; with the menu
 * between them the second one lands as a change of subject.
 *
 * Smooth scroll starts here rather than inside a component so there is exactly
 * one Lenis instance for the page, and it is torn down with the app.
 */
export default function App() {
  const [heroProgress, setHeroProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop;
    let cancelled = false;

    startSmoothScroll().then((teardown) => {
      // The dynamic import can resolve after a StrictMode unmount; without this
      // guard the second instance is never cleaned up and both drive the ticker.
      if (cancelled) teardown();
      else stop = teardown;
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  // The pinned sections are sized in viewport units, so their scroll maths is
  // wrong until the fonts have settled and the preloader has released layout.
  useEffect(() => {
    if (!ready) return undefined;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [ready]);

  const onDone = useCallback(() => setReady(true), []);

  return (
    <>
      <Preloader progress={heroProgress} onDone={onDone} />
      <Cursor />

      {/* Skip link — with a 5-screen hero this is the difference between one tab
          press and a very long scroll for keyboard users. */}
      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[110] focus:bg-accent focus:px-5 focus:py-3 focus:text-label focus:uppercase focus:text-accent-ink"
      >
        Skip to the menu
      </a>

      <Nav />

      <main id="top">
        <Hero onProgress={setHeroProgress} />
        <Manifesto />
        <Marquee />
        <Collection />
        <Craft />
        <Gifting />
        <Visit />
      </main>

      <Footer />
      <StickyBar />

      {/* Paper grain. Static, not animated: an animated full-viewport blend
          layer repaints the entire page several times a second, which is exactly
          the sort of cost that surfaces as scroll stutter for no visible gain. */}
      <div
        aria-hidden="true"
        className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-overlay"
      />
    </>
  );
}
