"use client";


import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Ingredients from '@/components/Ingredients';
import ProductShowcase from '@/components/ProductShowcase';
import Contact from '@/components/Contact';
import IntroScreen from '@/components/IntroScreen';

import { useIntro } from '@/context/IntroContext';

export default function Home() {
  const { hasShownIntro, setHasShownIntro } = useIntro();

  return (
    <main>
      {!hasShownIntro && <IntroScreen onEnter={() => setHasShownIntro(true)} />}
      <div style={{
        // Per-page section anchor offset for scroll-margin-top. Home uses a modest offset
        // because the Home hero is larger and we want titles to sit nicely under the navbar.
        '--section-scroll-offset': '72px' as any,
        height: !hasShownIntro ? '100vh' : 'auto',
        overflow: !hasShownIntro ? 'hidden' : 'visible'
      } as React.CSSProperties}>
        <Hero />
        <ProductShowcase />
        <Features />
        <Ingredients />
        <Contact />
      </div>
    </main>
  );
}
