"use client";


import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Ingredients from '@/components/Ingredients';
import ProductShowcase from '@/components/ProductShowcase';
import Contact from '@/components/Contact';
import IntroScreen from '@/components/IntroScreen';
import Reveal from '@/components/motion/Reveal';

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
        <Reveal as="div" variant="section"><ProductShowcase /></Reveal>
        <Reveal as="div" variant="section" delay={70}><Features /></Reveal>
        <Reveal as="div" variant="section" delay={80}><Ingredients /></Reveal>
        <Reveal as="div" variant="section" delay={90}><Contact /></Reveal>
      </div>
    </main>
  );
}
