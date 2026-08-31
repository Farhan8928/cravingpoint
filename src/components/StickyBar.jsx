import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { BRAND } from '../data/brand';

/**
 * The mobile order bar.
 *
 * On a phone the header CTA is behind the hamburger and the hero button scrolls
 * away inside the first sequence — which, over a five-screen hero, means the
 * primary action is off-screen for a very long time. This puts it back.
 *
 * It appears once past the hero rather than immediately: over the opening frames
 * it would cover the film and pre-empt the pitch. It carries its own safe-area
 * padding so it clears the iOS home indicator.
 */
export default function StickyBar() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (prefersReducedMotion()) {
      gsap.set(el, { yPercent: 0 });
      return undefined;
    }

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const past = self.scroll() > window.innerHeight * 1.2;
        gsap.to(el, { yPercent: past ? 0 : 120, duration: 0.6, ease: 'power3.out' });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transform: 'translateY(120%)' }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden"
    >
      <div className="flex items-center gap-3">
        <a
          href={`tel:${BRAND.phone}`}
          className="btn-ghost flex-1 rounded-full !px-4 !py-3"
          aria-label={`Call ${BRAND.full}`}
        >
          Call
        </a>
        <a
          href={BRAND.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-[2] rounded-full !px-4 !py-3"
        >
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}
