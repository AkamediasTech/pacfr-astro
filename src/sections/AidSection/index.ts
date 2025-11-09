import V1 from "./AidSection.v1.astro";
// import V2 from "./AidSection.v2.astro";

export const AidVariants : Record<string, any> = {
    v1:V1,
    // v2:V2,
}

export const resolveSection = (variant : string = "v1") => AidVariants[variant] ?? V1;