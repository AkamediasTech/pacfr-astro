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

export type PhaseConfig = {
  id: string;
  phaseNumber: number;
  steps: Step[];
  checklistId: 'beforeZip' | 'beforeContact' | 'finalSummary';
  successMessage: string | ((answers: Record<string, string>) => string);
  isFinal?: boolean;
};

export const PHASES: PhaseConfig[] = [
  {
    id: 'housing',
    phaseNumber: 1,
    checklistId: 'beforeZip',
    successMessage: 'Votre logement est éligible à MaPrimeRénov',
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
  },
  {
    id: 'location',
    phaseNumber: 2,
    checklistId: 'beforeContact',
    successMessage: (answers) =>
      `Bonne nouvelle ! ${answers.city ?? 'Votre ville'} est éligible à 1 400 € d’aides`,
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
  },
  {
    id: 'contact',
    phaseNumber: 3,
    checklistId: 'finalSummary',
    successMessage: 'Demande soumise avec succès',
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
        submitLabel: 'Recevoir mon estimation',
      },
    ],
  },
];

export const CHECKLIST_PHASES = [
  {
    id: 'beforeZip',
    phase: 1,
    messages: {
      Aides: [
        'Analyse des caractéristiques de votre logement',
        'Prise en compte de votre statut',
        'Adaptation des aides selon votre profil',
      ],
    },
  },
  {
    id: 'beforeContact',
    phase: 2,
    messages: {
      Aides: [
        'Vérification de la géolocalisation',
        'Recherche des aides disponibles dans votre région',
      ],
    },
  },
  {
    id: 'finalSummary',
    phase: 3,
    messages: {
      Aides: [
        'Analyse de votre dossier',
        'Calcul des aides disponibles',
        'Sélection des professionnels RGE',
        'Application des remises disponibles',
        'Préparation de votre estimation personnalisée',
      ],
    },
  },
];