type Subscriber = (p: number) => void;

class ScrollSync {
  startId: string;
  endId: string;
  subs: Set<Subscriber> = new Set();
  raf = 0;
  ticking = false;

  constructor(startId: string, endId: string) {
    this.startId = startId;
    this.endId = endId;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.start();
  }

  start() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    this.onScroll();
  }

  stop() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    cancelAnimationFrame(this.raf);
  }

  subscribe(fn: Subscriber) {
    this.subs.add(fn);
    // Immediately notify current progress
    fn(this.computeProgress());
    return () => this.subs.delete(fn);
  }

  onResize() {
    // recompute once
    this.notify();
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    this.raf = requestAnimationFrame(() => {
      this.notify();
      this.ticking = false;
    });
  }

  notify() {
    const p = this.computeProgress();
    this.subs.forEach((s) => s(p));
  }

  computeProgress(): number {
    try {
      const startEl = document.getElementById(this.startId);
      const endEl = document.getElementById(this.endId);
      if (!startEl || !endEl) return 0;

      const viewportHeight = window.innerHeight;
      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();

      const startY = startRect.top + window.scrollY;
      const endY = endRect.bottom + window.scrollY;

      const travel = endY - startY - viewportHeight;

      if (travel > 0) {
        const scrolled = window.scrollY - startY;
        let p = scrolled / travel;
        p = Math.max(0, Math.min(1, p));
        return p;
      }

      // Fallback: compute a per-section progress based on the start element alone
      // This handles cases where the combined container can't be measured reliably.
      const sectionHeight = startRect.height;
      const sectionTravel = sectionHeight - viewportHeight;
      if (sectionTravel > 0) {
        const scrolled = -startRect.top; // pixels scrolled into the section
        let p = scrolled / sectionTravel;
        p = Math.max(0, Math.min(1, p));
        return p;
      }

      return 0;
    } catch (e) {
      return 0;
    }
  }
}

let instance: ScrollSync | null = null;

export function getScrollSync(startId = 'hero-wrapper', endId = 'jar-hero-wrapper') {
  if (!instance) instance = new ScrollSync(startId, endId);
  return instance;
}
