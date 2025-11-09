// src/sections/index.ts  (registre qui mappe type -> composant)
import HeroSection from "./HeroSection.astro";
// import AidSection from "./AidSection.astro";
import ReviewsCarousel from "./ReviewsCarousel.astro";
import HeroBadges from "./HeroBadges.astro";
import AidEligibilityCTA from "../components/AidEligibilityCTA.astro";
import HeaderResolver from "./Header/HeaderResolver.astro";
import AidSectionResolver from "./AidSection/AidSectionResolver.astro";

export const sectionsRegistry: Record<string, any> = {
    Header: HeaderResolver,
    HeroSection,
    AidSection: AidSectionResolver,
    ReviewsCarousel,
    AidEligibilityCTA,
    HeroBadges,
};
