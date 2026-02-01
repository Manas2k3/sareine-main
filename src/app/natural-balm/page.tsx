import JarHero from "@/components/natural-lip-balm/JarHero";
import WhatItIs from "@/components/natural-lip-balm/WhatItIs";
import JarIngredients from "@/components/natural-lip-balm/JarIngredients";
import KeyBenefits from "@/components/natural-lip-balm/KeyBenefits";
import TrustBadges from "@/components/natural-lip-balm/TrustBadges";
import FinalCTA from "@/components/natural-lip-balm/FinalCTA";
import Variants from "@/components/natural-lip-balm/Variants";

export default function NaturalBalmPage() {
    return (
        <main>
            <JarHero />
            <WhatItIs />
            <JarIngredients />
            <KeyBenefits />
            <Variants />
            <TrustBadges />
            <FinalCTA />
        </main>
    );
}
