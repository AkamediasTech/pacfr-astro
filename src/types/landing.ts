// src/types/landing.ts
export type HeaderLogo = {
    name: string;
    file: ImageMetadata; // ImageMetadata si tu veux typer + strict
    className?: string;
    visibleAbove?: "mobile" | "tablet" | "desktop";
};

export type SectionDef = {
    type: string; // ex: "Hero" | "Features" | "FAQ" | "CTA"
    props: Record<string, any>;
};

export type LandingDef = {
    title: string;
    description?: string;
    sections: SectionDef[];
};
