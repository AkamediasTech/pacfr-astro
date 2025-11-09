

import { headerBrandByTheme, headerPartnersByTheme, bannerTextByTheme} from "../../config/header/header-content.v1";
import type { Theme } from "../../config/header/types";
import V1 from "./Header.v1.astro";
import type { Logo } from "../../config/header/types";

type HeaderV1Props = {
  bannerText: string;
  brandLogo: Logo;
  partnerLogos: Logo[];
};


// Props attendues par Header.v1.astro
export const toV1Props = (theme: Theme): HeaderV1Props => {
  return {
    bannerText: bannerTextByTheme[theme],
    brandLogo: headerBrandByTheme[theme],
    partnerLogos: headerPartnersByTheme[theme],
  };
};

/* --------------------- REGISTRE COMPLET (variant -> comp+adapter) ---------- */

export const headerVariants = {
  v1: { component: V1, adapter: toV1Props },
  // v2: { component: V2, adapter: toV2Props },
} as const;

/* --------------------- RÉSOLUTION UNIQUE (pratique à importer) ------------- */

export const resolveHeaderVariant = (variant: string = "v1") => {
  return headerVariants[variant as keyof typeof headerVariants] ?? headerVariants.v1;
};