"use client";

import { useEffect, useRef, useState } from "react";

interface UseRevealOnScrollOptions {
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useRevealOnScroll<T extends HTMLElement>({
  once = true,
  threshold = 0.08,
  rootMargin = "0px 0px -5% 0px",
}: UseRevealOnScrollOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, isVisible };
}

