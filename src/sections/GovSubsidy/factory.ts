import type { ContentType } from "@content/govSubsidy/content.v1";
import V1 from "./GovSubsidy.v1.astro";

// Props propres à V1
export type V1Props = {
    heading: {
        eyebrow: string;
        title: string;
        highlight: string;
        secondTitle?: string;
        secondHighlight?: string;
    };
    body: string[];
    videoSrc?: string;
};

/**
 * Factory qui construit les props pour le composant GovSubsidy variant v1
 *
 * @description Transforme le contenu brut en props structurées pour GovSubsidy.v1.astro.
 * Génère automatiquement l'URL YouTube embed si un videoId est fourni dans le contenu.
 *
 * @param content - Contenu de la section par thème depuis ContentByTheme
 * @returns Props typées prêtes pour GovSubsidy.v1.astro
 *
 * @example
 * ```typescript
 * const content = ContentByTheme["pacfr"];
 * const props = buildV1Props(content);
 * // Résultat: { heading: {...}, body: [...], videoSrc: "..." }
 * ```
 */
export const buildV1Props = (c: ContentType): V1Props => ({
    heading: {
        eyebrow: c.eyebrow,
        title: c.title,
        highlight: c.highlight,
        secondTitle: c.secondTitle,
        secondHighlight: c.secondHighlight,
    },
    body: c.paragraphs,
    videoSrc: c.videoId
        ? `https://www.youtube.com/embed/${c.videoId}`
        : undefined,
});

// Plus tard, V2 pourrait vouloir un format différent
// export type V2Props = { eyebrow?: string; h1: string; textBlocks: string[]; media?: { type:"youtube"; id:string } };
// export const toV2Props = (c: Content): V2Props => ({
//   eyebrow: c.eyebrow,
//   h1: `${c.title} ${c.highlight}`,
//   textBlocks: c.paragraphs,
//   media: c.videoId ? { type:"youtube", id:c.videoId } : undefined
// });

/**
 * Registre des variants de sections GovSubsidy avec leurs composants et factories de props
 *
 * @description Contient tous les variants disponibles pour la section GovSubsidy.
 * Chaque variant associe un composant Astro à sa factory de props correspondante.
 */
export const VariantsRegistry = {
    v1: { component: V1, propsFactory: buildV1Props },
    // v2: { component: V2, propsFactory: buildV2Props }, // Futur
    // v3: { component: V3, propsFactory: buildV3Props }, // Futur
} as const;

/**
 * Résout un variant de section GovSubsidy vers son composant et sa factory de props
 *
 * @param variant - Nom du variant ("v1", "v2", etc.) - défaut: "v1"
 * @returns Objet contenant le composant Astro et sa fonction propsFactory
 *
 * @example
 * ```typescript
 * const { component: Component, propsFactory } = resolveGovSubsidyVariant("v1");
 * const props = propsFactory(content);
 * // Render: <Component {...props} />
 * ```
 */
export const resolveVariant = (variant: string) =>
    VariantsRegistry[variant as keyof typeof VariantsRegistry] ??
    VariantsRegistry.v1;
