# Architecture des Landing Pages - Guide Complet pour Débutants

## Table des Matières
1. Le Problème à Résoudre
2. Vue d'Ensemble de la Solution
3. Anatomie Complète d'une Section
4. Registry Pattern - Explication Détaillée
5. Props Factory Pattern - Explication Détaillée
6. Flux de Données Complet - Étape par Étape
7. Gestion Multi-Thème - Logique Détaillée
8. Pourquoi Cette Architecture ?
9. Comparaison avec d'Autres Approches
10. Guide Pratique pour Développeurs

---

## 1. Le Problème à Résoudre

### Contexte Business
Notre entreprise propose différents services (PACFR, ITEFR, PV) nécessitant chacun des landing pages personnalisées. Chaque service a :
- **Ses propres contenus** (textes, logos, couleurs)
- **Ses propres variantes** (designs différents pour tester les conversions)
- **Des sections communes** (Header, Footer, Témoignages)

### Défis Techniques
Sans architecture claire, nous aurions :

#### ❌ **Approche Naïve** (ce qu'il faut éviter)
```
pages/
├── pacfr-landing-v1.astro    ← Code dupliqué
├── pacfr-landing-v2.astro    ← Code dupliqué  
├── itefr-landing-v1.astro    ← Code dupliqué
├── itefr-landing-v2.astro    ← Code dupliqué
└── pv-landing-v1.astro       ← Code dupliqué
```

**Problèmes** :
- 🔥 Code dupliqué partout (maintenance impossible)
- 🔥 Changement d'une section = modifier 10+ fichiers
- 🔥 Ajout d'un nouveau thème = copier tout le code
- 🔥 Tests A/B difficiles (variantes éparpillées)

#### ✅ **Notre Solution** (modulaire et maintenable)
```
src/
├── content/        ← Données séparées par thème
├── sections/       ← Composants réutilisables  
├── landings/       ← Configuration déclarative
└── pages/          ← Pages générées automatiquement
```

**Avantages** :
- ✅ Code réutilisé à 90%
- ✅ Changement d'une section = 1 fichier modifié
- ✅ Nouveau thème = ajouter des données uniquement
- ✅ Variantes facilement gérables

---

## 2. Vue d'Ensemble de la Solution

### Principe Central : Séparation des Responsabilités

Notre architecture sépare clairement :

1. **QUOI** (Contenu) → Dossier `/content/`
2. **COMMENT** (Présentation) → Dossier `/sections/`  
3. **OÙ** (Assemblage) → Dossier `/landings/`

### Les Deux Patterns Principaux

#### Registry Pattern 🗂️
**"Un annuaire qui trouve le bon composant"**

Comme un annuaire téléphonique :
```typescript
// Je cherche "Header" → J'obtiens HeaderResolver
sectionsRegistry["Header"] → HeaderResolver
```

#### Props Factory Pattern 🏭
**"Une usine qui fabrique des props sur mesure"**

Comme une usine personnalisée :
```typescript
// J'envoie "pacfr" → Je reçois des props PACFR
buildHeaderV1Props("pacfr") → { bannerText: "PACFR...", brandLogo: pacfrLogo }
```

### Structure Complète du Projet

```
src/
├── content/                           # 📊 DONNÉES BUSINESS
│   ├── header/
│   │   ├── header-content.v1.ts       # Textes/logos par thème
│   │   └── types.ts                   # Définitions TypeScript
│   └── govSubsidy/
│       ├── content.v1.ts              # Contenu aides gouvernementales
│       └── types.ts
├── sections/                          # 🧩 COMPOSANTS MODULAIRES
│   ├── Header/
│   │   ├── Resolver.astro             # "Aiguilleur" intelligent
│   │   ├── Header.v1.astro            # Design version 1
│   │   ├── factory.ts                 # Usine à props + Registry
│   │   └── index.ts                   # Exports publics
│   ├── GovSubsidy/
│   │   ├── Resolver.astro
│   │   ├── GovSubsidy.v1.astro
│   │   ├── factory.ts
│   │   └── index.ts
│   ├── HeroSection.astro              # Section simple (sans variants)
│   ├── ReviewsCarousel.astro
│   └── index.ts                       # Registry global des sections
├── landings/                          # 🎯 CONFIGURATION DES PAGES
│   ├── pacfr/
│   │   ├── pacfr-v1.ts                # Landing PACFR version 1
│   │   └── pacfr-v2.ts                # Landing PACFR version 2
│   ├── itefr/
│   │   └── itefr-v1.ts
│   └── pv/
│       └── pv-v1.ts
└── pages/                             # 📄 PAGES ASTRO FINALES
    ├── pacfr/
    │   └── index.astro                # Page générée automatiquement
    └── index.astro                    # Page d'accueil
```

---

## 3. Anatomie Complète d'une Section

Prenons l'exemple de la section **Header** pour comprendre chaque fichier :

### 3.1 Content (Données Business)

```typescript
// src/content/header/header-content.v1.ts
import pacfrLogo from "@assets/logos/pacfr.png";
import itefrLogo from "@assets/logos/itefr.png";

export const ContentByTheme = {
    pacfr: {
        bannerText: "Jusqu'à 11 500 € d'aides pour vos travaux de rénovation",
        brandLogo: { name: "PACFR", file: pacfrLogo, className: "h-12" },
        partnerLogos: [
            { name: "RGE", file: rgeLogo, visibleAbove: "tablet" },
            { name: "Gouvernement", file: gouvernementLogo, visibleAbove: "desktop" }
        ]
    },
    itefr: {
        bannerText: "Isolation thermique extérieure - Expertise France",
        brandLogo: { name: "ITEFR", file: itefrLogo, className: "h-12" },
        partnerLogos: [
            { name: "RGE", file: rgeLogo, visibleAbove: "mobile" }
        ]
    }
} as const;
```

