import EcoEnergieLogo from "../../assets/main/logo.png";
import RepubliqueFrancaiseLogo from "../../assets/main/logo_republique_francaise_q100.avif";
import FranceRelanceLogo from "../../assets/main/france_relance_logo.png";
import MaPrimeRenovLogo from "../../assets/main/ma_prime_renov_logo.png";
import FranceRenovLogo from "../../assets/main/france_renov_logo_q100.avif";

import type { Theme, Logo } from "./types";

export const bannerTextByTheme: Record<Theme, string> = {
    pacfr: "Jusqu'à 11 500 € d'aides pour votre pompe à chaleur",
    itefr: "Jusqu'à 15 000€ d'aides sur l'isolation thermique extérieure",
    pv: "Jusqu'à 11 000€ d'aides sur vos panneaux photovoltaïques",
};

export const headerBrandByTheme: Record<"pv" | "itefr" | "pacfr", Logo> = {
    pacfr: {
        name: "Eco Energie France",
        file: EcoEnergieLogo,
        className: "h-8 md:h-15 px-3",
    },
    itefr: {
        name: "Eco Energie France",
        file: EcoEnergieLogo,
        className: "h-8 md:h-15 px-3",
    },
    pv: {
        name: "Eco Energie France",
        file: EcoEnergieLogo,
        className: "h-8 md:h-15 px-3",
    },
};

export const headerPartnersByTheme: Record<"pv" | "itefr" | "pacfr", Logo[]> = {
    pacfr: [
        {
            name: "République Française",
            file: RepubliqueFrancaiseLogo,
            className: "h-8 md:h-15",
            visibleAbove: "tablet",
        },
        {
            name: "France Relance",
            file: FranceRelanceLogo,
            className: "md:h-15",
            visibleAbove: "mobile",
        },
        {
            name: "MaPrimeRenov",
            file: MaPrimeRenovLogo,
            className: "md:h-15",
            visibleAbove: "mobile",
        },
        {
            name: "France Renov",
            file: FranceRenovLogo,
            className: "md:h-15",
            visibleAbove: "desktop",
        },
    ],
    itefr: [
        /* ... */
    ],
    pv: [
        /* ... */
    ],
};
