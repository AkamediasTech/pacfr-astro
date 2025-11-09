import type { JSX } from "preact/jsx-runtime";

export type ChoiceOption = {
    value: string;
    label: string;
    icon?:
        | "apartment"
        | "house"
        | "tenant"
        | "owner"
        | "oil"
        | "gas"
        | "electricity"
        | "other";
};

export type ChoiceStep = Extract<Step, { type: "choice" }>;
export type FormStep = Extract<Step, { type: "form" }>;

export const OPTION_ICONS: Record<
    NonNullable<ChoiceOption["icon"]>,
    JSX.Element
> = {
    apartment: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
            <path d="M9 22v-4h6v4"></path>
            <path d="M8 6h.01"></path>
            <path d="M16 6h.01"></path>
            <path d="M12 6h.01"></path>
            <path d="M12 10h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 10h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 10h.01"></path>
            <path d="M8 14h.01"></path>
        </svg>
    ),
    house: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
    ),
    tenant: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M16 19h6"></path>
            <path d="M16 2v4"></path>
            <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"></path>
            <path d="M3 10h18"></path>
            <path d="M8 2v4"></path>
        </svg>
    ),
    owner: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
        </svg>
    ),
    oil: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <line x1="3" x2="15" y1="22" y2="22"></line>
            <line x1="4" x2="14" y1="9" y2="9"></line>
            <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path>
            <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"></path>
        </svg>
    ),
    gas: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
        </svg>
    ),
    electricity: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
    ),
    other: (
        <svg
            class="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"></path>
            <path d="M7 16v6"></path>
            <path d="M13 19v3"></path>
            <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"></path>
        </svg>
    ),
};

export type FormField = {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
    maxLength?: number;
    fullWidth?: boolean; // ← optionnel si certains champs doivent prendre toute la ligne
};

export type Step =
    | {
          id: string;
          type: "choice";
          title: string;
          subtitle?: string;
          options: ChoiceOption[];
      }
    | {
          id: string;
          type: "form";
          title: string;
          subtitle?: string;
          fields: FormField[];
          submitLabel: string;
      };

export type PhaseHeaderContent = {
    title: string;
    subtitle?: string;
    backgroundClass?: string;
};

export const DEFAULT_HEADER_STEP: PhaseHeaderContent = {
    title: "Calculez le montant de vos aides 2025",
    subtitle: "Anah, CEE, MPR, Éco-PTZ",
    backgroundClass: "bg-brand-blue",
};

export type PhaseHeaderConfig = {
    step: PhaseHeaderContent;
    summary?: PhaseHeaderContent;
    final?: PhaseHeaderContent;
};

const DEFAULT_PHASE_AUTO_ADVANCE_DELAY_MS = 1200;
const DEFAULT_CHECK_ITEM_MIN_DELAY_MS = 950;
const DEFAULT_CHECK_ITEM_MAX_DELAY_MS = 1450;

// const DEFAULT_CHECK_ITEM_MIN_DELAY_MS = 95000;
// const DEFAULT_CHECK_ITEM_MAX_DELAY_MS = 145000;

export const CHECKLIST_ANIMATION = {
    minDelayMs: DEFAULT_CHECK_ITEM_MIN_DELAY_MS,
    maxDelayMs: DEFAULT_CHECK_ITEM_MAX_DELAY_MS,
};

export type PhaseConfig = {
    id: string;
    phaseNumber: number;
    steps: Step[];
    checklistAnimation?: {
        minDelayMs: number;
        maxDelayMs: number;
    };
    checklistMessages: string[];
    header: PhaseHeaderConfig;
    progress: {
        stepLabel: string; // « Décrivez votre logement »
        checklistLabel?: string; // « Analyse en cours… »
        autoAdvanceDelayMs?: number; // 1200 par défaut : la phase suivante démarre autoAdvanceDelayMs après la fin de l'animation de checklist. Autrement dit, c'est le temps d'attente qu'on passe sur l'écran de succès de la phase
    };
    successMessage: string | ((answers: Record<string, string>) => string);
    isFinal?: boolean;
};