**Pourquoi séparer le contenu ?**
- ✅ **Évite la duplication** : Même contenu utilisé dans plusieurs variants
- ✅ **Facilite les traductions** : Ajouter `ContentByTheme.en` pour l'anglais
- ✅ **Simplifie les mises à jour** : Changer un texte en un seul endroit

### 3.2 Factory (Transformation Intelligente)

```typescript
// src/sections/Header/factory.ts

/* --------------------- TYPES ---------- */
type HeaderV1Props = {
    bannerText: string;
    brandLogo: Logo;
    partnerLogos: Array<Logo & { visibilityClass: string }>; // Props enrichies !
};

/* --------------------- UTILITIES ---------- */
const visibility = {
    mobile: "flex",
    tablet: "hidden sm:flex",
    desktop: "hidden lg:flex",
} as const;

export const getVisibilityClass = (v: Visible) => {
    if (!v) return visibility.mobile;
    return visibility[v];
};

/* --------------------- PROPS FACTORY ---------- */
export const buildV1Props = (theme: Theme): HeaderV1Props => {
    // 1. Récupérer les données brutes
    const rawContent = ContentByTheme[theme];
    
    // 2. Transformer/enrichir les données
    const processPartnerLogos = (logos: Logo[]) => {
        return logos.map((logo) => ({
            ...logo,
            // ✨ MAGIE : Ajouter la classe CSS calculée
            visibilityClass: getVisibilityClass(logo.visibleAbove ?? "desktop"),
        }));
    };

    // 3. Retourner les props finales
    return {
        bannerText: rawContent.bannerText,
        brandLogo: rawContent.brandLogo,
        partnerLogos: processPartnerLogos(rawContent.partnerLogos), // Enrichies !
    };
};

/* --------------------- REGISTRY DES VARIANTS ---------- */
export const VariantsRegistry = {
    v1: { 
        component: V1,                    // Composant Astro
        propsFactory: buildV1Props        // Fonction de transformation
    },
    // v2: { component: V2, propsFactory: buildV2Props }, // Futur variant
} as const;

/* --------------------- RESOLVER ---------- */
export const resolveVariant = (variant: string = "v1") => {
    return VariantsRegistry[variant] ?? VariantsRegistry.v1;
};
```

**Rôle de la Factory** :
1. **Récupère** les données brutes par thème
2. **Transforme** et **enrichit** ces données (calculs, formatage)
3. **Produit** des props prêtes à l'emploi pour le composant UI

### 3.3 Resolver (Aiguilleur Intelligent)

```astro
---
// src/sections/Header/Resolver.astro
import { resolveVariant } from "./factory";
import { ContentByTheme } from "@content/header/header-content.v1";

// 1. Récupérer les paramètres d'entrée
const { theme = "pacfr", variant = "v1" } = Astro.props as {
    theme?: "pacfr" | "itefr" | "pv";
    variant?: string;
};

// 2. Résoudre le contenu par thème
const content = ContentByTheme[theme];

// 3. Résoudre le variant (composant + factory)
const { component: Component, propsFactory } = resolveVariant(variant);

// 4. Transformer les données en props
const props = propsFactory(content);
---

<!-- 5. Rendre le bon composant avec les bonnes props -->
<Component {...props} />
```

**Pourquoi un Resolver ?**
- ✅ **Point d'entrée unique** : Même interface pour tous les variants
- ✅ **Logique centralisée** : Résolution thème + variant en un endroit
- ✅ **Facilite les tests A/B** : Changer juste le paramètre `variant`

### 3.4 Composant UI (Présentation Pure)

```astro
---
// src/sections/Header/Header.v1.astro
import { Image } from "astro:assets";

// Props typées reçues de la Factory
const { brandLogo, partnerLogos, bannerText } = Astro.props as {
    brandLogo: Logo;
    partnerLogos: Array<Logo & { visibilityClass: string }>;
    bannerText: string;
};
---

<header class="bg-white shadow-sm">
    <!-- Banner avec texte dynamique -->
    <div class="bg-blue-600 text-white px-4 py-2">
        {bannerText}
    </div>
    
    <div class="container mx-auto flex items-center justify-between py-4">
        <!-- Logo de marque -->
        <Image 
            src={brandLogo.file} 
            alt={brandLogo.name} 
            class={brandLogo.className} 
        />
        
        <!-- Logos partenaires avec visibilité responsive -->
        <div class="flex gap-4">
            {partnerLogos.map((logo) => (
                <div class={`${logo.visibilityClass} items-center`}>
                    <Image 
                        src={logo.file} 
                        alt={logo.name} 
                        class="h-8"
                    />
                </div>
            ))}
        </div>
    </div>
</header>
```

**Principe du Composant UI** :
- ✅ **Aucune logique métier** : Juste de la présentation
- ✅ **Props prêtes à l'emploi** : La Factory a fait tout le travail
- ✅ **Facilement testable** : Props en entrée → HTML en sortie

---

## 4. Registry Pattern - Explication Détaillée

### Qu'est-ce qu'un Registry ?

Un **Registry** est comme un **annuaire téléphonique pour code** :

```typescript
// Annuaire téléphonique classique
const annuaire = {
    "Jean Dupont": "01 23 45 67 89",
    "Marie Martin": "01 98 76 54 32"
};

// Registry de composants
const sectionsRegistry = {
    "Header": HeaderResolver,
    "GovSubsidy": GovSubsidyResolver
};
```

### Pourquoi Utiliser un Registry ?

#### ❌ Sans Registry (couplage fort)
```astro
---
// Dans chaque page, import direct de tous les composants
import Header from "../sections/Header/Header.v1.astro";
import GovSubsidy from "../sections/GovSubsidy/GovSubsidy.v1.astro";
import HeroSection from "../sections/HeroSection.astro";

// Si je veux changer Header.v1 → Header.v2, je dois modifier TOUTES les pages
---

<Header theme="pacfr" />
<GovSubsidy theme="pacfr" />
<HeroSection />
```

