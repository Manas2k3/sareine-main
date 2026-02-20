"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface NavigateOptions {
  replace?: boolean;
  scroll?: boolean;
}

interface RouteTransitionContextType {
  navigate: (href: string, options?: NavigateOptions) => void;
  isTransitioning: boolean;
}

const OUT_DURATION = 140;
const IN_DURATION = 220;

const RouteTransitionContext = createContext<RouteTransitionContextType | null>(
  null
);

const canBypassTransition = (targetUrl: URL, currentUrl: URL) =>
  targetUrl.pathname === currentUrl.pathname &&
  targetUrl.search === currentUrl.search &&
  !!targetUrl.hash;

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const routeKey = `${pathname}?${searchParams.toString()}`;
  const mountedRef = useRef(false);
  const pendingRef = useRef<{
    href: string;
    options?: NavigateOptions;
  } | null>(null);
  const outTimerRef = useRef<number | null>(null);
  const inTimerRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");

  const clearTimers = () => {
    if (outTimerRef.current) window.clearTimeout(outTimerRef.current);
    if (inTimerRef.current) window.clearTimeout(inTimerRef.current);
  };

  const navigate = useCallback(
    (href: string, options?: NavigateOptions) => {
      if (typeof window === "undefined") return;

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(href, window.location.origin);

      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search &&
        targetUrl.hash === currentUrl.hash
      ) {
        return; // Exact same URL, no navigation needed, prevents stuck transition phase
      }

      if (canBypassTransition(targetUrl, currentUrl)) {
        window.location.hash = targetUrl.hash;
        return;
      }

      const normalizedHref = `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
      pendingRef.current = { href: normalizedHref, options };
      setPhase("out");

      if (outTimerRef.current) window.clearTimeout(outTimerRef.current);
      outTimerRef.current = window.setTimeout(() => {
        const scroll = options?.scroll ?? true;
        if (options?.replace) {
          router.replace(normalizedHref, { scroll });
        } else {
          router.push(normalizedHref, { scroll });
        }
      }, OUT_DURATION);
    },
    [router]
  );

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    setPhase("in");
    pendingRef.current = null;

    if (inTimerRef.current) window.clearTimeout(inTimerRef.current);
    inTimerRef.current = window.setTimeout(() => {
      setPhase("idle");
    }, IN_DURATION);
  }, [routeKey]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#")) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.dataset.noTransition === "true") return;

      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(anchor.href, window.location.origin);

        if (targetUrl.origin !== currentUrl.origin) return;

        const samePathAndSearch =
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search;
        if (samePathAndSearch && !!targetUrl.hash) return;

        event.preventDefault();
        navigate(
          `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash || ""}`,
          {
            replace: false,
            scroll: true,
          }
        );
      } catch {
        // Ignore malformed URLs and allow default behavior.
      }
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => document.removeEventListener("click", onDocumentClick, true);
  }, [navigate]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const contextValue = useMemo(
    () => ({
      navigate,
      isTransitioning: phase !== "idle",
    }),
    [navigate, phase]
  );

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      <div className={`route-shell route-phase-${phase}`}>
        <div className="route-transition-overlay" aria-hidden />
        <div className="route-transition-content">{children}</div>
      </div>
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);
  if (!context) {
    throw new Error(
      "useRouteTransition must be used within a RouteTransitionProvider."
    );
  }
  return context;
}

