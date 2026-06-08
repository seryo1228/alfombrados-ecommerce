"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initializes Lenis smooth scroll for the whole page.
 * - Respects `prefers-reduced-motion` (Lenis stops auto-rafing if user prefers reduced).
 * - Exposes window.__lenis for the few components that need to react to scroll
 *   (used by the hero parallax cards).
 */
export function LenisProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If the user prefers reduced motion, skip Lenis entirely
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,                // slow + smooth feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out exponential
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Expose for components that need scroll-driven effects
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