#### ✅ Avec Registry (couplage faible)
```typescript
// src/sections/index.ts - Registry centralisé
export const sectionsRegistry = {
    Header: HeaderResolver,          // Resolver gère les variants automatiquement
    GovSubsidy: GovSubsidyResolver,
    HeroSection,                     // Section simple (sans variants)
} as const;
```

```typescript
// src/landings/pacfr/pacfr-v1.ts - Configuration déclarative
export const pacfrV1Config = {
    sections: [
        { name: "Header", theme: "pacfr", variant: "v1" },     // Registry lookup
        { name: "GovSubsidy", theme: "pacfr", variant: "v1" },
        { name: "HeroSection" },                               // Section simple
    ]
};
```

### Avantages du Registry Pattern

#### 1. **Découplage Total**
```typescript
// Pages ne connaissent pas les composants spécifiques
const Component = sectionsRegistry[sectionName]; // Résolution dynamique
```

#### 2. **Extensibilité Facile**
```typescript
// Ajouter une nouvelle section = 1 ligne
export const sectionsRegistry = {
    Header: HeaderResolver,
    GovSubsidy: GovSubsidyResolver,
    Testimonials: TestimonialsResolver,  // ← Nouvelle section
    // ... autres sections
} as const;
```

#### 3. **Configuration Déclarative**
```typescript
// Créer une landing page = liste de configuration
const landingConfig = [
    { name: "Header", theme: "pacfr" },
    { name: "Testimonials", theme: "pacfr", variant: "v2" },
    { name: "ContactForm" }
];
```

#### 4. **Tests A/B Simplifiés**
```typescript
// Version A
{ name: "Header", variant: "v1" }

// Version B  
{ name: "Header", variant: "v2" }
```

---

## 5. Props Factory Pattern - Explication Détaillée

### Qu'est-ce qu'une Props Factory ?

Une **Props Factory** est comme une **usine personnalisée** qui transforme des matières premières en produits finis :

```typescript
// Matière première (données brutes)
const rawData = {
    title: "PACFR",
    videoId: "abc123"
};

// Usine de transformation
const factory = (data) => ({
    title: data.title,
    videoSrc: `https://youtube.com/embed/${data.videoId}`, // ← Transformation !
    createdAt: new Date().toISOString()                    // ← Enrichissement !
});

// Produit fini (props prêtes)
const props = factory(rawData);
// → { title: "PACFR", videoSrc: "https://youtube.com/embed/abc123", createdAt: "2024..." }
```

### Pourquoi Utiliser des Props Factories ?

#### ❌ Sans Factory (logique dans le composant)
```astro
---
// Header.v1.astro - MAUVAIS : logique métier dans le composant UI
import { ContentByTheme } from "@content/header/content.v1";

const { theme } = Astro.props;
const content = ContentByTheme[theme];

// 🔥 Logique métier polluant le composant
const processedLogos = content.partnerLogos.map(logo => ({
    ...logo,
    visibilityClass: logo.visibleAbove === "desktop" ? "hidden lg:flex" : "flex"
}));

const videoSrc = content.videoId ? `https://youtube.com/embed/${content.videoId}` : null;
---

<header>
    <!-- Template UI -->
</header>
```

**Problèmes** :
- 🔥 Logique métier mélangée avec présentation
- 🔥 Impossible à tester unitairement
- 🔥 Code dupliqué dans chaque variant
- 🔥 Composant difficile à lire

#### ✅ Avec Factory (séparation claire)
```typescript
// factory.ts - Logique métier centralisée
export const buildHeaderV1Props = (content: HeaderContent): HeaderV1Props => {
    // Toute la logique de transformation ici
    const processedLogos = content.partnerLogos.map(logo => ({
        ...logo,
        visibilityClass: getVisibilityClass(logo.visibleAbove ?? "desktop")
    }));
    
    const videoSrc = content.videoId 
        ? `https://youtube.com/embed/${content.videoId}` 
        : undefined;
    
    return {
        logos: processedLogos,
        videoSrc,
        // ... autres props transformées
    };
};
```

```astro
---
// Header.v1.astro - Composant UI pur
const { logos, videoSrc } = Astro.props; // Props déjà transformées !
---

<header>
    {logos.map(logo => (
        <img class={logo.visibilityClass} src={logo.file} alt={logo.name} />
    ))}
    {videoSrc && <iframe src={videoSrc}></iframe>}
</header>
```

**Avantages** :
- ✅ **Séparation claire** : Logique ≠ Présentation
- ✅ **Testabilité** : Factory facilement testable
- ✅ **Réutilisabilité** : Même Factory pour tous les variants
- ✅ **Lisibilité** : Composant UI simple et clair

### Types de Transformations dans les Factories

#### 1. **Formatage de Données**
```typescript
// Input : "abc123"
// Output : "https://youtube.com/embed/abc123"
videoSrc: content.videoId ? `https://youtube.com/embed/${content.videoId}` : undefined
```

#### 2. **Calculs Conditionnels**
```typescript
// Input : "desktop"
// Output : "hidden lg:flex"
visibilityClass: getVisibilityClass(logo.visibleAbove ?? "desktop")
```

#### 3. **Enrichissement de Données**
```typescript
// Input : [logo1, logo2]
// Output : [logo1 + visibilityClass, logo2 + visibilityClass]
partnerLogos: content.partnerLogos.map(logo => ({
    ...logo,
    visibilityClass: calculateVisibility(logo.visibleAbove)
}))
```

#### 4. **Restructuration**
```typescript
// Input : { title: "...", highlight: "..." }
// Output : { heading: { title: "...", highlight: "..." } }
heading: {
    title: content.title,
    highlight: content.highlight
}
```

---

## 6. Flux de Données Complet - Étape par Étape

Suivons exactement ce qui se passe quand un utilisateur visite `/pacfr/` :

### Étape 1 : Configuration de la Landing Page
```typescript
// src/landings/pacfr/pacfr-v1.ts
export const pacfrV1LandingConfig = {
    meta: {
        title: "PACFR - Aides Rénovation Énergétique",
        description: "Jusqu'à 11 500€ d'aides..."
    },
    sections: [
        { name: "Header", theme: "pacfr", variant: "v1" },     // ← Notre exemple
        { name: "HeroSection" },
        { name: "GovSubsidy", theme: "pacfr", variant: "v1" },
    ]
};
```

### Étape 2 : Génération de la Page Astro
```astro
---
// src/pages/pacfr/index.astro
import { sectionsRegistry } from "@sections/index";
import { pacfrV1LandingConfig } from "@landings/pacfr/pacfr-v1";

