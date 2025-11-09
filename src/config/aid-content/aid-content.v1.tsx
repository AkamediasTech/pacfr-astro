
export type AidContent = {
    eyebrow: string;
    title: string;
    highlight: string;
    secondTitle?: string;
    secondHighlight?: string;
    paragraphs: string[];
    videoId?: string;
}

type ThemesRecords = Record<"pv" | "itefr" | "pacfr", AidContent>;
// type ThemesRecords = Record< "pacfr", AidContent>;


export const aidContentByTheme: ThemesRecords = {
    pacfr: {
        eyebrow: "Transition énergétique",
        title: "Installez une pompe à chaleur, faites des économies",
        highlight: "augmentez la valeur de votre bien",
        secondTitle: "L’installation d’une pompe à chaleur désormais",
        secondHighlight: "financée par l’État",
        paragraphs: [
            "Le gouvernement met en place un programme pour aider les propriétaires, en particulier ceux chauffés au gaz ou au fioul, à passer à la pompe à chaleur air-eau grâce à des aides financières. Cette transition permet de réduire jusqu’à 70 % de la facture énergétique tout en limitant l’empreinte carbone.",
            "Le plus avantageux ? Les nouvelles subventions couvrent l’installation, évitant ainsi toute avance de frais pour les bénéficiaires. Notre équipe vous accompagne gratuitement pour estimer vos gains et sécuriser les primes avant le début des travaux..",
        ],
        videoId: "u971CsSDe1c",
    },
    itefr: {
        eyebrow: "Transition énergétique",
        title: "Installez une pompe à chaleur, faites des économies",
        highlight: "augmentez la valeur de votre bien",
        secondTitle: "L’installation d’une pompe à chaleur désormais",
        secondHighlight: "financée par l’État",
        paragraphs: [
            "Le gouvernement met en place un programme pour aider les propriétaires, en particulier ceux chauffés au gaz ou au fioul, à passer à la pompe à chaleur air-eau grâce à des aides financières. Cette transition permet de réduire jusqu’à 70 % de la facture énergétique tout en limitant l’empreinte carbone.",
            "Le plus avantageux ? Les nouvelles subventions couvrent l’installation, évitant ainsi toute avance de frais pour les bénéficiaires. Notre équipe vous accompagne gratuitement pour estimer vos gains et sécuriser les primes avant le début des travaux..",
        ],
        videoId: "u971CsSDe1c",
    },
    pv:    {
        eyebrow: "Transition énergétique",
        title: "Installez une pompe à chaleur, faites des économies",
        highlight: "augmentez la valeur de votre bien",
        secondTitle: "L’installation d’une pompe à chaleur désormais",
        secondHighlight: "financée par l’État",
        paragraphs: [
            "Le gouvernement met en place un programme pour aider les propriétaires, en particulier ceux chauffés au gaz ou au fioul, à passer à la pompe à chaleur air-eau grâce à des aides financières. Cette transition permet de réduire jusqu’à 70 % de la facture énergétique tout en limitant l’empreinte carbone.",
            "Le plus avantageux ? Les nouvelles subventions couvrent l’installation, évitant ainsi toute avance de frais pour les bénéficiaires. Notre équipe vous accompagne gratuitement pour estimer vos gains et sécuriser les primes avant le début des travaux..",
        ],        
        videoId: "u971CsSDe1c",
    },
};