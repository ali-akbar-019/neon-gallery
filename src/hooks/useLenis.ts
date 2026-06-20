import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

// Simple, direct Lenis + ScrollTrigger sync. The app has no pinned
// sections, so the heavier scrollerProxy integration (needed only to keep
// GSAP's `pin: true` mechanism aligned with Lenis's virtual scroll) has
// been removed — it was forcing Lenis to jump scroll position immediately
// on every native scroll read, which made scrolling feel stuttery instead
// of smooth. This version just lets Lenis own scrolling and tells
// ScrollTrigger to recompute on each Lenis tick.
export function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // smooth ease-out cubic
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTicker);

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