const { sections } = pacfrV1LandingConfig;
---

<html>
<head>
    <title>{pacfrV1LandingConfig.meta.title}</title>
</head>
<body>
    {sections.map(section => {
        const Component = sectionsRegistry[section.name]; // ← Registry lookup
        return <Component {...section} />;                // ← Props passées
    })}
</body>
</html>
```

### Étape 3 : Résolution de Section (Registry)
```typescript
// src/sections/index.ts
export const sectionsRegistry = {
    Header: HeaderResolver,  // ← "Header" résolu vers HeaderResolver
    // ...
} as const;

// Résultat : Component = HeaderResolver
```

### Étape 4 : Exécution du Resolver
```astro
---
// src/sections/Header/Resolver.astro - Reçoit { name: "Header", theme: "pacfr", variant: "v1" }
import { resolveVariant } from "./factory";
import { ContentByTheme } from "@content/header/header-content.v1";

const { theme = "pacfr", variant = "v1" } = Astro.props;
//       theme = "pacfr", variant = "v1" ← Valeurs extraites

const content = ContentByTheme[theme];                        // ← Étape 5
const { component: Component, propsFactory } = resolveVariant(variant); // ← Étape 6
const props = propsFactory(content);                          // ← Étape 7
---

<Component {...props} />  <!-- Étape 8 -->
```

### Étape 5 : Résolution du Contenu par Thème
```typescript
// ContentByTheme["pacfr"] résolu vers :
{
    bannerText: "Jusqu'à 11 500 € d'aides pour vos travaux de rénovation",
    brandLogo: { name: "PACFR", file: pacfrLogo, className: "h-12" },
    partnerLogos: [
        { name: "RGE", file: rgeLogo, visibleAbove: "tablet" },
        { name: "Gouvernement", file: gouvernementLogo, visibleAbove: "desktop" }
    ]
}
```

### Étape 6 : Résolution du Variant (Registry interne)
```typescript
// src/sections/Header/factory.ts
export const resolveVariant = (variant: string = "v1") => {
    return VariantsRegistry[variant] ?? VariantsRegistry.v1;
};

// VariantsRegistry["v1"] résolu vers :
{
    component: Header.v1.astro,
    propsFactory: buildV1Props
}
```

### Étape 7 : Transformation par la Props Factory
```typescript
// buildV1Props(content) exécute :
export const buildV1Props = (content) => {
    const processPartnerLogos = (logos) => {
        return logos.map((logo) => ({
            ...logo,
            // Calcul de visibilityClass pour chaque logo
            visibilityClass: getVisibilityClass(logo.visibleAbove ?? "desktop"),
        }));
    };

    return {
        bannerText: content.bannerText,                     // "Jusqu'à 11 500 €..."
        brandLogo: content.brandLogo,                       // { name: "PACFR", ... }
        partnerLogos: processPartnerLogos(content.partnerLogos), // Enrichis avec visibilityClass
    };
};

// Résultat props final :
{
    bannerText: "Jusqu'à 11 500 € d'aides pour vos travaux de rénovation",
    brandLogo: { name: "PACFR", file: pacfrLogo, className: "h-12" },
    partnerLogos: [
        { 
            name: "RGE", 
            file: rgeLogo, 
            visibleAbove: "tablet",
            visibilityClass: "hidden sm:flex"    // ← Calculé par la Factory !
        },
        { 
            name: "Gouvernement", 
            file: gouvernementLogo, 
            visibleAbove: "desktop",
            visibilityClass: "hidden lg:flex"    // ← Calculé par la Factory !
        }
    ]
}
```

### Étape 8 : Rendu Final du Composant UI
```astro
---
// Header.v1.astro - Reçoit les props transformées
const { brandLogo, partnerLogos, bannerText } = Astro.props;
---

<header class="bg-white shadow-sm">
    <div class="bg-blue-600 text-white px-4 py-2">
        Jusqu'à 11 500 € d'aides pour vos travaux de rénovation  <!-- bannerText -->
    </div>
    
    <div class="container mx-auto flex items-center justify-between py-4">
        <img src={pacfrLogo} alt="PACFR" class="h-12" />  <!-- brandLogo -->
        
        <div class="flex gap-4">
            <div class="hidden sm:flex items-center">      <!-- visibilityClass calculée -->
                <img src={rgeLogo} alt="RGE" class="h-8" />
            </div>
            <div class="hidden lg:flex items-center">      <!-- visibilityClass calculée -->
                <img src={gouvernementLogo} alt="Gouvernement" class="h-8" />
            </div>
        </div>
    </div>
