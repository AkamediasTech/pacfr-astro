import V1 from "./GovSubsidy.v1.astro";
// import V2 from "./AidSection.v2.astro";

export const Variants: Record<string, any> = {
    v1: V1,
    // v2:V2,
};

export const resolveSection = (variant: string = "v1") =>
    Variants[variant] ?? V1;
