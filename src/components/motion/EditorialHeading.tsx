"use client";

import { CSSProperties } from "react";
import { useRevealOnScroll } from "@/lib/motion/useRevealOnScroll";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

interface EditorialHeadingProps {
  as?: HeadingTag;
  lines: string[];
  className?: string;
  id?: string;
  baseDelayMs?: number;
  stepDelayMs?: number;
  once?: boolean;
  threshold?: number;
}

const joinClasses = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export default function EditorialHeading({
  as = "h2",
  lines,
  className,
  id,
  baseDelayMs = 0,
  stepDelayMs = 90,
  once = true,
  threshold = 0.3,
}: EditorialHeadingProps) {
  const { ref, isVisible } = useRevealOnScroll<HTMLHeadingElement>({
    once,
    threshold,
  });
  const Heading = as;

  return (
    <Heading
      ref={ref}
      id={id}
      className={joinClasses(
        "editorial-heading",
        isVisible && "is-visible",
        className
      )}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, idx) => (
        <span
          key={`${line}-${idx}`}
          className="editorial-heading-line"
          style={
            {
              "--line-delay": `${baseDelayMs + idx * stepDelayMs}ms`,
            } as CSSProperties
          }
        >
          {line}
        </span>
      ))}
    </Heading>
  );
}
