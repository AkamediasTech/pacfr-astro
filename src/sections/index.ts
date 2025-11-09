// src/sections/index.ts  (registre qui mappe type -> composant)
import HeroSection from "./HeroSection.astro";
import ReviewsCarousel from "./ReviewsCarousel.astro";
import HeroBadges from "./HeroBadges.astro";

// import CTAResolver from "./AidEligibilityCTA/Resolver.astro";
import AidEligibilityCTA from "./AidEligibilityCTA.astro";
import HeaderResolver from "./Header/Resolver.astro";
import GovSubsidyResolver from "./GovSubsidy/Resolver.astro";

export const sectionsRegistry: Record<string, any> = {
    // Sections complexes (avec resolver)
    Header: HeaderResolver,
    GovSubsidy: GovSubsidyResolver,
    // AidEligibilityCTA: CTAResolver,

    // Sections simples (direct)
    HeroSection,
    ReviewsCarousel,
    AidEligibilityCTA,
    HeroBadges,
};
