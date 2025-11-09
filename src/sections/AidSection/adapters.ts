import type { AidContent } from "../../config/aid-content/aid-content.v1";

// Props propres à V1
export type AidV1Props = {
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

export const toV1Props = (c: AidContent): AidV1Props => ({
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
// export type AidV2Props = { eyebrow?: string; h1: string; textBlocks: string[]; media?: { type:"youtube"; id:string } };
// export const toV2Props = (c: AidContent): AidV2Props => ({
//   eyebrow: c.eyebrow,
//   h1: `${c.title} ${c.highlight}`,
//   textBlocks: c.paragraphs,
//   media: c.videoId ? { type:"youtube", id:c.videoId } : undefined
// });

/**
 * Registre central des adapters (variant -> fonction de mapping).
 * Permet de choisir dynamiquement la bonne fonction dans le Resolver.
 */
export const adapters = {
    v1: toV1Props,
    //   v2: toV2Props,
    //   v3: toV3Props,
} as const;

/**
 * Helper optionnel — retourne la fonction d’adaptation pour un variant donné.
 * Peut être utilisé directement dans le Resolver :
 *   const toProps = resolveAdapter(variant);
 *   const props = toProps(content);
 */
export const resolveAdapter = (variant: string) =>
    adapters[variant as keyof typeof adapters] ?? adapters.v1;