export const PHASES: PhaseConfig[] = [
    {
        id: "housing",
        phaseNumber: 1,
        steps: [
            {
                id: "propertyType",
                type: "choice",
                title: "Votre logement :",
                options: [
                    {
                        value: "apartment",
                        label: "Appartement",
                        icon: "apartment",
                    },
                    { value: "house", label: "Maison", icon: "house" },
                ],
            },
            {
                id: "ownership",
                type: "choice",
                title: "Vous êtes :",
                options: [
                    { value: "tenant", label: "Locataire", icon: "tenant" },
                    { value: "owner", label: "Propriétaire", icon: "owner" },
                ],
            },
            {
                id: "heating",
                type: "choice",
                title: "Système de chauffage actuel :",
                options: [
                    { value: "oil", label: "Fioul", icon: "oil" },
                    { value: "gas", label: "Gaz", icon: "gas" },
                    {
                        value: "electricity",
                        label: "Électricité",
                        icon: "electricity",
                    },
                    { value: "other", label: "Autres", icon: "other" },
                ],
            },
            {
                id: "surface",
                type: "choice",
                title: "Superficie de votre habitation :",
                options: [
                    { value: "0-100", label: "0 à 100 m²" },
                    { value: "100-150", label: "100 à 150 m²" },
                    { value: "150-200", label: "150 à 200 m²" },
                    { value: "200+", label: "+ de 200 m²" },
                ],
            },
        ],
        checklistAnimation: CHECKLIST_ANIMATION,
        checklistMessages: [
            "Analyse des caractéristiques de votre logement",
            "Prise en compte de votre statut",
            "Adaptation des aides selon votre profil",
        ],
        header: {
            step: {
                title: "Calculez le montant de vos aides 2025",
                subtitle: "Anah, CEE, MPR, Éco-PTZ",
                backgroundClass: "bg-brand-blue",
            },
            summary: {
                title: "Analyse de vos réponses",
                subtitle: "Nous validons votre éligibilité.",
                backgroundClass: "bg-brand-blue",
            },
        },
        progress: {
            stepLabel: "Décrivez votre logement",
            checklistLabel: "Analyse en cours…",
            autoAdvanceDelayMs: DEFAULT_PHASE_AUTO_ADVANCE_DELAY_MS,
        },
        successMessage: "Votre logement est éligible à MaPrimeRénov",
    },
    {
        id: "location",
        phaseNumber: 2,
        steps: [
            {
                id: "zipcode",
                type: "form",
                title: "Vérifions votre éligibilité aux aides régionales :",
                fields: [
                    {
                        name: "postal-code",
                        label: "Code postal",
                        type: "text",
                        placeholder: "ex : 75008",
                        autoComplete: "postal-code",
                        maxLength: 5,
                    },
                    {
                        name: "address-level2",
                        label: "Ville",
                        type: "text",
                        placeholder: "ex : Paris",
                        autoComplete: "address-level2",
                    },
                ],
                submitLabel: "Vérifier mon éligibilité",
            },
        ],
        checklistAnimation: CHECKLIST_ANIMATION,
        checklistMessages: [
            "Vérification de la géolocalisation",
            "Recherche des aides disponibles dans votre région",
        ],
        header: {
            step: {
                title: "Calculez le montant de vos aides 2025",
                subtitle: "Anah, CEE, MPR, Éco-PTZ",
                backgroundClass: "bg-brand-blue",
            },
            summary: {
                title: "Analyse de votre localisation",
                subtitle: "Nous identifions vos aides régionales.",
                backgroundClass: "bg-brand-blue",
            },
        },
        progress: {
            stepLabel: "Validez votre localisation",
            checklistLabel: "Analyse de votre zone…",
            autoAdvanceDelayMs: DEFAULT_PHASE_AUTO_ADVANCE_DELAY_MS,
        },
        successMessage: (answers) =>
            `Bonne nouvelle ! ${answers["address-level2"] ?? "Votre commune"} est éligible à 1 400 € d’aides`,
    },
    {
        id: "contact",
        phaseNumber: 3,
        isFinal: true,
        steps: [
            {
                id: "contactDetails",
                type: "form",
                title: "Recevez votre estimation personnalisée :",
                fields: [
                    {
                        name: "given-name",
                        label: "Prénom",
                        type: "text",
                        autoComplete: "given-name",
                    },
                    {
                        name: "family-name",
                        label: "Nom",
                        type: "text",
                        autoComplete: "family-name",
                    },
                    {
                        name: "email",
                        label: "Email",
                        type: "email",
                        autoComplete: "email",
                    },
                    {
                        name: "tel",
                        label: "Téléphone",
                        type: "tel",
                        autoComplete: "tel",
                    },
                ],
                submitLabel: "Obtenir une estimation",
            },
        ],
        checklistAnimation: CHECKLIST_ANIMATION,
        checklistMessages: [
            "Analyse de votre dossier",
            "Calcul des aides disponibles",
            "Sélection des professionnels RGE",
            "Application des remises disponibles",
            "Préparation de votre estimation personnalisée",
        ],
        header: {
            step: {
                title: "Votre estimation est prête",
                subtitle: "Renseignez vos coordonnées pour la recevoir.",
                backgroundClass: "bg-[#149f48]",
            },
            summary: {
                title: "Nous vous contacterons sous 24h",
                subtitle: "Un conseiller vous rappellera très prochainement.",
                backgroundClass: "bg-emerald-600",
            },
            final: {
                title: "Nous vous contacterons sous 24h",
                subtitle: "Un conseiller vous rappellera très prochainement.",
                backgroundClass: "bg-[#149f48]",
            },
        },
        progress: {
            stepLabel: "Saisissez vos coordonnées",
            checklistLabel: "Préparation de votre estimation…",
            autoAdvanceDelayMs: 0, // pas de bascule automatique sur la phase finale
        },
        successMessage: "Demande soumise avec succès",
    },
];