</header>
```

### Résumé du Flux Complet

```
Landing Config → Registry Lookup → Resolver → Content Lookup → Variant Lookup → Props Factory → UI Component → HTML Final
     ↓               ↓               ↓            ↓              ↓               ↓             ↓           ↓
{ name: "Header" } → HeaderResolver → theme → ContentByTheme → VariantsRegistry → buildV1Props → Header.v1 → <header>...
  theme: "pacfr"                     ↓            ↓              ↓               ↓             ↓
  variant: "v1"                   "pacfr"    { bannerText... }  { component, }  { bannerText, }
                                                                   propsFactory     partnerLogos
                                                                                   enrichis... }
```

---

## 7. Gestion Multi-Thème - Logique Détaillée

### Principe Central : Un Code, Plusieurs Thèmes

Notre système permet d'avoir **un seul code source** qui génère **plusieurs variantes de landing pages** selon le thème.

### 7.1 Structure des Données par Thème

```typescript
// src/content/header/header-content.v1.ts
export const ContentByTheme = {
    // 🎯 Thème PACFR (Aides rénovation)
    pacfr: {
        bannerText: "Jusqu'à 11 500 € d'aides pour vos travaux de rénovation",
        brandLogo: { 
            name: "PACFR", 
            file: pacfrLogo, 
            className: "h-12" 
        },
        partnerLogos: [
            { name: "RGE", file: rgeLogo, visibleAbove: "tablet" },
            { name: "État", file: etatLogo, visibleAbove: "desktop" },
            { name: "CEE", file: ceeLogo, visibleAbove: "desktop" }
        ]
    },
    
    // 🏠 Thème ITEFR (Isolation thermique)
    itefr: {
        bannerText: "Isolation thermique extérieure - Expertise certifiée",
        brandLogo: { 
            name: "ITE FRANCE", 
            file: itefrLogo, 
            className: "h-14" 
        },
        partnerLogos: [
            { name: "RGE", file: rgeLogo, visibleAbove: "mobile" },
            { name: "Qualibat", file: qualibatLogo, visibleAbove: "tablet" }
        ]
    },
    
    // ☀️ Thème PV (Panneaux solaires)
    pv: {
        bannerText: "Installation panneaux solaires - Production d'énergie verte",
        brandLogo: { 
            name: "SOLAR FRANCE", 
            file: pvLogo, 
            className: "h-10" 
        },
        partnerLogos: [
            { name: "QualiPV", file: qualipvLogo, visibleAbove: "mobile" }
        ]
    }
} as const;
```

### 7.2 Résolution Automatique par Thème

```typescript
// Dans le Resolver, résolution automatique :
const content = ContentByTheme[theme];

// Si theme = "pacfr" → content = { bannerText: "Jusqu'à 11 500 €...", ... }
// Si theme = "itefr" → content = { bannerText: "Isolation thermique...", ... }
// Si theme = "pv"    → content = { bannerText: "Installation panneaux...", ... }
```

### 7.3 Même Factory, Résultats Différents

```typescript
export const buildV1Props = (theme: Theme): HeaderV1Props => {
    const content = ContentByTheme[theme]; // ← Résolution par thème
    
    return {
        bannerText: content.bannerText,    // ← Différent selon le thème
        brandLogo: content.brandLogo,      // ← Différent selon le thème
        partnerLogos: processPartnerLogos(content.partnerLogos), // ← Différent selon le thème
    };
};

// Même code, résultats différents :
buildV1Props("pacfr") // → Props PACFR
buildV1Props("itefr") // → Props ITEFR  
buildV1Props("pv")    // → Props PV
```

### 7.4 Configuration des Landing Pages par Thème

```typescript
// src/landings/pacfr/pacfr-v1.ts
export const pacfrV1Config = {
    sections: [
        { name: "Header", theme: "pacfr", variant: "v1" },
        { name: "HeroSection" }, // Section simple, pas de thème
        { name: "GovSubsidy", theme: "pacfr", variant: "v1" },
    ]
};

// src/landings/itefr/itefr-v1.ts  
export const itefrV1Config = {
    sections: [
        { name: "Header", theme: "itefr", variant: "v1" },      // ← Même section, thème différent
        { name: "HeroSection" },
        { name: "TechnicalSpecs", theme: "itefr", variant: "v1" }, // ← Section spécifique ITE
    ]
};
```

### 7.5 Génération Automatique des Pages

```astro
---
// src/pages/pacfr/index.astro - Page PACFR
import { sectionsRegistry } from "@sections/index";
import { pacfrV1Config } from "@landings/pacfr/pacfr-v1";
---

<html>
<body>
    {pacfrV1Config.sections.map(section => {
        const Component = sectionsRegistry[section.name];
        return <Component theme="pacfr" variant={section.variant} />; // ← theme fixé
    })}
</body>
</html>
```

```astro
---
// src/pages/itefr/index.astro - Page ITEFR
import { sectionsRegistry } from "@sections/index";
import { itefrV1Config } from "@landings/itefr/itefr-v1";
---

<html>
<body>
    {itefrV1Config.sections.map(section => {
        const Component = sectionsRegistry[section.name];
        return <Component theme="itefr" variant={section.variant} />; // ← theme différent
    })}
