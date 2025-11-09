# Architecture des Landing Pages - Registry Pattern + Props Factory

## Vue d'ensemble

Ce projet utilise une architecture modulaire basée sur deux patterns principaux pour créer un système de landing pages flexible et multi-thème :

1. **Registry Pattern** → Modularité et découplage des sections
2. **Props Factory Pattern** → Transformation intelligente des données par thème/variant

Cette architecture permet de créer différentes landing pages en combinant des sections réutilisables, chacune adaptée à différents thèmes (`pacfr`, `itefr`, `pv`) et variants (`v1`, `v2`, etc.).

## Structure du Projet

```
src/
├── content/                    # Données business par thème
│   ├── header/
│   │   ├── header-content.v1.ts    # Contenu Header par thème
│   │   └── types.ts                # Types partagés
│   └── govSubsidy/
│       ├── content.v1.ts           # Contenu GovSubsidy par thème
│       └── types.ts
├── sections/                   # Composants techniques modulaires
│   ├── Header/
│   │   ├── Resolver.astro          # Point d'entrée standardisé
│   │   ├── Header.v1.astro         # Composant variant v1
│   │   ├── factory.ts              # Registry + Props Factories
│   │   └── index.ts                # Exports publics
│   ├── GovSubsidy/
│   │   ├── Resolver.astro
│   │   ├── GovSubsidy.v1.astro
│   │   ├── factory.ts
│   │   └── index.ts
│   └── index.ts                # Registry global des sections
└── landings/                   # Configuration des landing pages
    └── pacfr/
        └── pacfr-v1.ts         # Définition landing PACFR variant 1
```

## 1. Registry Pattern - Sections Modulaires

### Concept

Le **Registry Pattern** permet d'enregistrer et de résoudre dynamiquement des composants :

```typescript
// src/sections/index.ts
export const sectionsRegistry = {
    Header: HeaderResolver,
    GovSubsidy: GovSubsidyResolver,
    HeroSection,                    // Sections simples (sans variants)
    ReviewsCarousel,
} as const;
```

### Utilisation dans les Landing Pages

```typescript
// src/landings/pacfr/pacfr-v1.ts
export const pacfrV1LandingConfig = {
    sections: [
        { name: "Header", theme: "pacfr", variant: "v1" },
        { name: "HeroSection" },
        { name: "GovSubsidy", theme: "pacfr", variant: "v1" },
        { name: "ReviewsCarousel" },
    ]
};
```

**Avantages** :
- ✅ Sections réutilisables entre landing pages
- ✅ Ajout de nouvelles sections sans impact sur l'existant
- ✅ Configuration déclarative des pages

## 2. Props Factory Pattern - Transformation des Données

### Concept

Chaque section complexe utilise des **Props Factories** pour transformer les données business en props UI :

```typescript
// Input : thème simple
"pacfr"

// Output : props complètes
{
    bannerText: "Jusqu'à 11 500 € d'aides...",
    brandLogo: { name: "PACFR", file: pacfrLogo },
    partnerLogos: [...]
}
```

### Architecture d'une Section

Chaque section suit ce pattern standardisé :

#### 1. **Resolver.astro** - Point d'entrée standardisé
```astro
---
import { resolveVariant } from "./factory";
import { ContentByTheme } from "@content/header/content.v1";

const { theme = "pacfr", variant = "v1" } = Astro.props;

const content = ContentByTheme[theme];
const { component: Component, propsFactory } = resolveVariant(variant);
const props = propsFactory(content);
---

<Component {...props} />
```

#### 2. **factory.ts** - Registry + Props Factories
```typescript
/* --------------------- PROPS FACTORIES ---------- */
export const buildV1Props = (theme: Theme): HeaderV1Props => {
    return {
        bannerText: bannerTextByTheme[theme],
        brandLogo: headerBrandByTheme[theme],
        partnerLogos: processPartnerLogos(headerPartnersByTheme[theme]),
    };
};

/* --------------------- VARIANTS REGISTRY ---------- */
export const VariantsRegistry = {
    v1: { component: V1, propsFactory: buildV1Props },
    // v2: { component: V2, propsFactory: buildV2Props }, // Futur
} as const;

/* --------------------- RESOLVER ---------- */
export const resolveVariant = (variant: string = "v1") => {
    return VariantsRegistry[variant] ?? VariantsRegistry.v1;
};
```

