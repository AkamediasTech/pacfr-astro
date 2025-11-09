import { ContentByTheme } from "@content/aidEligibilityCTA/content.v1";
import type {
    ContentItem,
    ContentVariant,
} from "@content/aidEligibilityCTA/types";
import V1 from "./AidEligibilityCTA.v1.astro";

/* --------------------- PROPS FACTORY ---------- */
/**
 * Factory pour AidEligibilityCTA variant v1
 * Enrichit le contenu avec des props calculées (icônes, classes CSS)
 */

export type V1PropsType = {
    paragraphText: string;
    buttonText: string;
};

export const buildV1Props = (content: ContentItem): V1PropsType => {
    return {
        paragraphText: content.paragraphText,
        buttonText: content.buttonText,
    };
};

export const VariantsRegistry = {
    v1: {
        component: V1,
        propsFactory: buildV1Props,
    },
} as const;

export const resolveVariant = (variant: string = "v1") => {
    return (
        VariantsRegistry[variant as keyof typeof VariantsRegistry] ??
        VariantsRegistry.v1
    );
};
