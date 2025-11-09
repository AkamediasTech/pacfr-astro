import type { LandingDef } from "../../types/landing";

const def: LandingDef = {
    title: "Pacfr",
    description: "Pacfr est un simulateur de tarifs de pompe à chaleur",
    sections: [
        {
            type: "Header",
            props: {
                theme: "pacfr",
                bannerText:
                    "Jusqu'à 11 500 € d'aides pour votre pompe à chaleur",
            },
        },
        {
            type: "HeroSection",
            props: {},
        },
        {
            type: "HeroBadges",
            props: {},
        },
        {
            type: "ReviewsCarousel",
            props: {},
        },
        {
            type: "AidEligibilityCTA",
            props: {
                config: {
                    paragraphText:
                        "Êtes-vous éligible ? Découvrez le montant de vos aides !",
                    buttonText: "Simuler mes aides",
                },
            },
        },
        {
            type: "AidSection",
            props: {},
        },
    ],
};

export default def;
