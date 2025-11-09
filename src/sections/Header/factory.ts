import {
    headerBrandByTheme,
    headerPartnersByTheme,
    bannerTextByTheme,
} from "@content/header/header-content.v1";
import type { Theme } from "@content/header/types";
import V1 from "./Header.v1.astro";
import type { Logo } from "@content/header/types";
import type { Visible } from "@/themes/header";
import { ContentByTheme } from "@content/header/header-content.v1";

/* --------------------- UTILITIES ---------- */
const visibility = {
    mobile: "flex",
    tablet: "hidden sm:flex",
    desktop: "hidden lg:flex",
} as const;

/**
 * Convertit un niveau de visibilité en classe CSS Tailwind
 * @param v - Niveau de visibilité responsive ou undefined
 * @returns Classe CSS Tailwind pour gérer la visibilité responsive
 */
export const getVisibilityClass = (v: Visible) => {
    if (!v) return visibility.mobile;
    return visibility[v];
};

/* --------------------- BUILDERS ---------- */
type HeaderV1Props = {
    bannerText: string;
    brandLogo: Logo;
    partnerLogos: Array<Logo & { visibilityClass: string }>;
};

/**
 * Factory qui construit les props pour le composant Header variant v1
 *
 * @description Transforme un thème simple en props complètes pour Header.v1.astro.
 * Résout automatiquement le contenu par thème et calcule les classes de visibilité
 * pour chaque logo partenaire.
 *
 * @param theme - Le thème de la marque ("pacfr" | "itefr" | "pv")
 * @returns Props typées prêtes pour Header.v1.astro
 *
 * @example
 * ```typescript
 * const props = buildV1Props("pacfr");
 * // Résultat: { bannerText: "...", brandLogo: {...}, partnerLogos: [...] }
 * ```
 */
// export const buildV1Props = (theme: Theme): HeaderV1Props => {
//     const processPartnerLogos = (logos: Logo[]) => {
//         return logos.map((logo) => ({
//             ...logo,
//             visibilityClass: getVisibilityClass(logo.visibleAbove ?? "desktop"),
//         }));
//     };

//     return {
//         bannerText: bannerTextByTheme[theme],
//         brandLogo: headerBrandByTheme[theme],
//         partnerLogos: processPartnerLogos(headerPartnersByTheme[theme]),
//     };
// };

export const buildV1Props = (theme: Theme): HeaderV1Props => {
    const content = ContentByTheme[theme];

    if (!content) {
        console.warn(`⚠️ No header content found for theme: ${theme}`);
        // Fallback vers pacfr
        return buildV1Props("pacfr");
    }

    return {
        bannerText: content.bannerText,
        brandLogo: content.brandLogo,
        // ✨ MAGIE : Enrichir les logos avec les classes CSS calculées
        partnerLogos: content.partnerLogos.map((logo) => ({
            ...logo,
            visibilityClass: getVisibilityClass(logo.visibleAbove as Visible),
        })),
    };
};

/* --------------------- REGISTRE COMPLET (variant -> comp+propsFactory) ---------- */
/**
 * Registre des variants Header avec leurs composants et factories de props
 *
 * @description Contient tous les variants disponibles pour la section Header.
 * Chaque variant associe un composant Astro à sa factory de props correspondante.
 */
export const VariantsRegistry = {
    v1: { component: V1, propsFactory: buildV1Props },
    // v2: { component: V2, propsFactory: toV2Props },
} as const;

/* --------------------- RÉSOLUTION UNIQUE (pratique à importer) ------------- */
/**
 * Résout un variant de Header vers son composant et sa factory de props
 *
 * @param variant - Nom du variant ("v1", "v2", etc.) - défaut: "v1"
 * @returns Objet contenant le composant Astro et sa fonction propsFactory
 *
 * @example
 * ```typescript
 * const { component: Component, propsFactory } = resolveVariant("v1");
 * const props = propsFactory("pacfr");
 * // Render: <Component {...props} />
 * ```
 */
export const resolveVariant = (variant: string = "v1") => {
    const resolved = VariantsRegistry[variant as keyof typeof VariantsRegistry];

    if (!resolved) {
        console.warn(
            `⚠️ Header variant "${variant}" not found, falling back to v1`
        );
        console.log("Available variants:", Object.keys(VariantsRegistry));
    }

    return resolved ?? VariantsRegistry.v1;
};