</body>
</html>
```

### 7.6 Ajout d'un Nouveau Thème - Étape par Étape

Supposons qu'on veuille ajouter un thème **"climatisation"** :

#### Étape 1 : Ajouter le contenu
```typescript
// src/content/header/header-content.v1.ts
export const ContentByTheme = {
    pacfr: { /* ... */ },
    itefr: { /* ... */ },
    pv: { /* ... */ },
    // ✅ Nouveau thème ajouté
    climatisation: {
        bannerText: "Installation climatisation - Confort toute l'année",
        brandLogo: { name: "CLIM FRANCE", file: climLogo, className: "h-12" },
        partnerLogos: [
            { name: "Daikin", file: daikinLogo, visibleAbove: "tablet" }
        ]
    }
} as const;
```

#### Étape 2 : Mettre à jour les types
```typescript
// src/content/header/types.ts
export type Theme = "pacfr" | "itefr" | "pv" | "climatisation"; // ← Ajout du nouveau thème
```

#### Étape 3 : Créer la configuration de landing
```typescript
// src/landings/climatisation/climatisation-v1.ts
export const climatisationV1Config = {
    sections: [
        { name: "Header", theme: "climatisation", variant: "v1" },
        { name: "HeroSection" },
        { name: "TechnicalSpecs", theme: "climatisation", variant: "v1" },
    ]
};
```

#### Étape 4 : Créer la page
```astro
---
// src/pages/climatisation/index.astro
import { sectionsRegistry } from "@sections/index";
import { climatisationV1Config } from "@landings/climatisation/climatisation-v1";
---

<html>
<body>
    {climatisationV1Config.sections.map(section => {
        const Component = sectionsRegistry[section.name];
        return <Component theme="climatisation" variant={section.variant} />;
    })}
</body>
</html>
```

**C'est tout !** Aucun changement dans les composants UI ou les factories. Le système résout automatiquement le nouveau thème.

---

## 8. Pourquoi Cette Architecture ?

### 8.1 Comparaison avec les Alternatives

#### Alternative 1 : Pages Monolithiques ❌

```astro
<!-- pacfr-landing.astro - Approche monolithique -->
---
// Tout le code dupliqué dans chaque page
const pacfrBannerText = "Jusqu'à 11 500 € d'aides...";
const pacfrLogo = pacfrLogoFile;
// ... 200 lignes de configuration
---

<html>
<body>
    <!-- Header PACFR en dur -->
    <header>
        <div class="banner">{pacfrBannerText}</div>
        <img src={pacfrLogo} alt="PACFR" />
        <!-- ... HTML dupliqué -->
    </header>
    
    <!-- Section Aides PACFR en dur -->
    <section>
        <!-- ... 100 lignes HTML dupliquées -->
    </section>
</body>
</html>
```

**Problèmes** :
- 🔥 **Code dupliqué** : Même HTML copié dans chaque page
- 🔥 **Maintenance impossible** : Changer le Header = modifier 10 fichiers
- 🔥 **Bugs multiplicateurs** : Une erreur se propage partout
- 🔥 **Tests A/B compliqués** : Dupliquer des pages entières

#### Alternative 2 : Composants Simples ⚠️

```astro
<!-- Header.astro - Composant simple -->
---
const { theme, variant } = Astro.props;

// 🔥 Logique conditionnelle partout
let bannerText;
if (theme === "pacfr") {
    bannerText = "Jusqu'à 11 500 € d'aides...";
} else if (theme === "itefr") {
    bannerText = "Isolation thermique...";
} else if (theme === "pv") {
    bannerText = "Installation panneaux...";
}

// 🔥 Plus de thèmes = plus de conditions
let logoFile;
if (theme === "pacfr") {
    logoFile = pacfrLogo;
} else if (theme === "itefr") {
    logoFile = itefrLogo;
// ... 20 conditions
}

// 🔥 Variants gérés avec des conditions
let headerClass;
if (variant === "v1") {
    headerClass = "bg-white";
} else if (variant === "v2") {
    headerClass = "bg-blue-100";
}
---

<header class={headerClass}>
    <div>{bannerText}</div>
    <img src={logoFile} alt="Logo" />
</header>
```

**Problèmes** :
- 🔥 **Complexité croissante** : Chaque nouveau thème/variant = plus de conditions
- 🔥 **Code illisible** : Logique métier mélangée avec présentation
- 🔥 **Difficile à tester** : Composant avec trop de responsabilités
- 🔥 **Performance** : Toutes les conditions évaluées à chaque rendu

#### Notre Solution : Registry + Props Factory ✅

```typescript
// Données séparées et organisées
const ContentByTheme = {
    pacfr: { bannerText: "...", logo: "..." },
    itefr: { bannerText: "...", logo: "..." }
};

// Factory pure et testable
const buildHeaderV1Props = (theme) => ({
    bannerText: ContentByTheme[theme].bannerText,
    logo: ContentByTheme[theme].logo
});

// Registry extensible
const VariantsRegistry = {
    v1: { component: HeaderV1, propsFactory: buildHeaderV1Props }
};
```

```astro
<!-- Composant UI pur -->
---
const { bannerText, logo } = Astro.props;
---

<header>
    <div>{bannerText}</div>
    <img src={logo} alt="Logo" />
</header>
```

**Avantages** :
- ✅ **Séparation claire** : Données ≠ Logique ≠ Présentation
- ✅ **Extensibilité** : Nouveau thème = ajouter des données
- ✅ **Testabilité** : Chaque partie testable indépendamment
- ✅ **Performance** : Résolution une seule fois par rendu

### 8.2 Bénéfices Métier

#### Pour les Développeurs 👨‍💻
- ✅ **Code prévisible** : Même structure partout
- ✅ **Onboarding rapide** : Pattern unique à apprendre
- ✅ **Debugging facile** : Erreurs localisées
- ✅ **Refactoring sûr** : Types TypeScript protègent

#### Pour les Product Owners 📊
- ✅ **Time-to-market** : Nouveau thème en 1 jour vs 1 semaine
- ✅ **Tests A/B simples** : Changer un paramètre vs dupliquer des pages
- ✅ **Évolutivité** : Ajout de fonctionnalités sans régression
- ✅ **Maintenance réduite** : Bugs fixés une fois pour tous

#### Pour les Designers 🎨
- ✅ **Cohérence forcée** : Impossible d'avoir des variants incohérents
- ✅ **Expérimentation facilitée** : Nouveau design = nouveau variant
- ✅ **Réutilisabilité** : Design système naturellement créé

---

## 9. Comparaison avec d'Autres Approches

### 9.1 React/Vue Component Libraries

#### Similitudes ✅
```jsx
// React/Vue - Props drilling
<Header 
    theme="primary" 
    variant="large" 
    showLogo={true} 
