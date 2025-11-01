export type ChoiceOption = {
  value: string;
  label: string;
  icon?: 'apartment' | 'house' | 'tenant' | 'owner' | 'oil' | 'gas' | 'electricity' | 'other';
};

export type FormField = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  fullWidth?: boolean;  // ← optionnel si certains champs doivent prendre toute la ligne
};

export type Step =
  | {
      id: string;
      type: 'choice';
      title: string;
      subtitle?: string;
      options: ChoiceOption[];
    }
  | {
      id: string;
      type: 'form';
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
  title: 'Calculez le montant de vos aides 2025',
  subtitle: 'Anah, CEE, MPR, Éco-PTZ',
  backgroundClass: 'bg-brand-blue',
};

export type PhaseHeaderConfig = {
  step: PhaseHeaderContent;
  summary?: PhaseHeaderContent;
  final?: PhaseHeaderContent;
};

const DEFAULT_PHASE_AUTO_ADVANCE_DELAY_MS = 1200;

export const CHECKLIST_ANIMATION = {
  minDelayMs: 350,
  maxDelayMs: 650,
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
    stepLabel: string;               // « Décrivez votre logement »
    checklistLabel?: string;         // « Analyse en cours… »
    autoAdvanceDelayMs?: number;     // 1200 par défaut : la phase suivante démarre autoAdvanceDelayMs après la fin de l'animation de checklist. Autrement dit, c'est le temps d'attente qu'on passe sur l'écran de succès de la phase
  };
  successMessage: string | ((answers: Record<string, string>) => string);
  isFinal?: boolean;
};

export const PHASES: PhaseConfig[] = [
  {
    id: 'housing',
    phaseNumber: 1,
    steps: [
      {
        id: 'propertyType',
        type: 'choice',
        title: 'Votre logement :',
        options: [
          { value: 'apartment', label: 'Appartement', icon: 'apartment' },
          { value: 'house', label: 'Maison', icon: 'house' },
        ],
      },
      {
        id: 'ownership',
        type: 'choice',
        title: 'Vous êtes :',
        options: [
          { value: 'tenant', label: 'Locataire', icon: 'tenant' },
          { value: 'owner', label: 'Propriétaire', icon: 'owner' },
        ],
      },
      {
        id: 'heating',
        type: 'choice',
        title: 'Système de chauffage actuel :',
        options: [
          { value: 'oil', label: 'Fioul', icon: 'oil' },
          { value: 'gas', label: 'Gaz', icon: 'gas' },
          { value: 'electricity', label: 'Électricité', icon: 'electricity' },
          { value: 'other', label: 'Autres', icon: 'other' },
        ],
      },
      {
        id: 'surface',
        type: 'choice',
        title: 'Superficie de votre habitation :',
        options: [
          { value: '0-100', label: '0 à 100 m²' },
          { value: '100-150', label: '100 à 150 m²' },
          { value: '150-200', label: '150 à 200 m²' },
          { value: '200+', label: '+ de 200 m²' },
        ],
      },
    ],
    checklistMessages: [
      'Analyse des caractéristiques de votre logement',
      'Prise en compte de votre statut',
      'Adaptation des aides selon votre profil',
    ],
    header: {
      step: {
        title: 'Calculez le montant de vos aides 2025',
        subtitle: 'Anah, CEE, MPR, Éco-PTZ',
        backgroundClass: 'bg-brand-blue',
      },
      summary: {
        title: 'Analyse de vos réponses',
        subtitle: 'Nous validons votre éligibilité.',
        backgroundClass: 'bg-brand-blue',
      },
    },
    progress: {
      stepLabel: 'Décrivez votre logement',
      checklistLabel: 'Analyse en cours…',
      autoAdvanceDelayMs: DEFAULT_PHASE_AUTO_ADVANCE_DELAY_MS,
    },
    successMessage: 'Votre logement est éligible à MaPrimeRénov',
  },
  {
    id: 'location',
    phaseNumber: 2,
    steps: [
      {
        id: 'zipcode',
        type: 'form',
        title: 'Vérifions votre éligibilité aux aides régionales :',
        fields: [
          {
            name: 'postal-code',
            label: 'Code postal',
            type: 'text',
            placeholder: 'ex : 75008',
            autoComplete: 'postal-code',
            maxLength: 5,
          },
          {
            name: 'address-level2',
            label: 'Ville',
            type: 'text',
            placeholder: 'ex : Paris',
            autoComplete: 'address-level2',
          },
        ],
        submitLabel: 'Vérifier mon éligibilité',
      },
    ],
    checklistMessages: [
      'Vérification de la géolocalisation',
      'Recherche des aides disponibles dans votre région',
    ],
    header: {
      step: {
        title: 'Calculez le montant de vos aides 2025',
        subtitle: 'Anah, CEE, MPR, Éco-PTZ',
        backgroundClass: 'bg-brand-blue',
      },
      summary: {
        title: 'Analyse de votre localisation',
        subtitle: 'Nous identifions vos aides régionales.',
        backgroundClass: 'bg-brand-blue',
      },
    },
    progress: {
      stepLabel: 'Validez votre localisation',
      checklistLabel: 'Analyse de votre zone…',
      autoAdvanceDelayMs: DEFAULT_PHASE_AUTO_ADVANCE_DELAY_MS,
    },
    successMessage: (answers) =>
      `Bonne nouvelle ! ${answers['address-level2'] ?? 'Votre commune'} est éligible à 1 400 € d’aides`,
  },
  {
    id: 'contact',
    phaseNumber: 3,
    isFinal: true,
    steps: [
      {
        id: 'contactDetails',
        type: 'form',
        title: 'Recevez votre estimation personnalisée :',
        fields: [
          { name: 'given-name', label: 'Prénom', type: 'text', autoComplete: 'given-name' },
          { name: 'family-name', label: 'Nom', type: 'text', autoComplete: 'family-name' },
          { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
          { name: 'tel', label: 'Téléphone', type: 'tel', autoComplete: 'tel' },
        ],
        submitLabel: 'Obtenir une estimation',
      },
    ],
    checklistMessages: [
      'Analyse de votre dossier',
      'Calcul des aides disponibles',
      'Sélection des professionnels RGE',
      'Application des remises disponibles',
      'Préparation de votre estimation personnalisée',
    ],
    header: {
      step: {
        title: 'Votre estimation est prête',
        subtitle: 'Renseignez vos coordonnées pour la recevoir.',
        backgroundClass: 'bg-[#149f48]',
      },
      summary: {
        title: 'Nous vous contacterons sous 24h',
        subtitle: 'Un conseiller vous rappellera très prochainement.',
        backgroundClass: 'bg-emerald-600',
      },
      final: {
        title: 'Nous vous contacterons sous 24h',
        subtitle: 'Un conseiller vous rappellera très prochainement.',
        backgroundClass: 'bg-[#149f48]',
      },
    },
    progress: {
      stepLabel: 'Saisissez vos coordonnées',
      checklistLabel: 'Préparation de votre estimation…',
      autoAdvanceDelayMs: 0, // pas de bascule automatique sur la phase finale
    },
    successMessage: 'Demande soumise avec succès',
  },
];
