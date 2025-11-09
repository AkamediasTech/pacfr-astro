import V1 from "./Header.v1.astro";
// import V2 from "./Header.v2.astro";

export const HeaderVariants : Record<string, any> = {
    v1:V1,
    // v2:V2,
}

export const resolveHeader = (variant : string = "v1") => HeaderVariants[variant] ?? V1;