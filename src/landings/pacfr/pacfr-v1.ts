import type { LandingDef } from "../../types/landing";

const def: LandingDef = {
    title: "Pacfr",
    description: "Pacfr est un simulateur de tarifs de pompe à chaleur",
    sections: [
        {
            type: "Header",
            // props: {
            //     theme: "pacfr",
            //     bannerText:
            //         "Jusqu'à 11 500 € d'aides pour votre pompe à chaleur",
            // },
            // props: {},
            theme: "pacfr",
            variant: "v1",
        },
        {
            theme: "pacfr",
            type: "HeroSection",
            // props: {},
        },
        {
            theme: "pacfr",
            type: "HeroBadges",
            // props: {},
        },
        {
            theme: "pacfr",
            type: "ReviewsCarousel",
            // props: {},
        },
        {
            theme: "pacfr",
            type: "AidEligibilityCTA",
            variant: "v1",
            props: {
                config: {
                    paragraphText:
                        "Êtes-vous éligible ? Découvrez le montant de vos aides !",
                    buttonText: "Simuler mes aides",
                },
            },
        },
        {
            theme: "pacfr",
            type: "GovSubsidy",
            // props: {},
        },
    ],
};

export default def;
