import JarHero from "@/components/natural-lip-balm/JarHero";
import WhatItIs from "@/components/natural-lip-balm/WhatItIs";
import JarIngredients from "@/components/natural-lip-balm/JarIngredients";
import KeyBenefits from "@/components/natural-lip-balm/KeyBenefits";
import TrustBadges from "@/components/natural-lip-balm/TrustBadges";
import FinalCTA from "@/components/natural-lip-balm/FinalCTA";
import Variants from "@/components/natural-lip-balm/Variants";
import Reveal from "@/components/motion/Reveal";

export default function NaturalBalmPage() {
    return (
        // Luxury lip care collection needs a slightly larger anchor offset because the hero is sticky
        // and we want linked sections to clear the navbar and hero correctly.
        <main style={{ '--section-scroll-offset': '120px' } as React.CSSProperties}>
            <JarHero />
            <Reveal as="div" variant="section"><WhatItIs /></Reveal>
            <Reveal as="div" variant="section" delay={60}><JarIngredients /></Reveal>
            <Reveal as="div" variant="section" delay={70}><KeyBenefits /></Reveal>
            <Reveal as="div" variant="section" delay={80}><Variants /></Reveal>
            <Reveal as="div" variant="section" delay={90}><TrustBadges /></Reveal>
            <Reveal as="div" variant="section" delay={100}><FinalCTA /></Reveal>
        </main>
    );
}
