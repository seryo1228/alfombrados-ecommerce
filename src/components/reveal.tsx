"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the reveal starts after entering viewport */
  delay?: number;
  /** Distance in px the element travels up during reveal */
  distance?: number;
  /** Duration of the reveal in ms */
  duration?: number;
  /** Reveal threshold (0-1). 0.15 = element 15% in view */
  threshold?: number;
  /** Optional className passthrough */
  className?: string;
  /** Reveal only once (default true) */
  once?: boolean;
  /** Render as a specific tag */
  as?: "div" | "section" | "article" | "li" | "h2" | "h3" | "p";
}

/**
 * Lightweight scroll-reveal wrapper using IntersectionObserver.
 * - Renders content immediately if user prefers reduced motion.
 * - Uses transform + opacity only (hardware-accelerated).
 * - Defaults: 24px slide up, 700ms ease-out, once-only.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 24,
  duration = 700,
  threshold = 0.15,
  className = "",
  once = true,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, reducedMotion]);

  const style = reducedMotion
    ? undefined
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform",
      };

  return (
    // @ts-expect-error — dynamic tag, ref type intersection is acceptable here
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