/>

// Notre approche - Props factory
<HeaderResolver 
    theme="pacfr" 
    variant="v1" 
/>
```

#### Différences clés
| Aspect | React/Vue Libraries | Notre Approche |
|---------|-------------------|---------------|
| **Résolution** | Compile-time | Build-time + Runtime |
| **Configuration** | Props drilling | Registry lookup |
| **Extensibilité** | Code changes | Data changes |
| **Type Safety** | Props interface | Factory return types |

### 9.2 CMS Headless (Strapi, Contentful)

#### Similitudes ✅
- Séparation contenu/présentation
- Multi-thème supporté
- Configuration déclarative

#### Différences clés
| Aspect | CMS Headless | Notre Approche |
|---------|-------------|---------------|
| **Données** | Base de données | Fichiers TypeScript |
| **Performance** | API calls | Build-time resolved |
| **Versioning** | CMS interface | Git version control |
| **Developer Experience** | External tool | Native code |
| **Type Safety** | Runtime validation | Compile-time checking |

### 9.3 Static Site Generators (Gatsby, Next.js)

#### Similitudes ✅
- Build-time generation
- Component-based
- TypeScript support

#### Différences clés
| Aspect | Gatsby/Next.js | Notre Approche |
|---------|---------------|---------------|
| **Philosophy** | Page-centric | Section-centric |
| **Reusability** | Component level | Section + Variant level |
| **Configuration** | GraphQL/API | Type-safe objects |
| **Flexibility** | High learning curve | Standardized patterns |

---

## 10. Guide Pratique pour Développeurs

### 10.1 Créer une Nouvelle Section - Étape par Étape

#### Étape 1 : Créer la Structure
```bash
mkdir src/sections/Testimonials
touch src/sections/Testimonials/Resolver.astro
touch src/sections/Testimonials/Testimonials.v1.astro
touch src/sections/Testimonials/factory.ts
touch src/sections/Testimonials/index.ts
```

#### Étape 2 : Définir le Contenu
```typescript
// src/content/testimonials/content.v1.ts
export const ContentByTheme = {
    pacfr: {
        title: "Témoignages Clients PACFR",
        testimonials: [
            {
                name: "Marie Dupont",
                location: "Paris",
                content: "Excellent service pour mes travaux de rénovation",
                rating: 5
            }
        ]
    },
    itefr: {
        title: "Retours d'expérience ITE",
        testimonials: [
            {
                name: "Jean Martin",
                location: "Lyon", 
                content: "Isolation parfaite, équipe professionnelle",
                rating: 5
            }
        ]
    }
} as const;
```

#### Étape 3 : Créer la Factory
```typescript
// src/sections/Testimonials/factory.ts
import { ContentByTheme } from "@content/testimonials/content.v1";
import type { Theme } from "@content/header/types";
import V1 from "./Testimonials.v1.astro";

type TestimonialsV1Props = {
    title: string;
    testimonials: Array<{
        name: string;
        location: string;
        content: string;
        rating: number;
        starsDisplay: string; // ← Props enrichies
    }>;
};

export const buildV1Props = (theme: Theme): TestimonialsV1Props => {
    const content = ContentByTheme[theme];
    
    return {
        title: content.title,
        testimonials: content.testimonials.map(testimonial => ({
            ...testimonial,
            // ✨ Enrichissement : générer l'affichage des étoiles
            starsDisplay: "★".repeat(testimonial.rating) + "☆".repeat(5 - testimonial.rating)
        }))
    };
};

export const VariantsRegistry = {
    v1: { component: V1, propsFactory: buildV1Props }
} as const;

export const resolveVariant = (variant: string = "v1") => {
    return VariantsRegistry[variant] ?? VariantsRegistry.v1;
};
```

#### Étape 4 : Créer le Composant UI
```astro
---
// src/sections/Testimonials/Testimonials.v1.astro
const { title, testimonials } = Astro.props as {
    title: string;
    testimonials: Array<{
        name: string;
        location: string; 
        content: string;
        starsDisplay: string;
    }>;
};
---

<section class="py-16 bg-gray-50">
    <div class="container mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">{title}</h2>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <div class="text-yellow-500 text-xl mb-4">
                        {testimonial.starsDisplay}
                    </div>
                    <p class="text-gray-700 mb-4">"{testimonial.content}"</p>
                    <div class="font-semibold">
                        {testimonial.name}
                        <span class="text-gray-500 font-normal"> - {testimonial.location}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
</section>
```

#### Étape 5 : Créer le Resolver
```astro
---
// src/sections/Testimonials/Resolver.astro
import { resolveVariant } from "./factory";
import { ContentByTheme } from "@content/testimonials/content.v1";

const { theme = "pacfr", variant = "v1" } = Astro.props as {
    theme?: "pacfr" | "itefr" | "pv";
    variant?: string;
};

const content = ContentByTheme[theme];
const { component: Component, propsFactory } = resolveVariant(variant);
const props = propsFactory(theme);
---

<Component {...props} />
```

#### Étape 6 : Enregistrer dans le Registry Global
```typescript
// src/sections/index.ts
import TestimonialsResolver from "./Testimonials/Resolver.astro";

