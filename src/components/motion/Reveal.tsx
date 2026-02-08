"use client";

import { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

type RevealElement = keyof JSX.IntrinsicElements;
type RevealVariant = "section" | "image" | "lift";

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const joinClasses = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export default function Reveal({
  as = "div",
  children,
  className,
  variant = "section",
  delay = 0,
  once = true,
  threshold,
  rootMargin,
  style,
  ...rest
}: RevealProps) {
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>({
    once,
    threshold,
    rootMargin,
  });

  const Element = as;

  return (
    <Element
      ref={ref as never}
      className={joinClasses(
        "reveal",
        `reveal--${variant}`,
        isVisible && "is-visible",
        className
      )}
      style={
        {
          ...style,
          "--reveal-delay": `${delay}ms`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Element>
  );
}