#### 3. **[Section].v1.astro** - Composant UI pur
```astro
---
const { brandLogo, partnerLogos, bannerText } = Astro.props;
---

<header>
    <div>{bannerText}</div>
    <img src={brandLogo.file} alt={brandLogo.name} />
    {partnerLogos.map(logo => (
        <img src={logo.file} alt={logo.name} class={logo.visibilityClass} />
    ))}
</header>
```

## 3. Flux de Données Complet

### Étape 1 : Configuration Landing Page
```typescript
// landings/pacfr/pacfr-v1.ts
{ name: "Header", theme: "pacfr", variant: "v1" }
```

### Étape 2 : Résolution de Section
```typescript
// sections/index.ts
sectionsRegistry["Header"] // → HeaderResolver
```

### Étape 3 : Résolution de Variant
```typescript
// Header/factory.ts
resolveVariant("v1") // → { component: V1, propsFactory: buildV1Props }
```

### Étape 4 : Transformation des Données
```typescript
// Header/factory.ts
buildV1Props("pacfr") // → { bannerText: "...", brandLogo: {...} }
```

### Étape 5 : Rendu Final
```astro
<Header.v1 bannerText="..." brandLogo={...} />
```

## 4. Gestion Multi-Thème

### Structure du Contenu
```typescript
// content/header/header-content.v1.ts
export const ContentByTheme = {
    pacfr: {
        bannerText: "Jusqu'à 11 500 € d'aides pour vos travaux",
        brandLogo: { name: "PACFR", file: pacfrLogo }
    },
    itefr: {
        bannerText: "Aide transition énergétique ITE France",
        brandLogo: { name: "ITEFR", file: itefrLogo }
    },
    pv: {
        bannerText: "Installation panneaux solaires",
        brandLogo: { name: "PV", file: pvLogo }
    }
} as const;
```

### Résolution Automatique
```typescript
const content = ContentByTheme["pacfr"]; // Contenu spécifique PACFR
const props = buildV1Props(content);     // Props adaptées au variant v1
```

## 5. Ajout de Nouvelles Fonctionnalités

### Nouveau Thème
1. Ajouter le contenu dans `content/[section]/content.v1.ts`
2. Aucun changement de code nécessaire ✅

### Nouveau Variant
1. Créer `[Section].v2.astro`
2. Créer `buildV2Props()` factory
3. Ajouter au `VariantsRegistry`
4. Prêt à utiliser ✅

### Nouvelle Section
1. Copier le template de section existante
2. Adapter le contenu et les props
3. Ajouter au `sectionsRegistry` global
4. Utilisable dans toutes les landing pages ✅

## 6. Avantages de l'Architecture

### ✅ **Modularité**
- Sections indépendantes et réutilisables
- Aucun couplage entre sections

### ✅ **Scalabilité**
- Ajout de thèmes/variants sans impact existant
- Croissance linéaire de la complexité

### ✅ **Type Safety**
- Props strictement typées avec TypeScript
- Erreurs détectées à la compilation

### ✅ **Maintenabilité**
- Code standardisé et prévisible
- Templates réutilisables pour nouvelles sections

### ✅ **Testabilité**
- Props Factories facilement testables
- Séparation claire logique/présentation

## 7. Conventions de Nommage

### Fichiers
- `Resolver.astro` - Point d'entrée standardisé
- `[Section].v1.astro` - Composant variant spécifique
- factory.ts - Registry + Props Factories
- `content.v1.ts` - Données business par thème

### Fonctions
- `build[Section]V[X]Props()` - Props Factory
- `resolveVariant()` - Résolution de variant
- `ContentByTheme` - Données indexées par thème

### Types
- `[Section]V[X]Props` - Type des props variant
- `Theme` - Union des thèmes disponibles

## 8. Commandes de Développement

```bash
# Développement
npm run dev

# Build production
npm run build

# Formatage automatique
npm run format

# Vérification formatage
npm run format:check
```

---

Cette architecture combine flexibilité, maintenabilité et type safety pour créer un système de landing pages robuste et évolutif. Le pattern Registry + Props Factory permet une séparation claire entre données, logique et présentation tout en maintenant une excellente réutilisabilité. 🚀