export const sectionsRegistry = {
    Header: HeaderResolver,
    GovSubsidy: GovSubsidyResolver,
    Testimonials: TestimonialsResolver, // ← Nouvelle section ajoutée
    HeroSection,
    ReviewsCarousel,
} as const;
```

#### Étape 7 : Utiliser dans une Landing Page
```typescript
// src/landings/pacfr/pacfr-v1.ts
export const pacfrV1Config = {
    sections: [
        { name: "Header", theme: "pacfr", variant: "v1" },
        { name: "HeroSection" },
        { name: "Testimonials", theme: "pacfr", variant: "v1" }, // ← Utilisation
        { name: "GovSubsidy", theme: "pacfr", variant: "v1" },
    ]
};
```

### 10.2 Créer un Nouveau Variant - Étape par Étape

#### Étape 1 : Créer le Composant V2
```astro
---
// src/sections/Header/Header.v2.astro - Design différent du v1
const { brandLogo, partnerLogos, bannerText } = Astro.props;
---

<!-- Design V2 : Header vertical sur mobile -->
<header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <div class="container mx-auto px-4 py-6">
        <!-- V2 : Layout vertical sur mobile -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-center md:text-left">
                <img src={brandLogo.file} alt={brandLogo.name} class={brandLogo.className} />
                <p class="mt-2 text-sm opacity-90">{bannerText}</p>
            </div>
            
            <!-- V2 : Logos toujours visibles -->
            <div class="flex flex-wrap gap-2 justify-center">
                {partnerLogos.map(logo => (
                    <img src={logo.file} alt={logo.name} class="h-6 opacity-80" />
                ))}
            </div>
        </div>
    </div>
</header>
```

#### Étape 2 : Créer la Factory V2 (optionnel)
```typescript
// src/sections/Header/factory.ts
export const buildV2Props = (theme: Theme): HeaderV2Props => {
    const content = ContentByTheme[theme];
    
    return {
        brandLogo: content.brandLogo,
        bannerText: content.bannerText,
        // V2 : Tous les logos toujours visibles (pas de calcul visibilityClass)
        partnerLogos: content.partnerLogos
    };
};
```

#### Étape 3 : Enregistrer dans le Registry
```typescript
// src/sections/Header/factory.ts
import V2 from "./Header.v2.astro";

export const VariantsRegistry = {
    v1: { component: V1, propsFactory: buildV1Props },
    v2: { component: V2, propsFactory: buildV2Props }, // ← Nouveau variant
} as const;
```

#### Étape 4 : Test A/B Facile
```typescript
// Landing V1 (contrôle)
{ name: "Header", theme: "pacfr", variant: "v1" }

// Landing V2 (test)
{ name: "Header", theme: "pacfr", variant: "v2" }
```

### 10.3 Debugging et Troubleshooting

#### Problème : "Cannot find module" 
```bash
# Vérifier les alias TypeScript
cat tsconfig.json | grep -A 10 "paths"

# Redémarrer le serveur TypeScript dans VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

#### Problème : Props undefined dans le composant
```typescript
// Ajouter des logs dans la Factory
export const buildV1Props = (theme: Theme) => {
    console.log("🔍 Building props for theme:", theme);
    const content = ContentByTheme[theme];
    console.log("📊 Content resolved:", content);
    
    const props = {
        // ... props
    };
    console.log("✅ Final props:", props);
    return props;
};
```

#### Problème : Variant non trouvé
```typescript
// Ajouter une meilleure gestion d'erreur
export const resolveVariant = (variant: string = "v1") => {
    const resolved = VariantsRegistry[variant as keyof typeof VariantsRegistry];
    
    if (!resolved) {
        console.warn(`⚠️ Variant "${variant}" not found, falling back to v1`);
        console.log("Available variants:", Object.keys(VariantsRegistry));
    }
    
    return resolved ?? VariantsRegistry.v1;
};
```

### 10.4 Commandes de Développement Utiles

```bash
# Développement avec auto-reload
npm run dev

# Build et vérification de production
npm run build
npm run preview

# Formatage automatique
npm run format

# Vérification des types TypeScript
npx astro check

# Analyse des bundles
npm run build -- --verbose
```

### 10.5 Structure de Fichiers Recommandée

```
src/sections/[SectionName]/
├── Resolver.astro              # Point d'entrée (standardisé)
├── [SectionName].v1.astro      # Composant UI variant 1
├── [SectionName].v2.astro      # Composant UI variant 2 (optionnel)
├── factory.ts                  # Props factories + Registry
├── index.ts                    # Exports publics
└── README.md                   # Documentation de la section (optionnel)
```

### 10.6 Conventions de Nommage

```typescript
// Fichiers
[SectionName]/Resolver.astro        // PascalCase + Resolver
[SectionName]/[SectionName].v1.astro // PascalCase + .v[X]
[SectionName]/factory.ts            // lowercase

// Types
type [SectionName]V[X]Props         // PascalCase + V + numéro + Props
type Theme = "pacfr" | "itefr"      // lowercase strings

// Fonctions
const build[SectionName]V[X]Props   // build + PascalCase + V + numéro + Props
const resolve[SectionName]Variant   // resolve + PascalCase + Variant
const [sectionName]VariantsRegistry // camelCase + VariantsRegistry

// Constantes
const ContentByTheme                // PascalCase
const sectionsRegistry              // camelCase + Registry
```

---

## Conclusion

Cette architecture **Registry Pattern + Props Factory** nous permet de :

1. **Maintenir** facilement un système multi-thème complexe
2. **Étendre** rapidement avec de nouveaux thèmes et variants  
3. **Tester** différentes versions sans duplication de code
4. **Assurer** la cohérence et la qualité via TypeScript
5. **Onboarder** rapidement de nouveaux développeurs avec des patterns standardisés

Le investissement initial en complexité architecturale est rapidement rentabilisé par la vélocité de développement et la maintenabilité à long terme. 🚀

---

**Prochaines étapes recommandées** :
1. Implémenter les tests unitaires pour les Props Factories
2. Créer des scripts de génération automatique pour nouvelles sections
3. Ajouter la validation de schema pour les données de contenu
4. Mettre en place l'internationalisation (i18n) en étendant le système de thèmes