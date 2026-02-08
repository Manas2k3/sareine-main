"use client";

import Link from "next/link";
import React from "react";
import { useRouteTransition } from "@/components/motion/RouteTransitionProvider";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function TransitionLink({
  href,
  children,
  className,
  replace,
  scroll,
  onClick,
}: TransitionLinkProps) {
  const { navigate } = useRouteTransition();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    navigate(href, { replace, scroll });
  };

  return (
    <Link
      href={href}
      replace={replace}
      scroll={scroll}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}

