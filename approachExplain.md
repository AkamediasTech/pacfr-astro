# Architecture des Landing Pages - Les 4 Patterns Fondamentaux

## Vue d'ensemble

Ce projet utilise une architecture sophistiquée combinant 4 patterns de conception pour créer un système de landing pages modulaire, testable et multi-thème :

1. **Registry Pattern** → Modularité et découplage
2. **Adapter Pattern** → Transformation intelligente des données  
3. **Resolver Pattern** → Résolution dynamique des variants
4. **Séparation du contenu** → Gestion multi-thème centralisée

## 1. Registry Pattern → Modularité parfaite

### Concept
Le Registry Pattern centralise l'enregistrement de tous les composants dans un point unique, permettant la résolution dynamique par nom de section.

### Implémentation

```typescript
// src/sections/index.tsx
export const sectionsRegistry = {
  Header: HeaderResolver,        // Composant complexe avec variants
  HeroSection: HeroSection,      // Composant simple direct
  AidSection: AidSectionResolver,
  ReviewsCarousel: ReviewsCarousel,
  HeroBadges: HeroBadges,
};
```

### Utilisation dans les pages

```astro
<!-- src/pages/pacfr/index.astro -->
---
import { sectionsRegistry } from "../../sections";
import def from "../../landings/pacfr/pacfr-v1";
---

<LandingLayout title={def.title}>
  <LandingShell>
    {def.sections.map((s: SectionDef) => {
      const Component = sectionsRegistry[s.type]; // Résolution dynamique
      return <Component {...s.props} />;
    })}
  </LandingShell>
</LandingLayout>
```

### Avantages pour la modularité
- ✅ **Ajout facile** : Nouveau composant = 1 ligne dans le registry
- ✅ **Découplage total** : Les pages ne connaissent pas les imports directs
- ✅ **Configuration externe** : Les landing definitions pilotent entièrement le rendu
- ✅ **Testabilité** : Registry facilement mockable pour les tests

---

## 2. Adapter Pattern → Transformation intelligente des données

### Concept
L'Adapter traduit les données "business" brutes en props exactement typées et attendues par le composant UI final.

### Pipeline de transformation complète

```
Landing Config → Adapter → Component Props → UI Render
{ theme: "pacfr" } → toV1Props() → { bannerText: "...", brandLogo: {...}, partnerLogos: [...] } → <Header>
```

### Implémentation détaillée

```typescript
// src/sections/Header/adapters.ts

// 1. Input type (depuis la landing definition)
type HeaderInput = {
  theme: Theme;
  variant?: string;
};

// 2. Output type (props exactes attendues par Header.v1.astro)
type HeaderV1Props = {
  bannerText: string;
  brandLogo: Logo;
  partnerLogos: Logo[];
};

// 3. Transformation intelligente avec résolution de contenu
export const toV1Props = (theme: Theme): HeaderV1Props => {
  return {
    // Résolution automatique du contenu par thème
    bannerText: bannerTextByTheme[theme],
    brandLogo: headerBrandByTheme[theme], 
    partnerLogos: headerPartnersByTheme[theme],
  };
};
```

### Composant final simplifié

```astro
<!-- src/sections/Header/Header.v1.astro -->
---
// Props déjà transformées et typées - aucune logique business
const { brandLogo, partnerLogos, bannerText } = Astro.props as HeaderV1Props;
---

<header class="relative z-50 border-b border-slate-200">
  <!-- Présentation pure sans logique métier -->
  <div class="bg-[#004081] text-white">
    {bannerText}
  </div>
  <!-- ... reste du template ... -->
</header>
```

### Avantages pour la transformation
- ✅ **Validation** : Contrôle et validation des données avant rendu
- ✅ **Enrichissement** : Ajout de données calculées/dérivées
- ✅ **Type safety** : Props strictement typées à chaque étape
- ✅ **Logique centralisée** : Pas de duplication entre variants
- ✅ **Composants purs** : UI focalisée uniquement sur la présentation

---

## 3. Resolver Pattern → Résolution dynamique des variants

### Concept
Le Resolver orchestre la sélection du bon composant ET du bon adapter selon le variant demandé, permettant des tests A/B granulaires.

### Implémentation du Resolver

```astro
<!-- src/sections/Header/HeaderResolver.astro -->
---
import { resolveHeaderVariant } from "./adapters";
import type { Theme } from "../../config/header/types";

// 1. PARSING des props d'entrée depuis la landing config
const { theme = "pacfr", variant = "v1" } = Astro.props as {
  theme?: Theme;
  variant?: string;
};

// 2. RÉSOLUTION dynamique (composant + adapter)
const { component: Component, adapter: toProps } = resolveHeaderVariant(variant);

// 3. TRANSFORMATION des données via l'adapter approprié
const props = toProps(theme as Theme);
---

<!-- 4. RENDU du composant résolu avec props transformées -->
<Component {...props} />
```

### Logique de résolution multi-variants

```typescript
// src/sections/Header/adapters.ts
export const headerVariants = {
  v1: { component: HeaderV1, adapter: toV1Props },
  v2: { component: HeaderV2, adapter: toV2Props },
  v3: { component: HeaderV3, adapter: toV3Props },
} as const;

export const resolveHeaderVariant = (variant: string = "v1") => {
  return headerVariants[variant as keyof typeof headerVariants] ?? headerVariants.v1;
};
```

### Tests A/B en action

```typescript
// Landing A : Header design classique
const landingA = {
  sections: [
    { type: "Header", props: { theme: "pacfr", variant: "v1" }}
  ]
};

// Landing B : Header design moderne  
const landingB = {
  sections: [
    { type: "Header", props: { theme: "pacfr", variant: "v2" }}
  ]
};

// Landing C : Mix granulaire
const landingC = {
  sections: [
    { type: "Header", props: { theme: "pacfr", variant: "v1" }},
    { type: "HeroSection", props: { theme: "pacfr", variant: "v3" }},
    { type: "AidSection", props: { theme: "pacfr", variant: "v1" }}
  ]
};
```

### Avantages pour la résolution dynamique
- ✅ **Variants illimités** : Facile A/B testing (v1 vs v2 vs v3...)
- ✅ **Fallback intelligent** : Si variant inconnu → fallback automatique sur v1
- ✅ **Extensibilité** : Nouveau variant = simple ajout dans `headerVariants`
- ✅ **Cohérence** : Même pattern réutilisé pour toutes les sections complexes

---

## 4. Séparation du contenu → Multi-thème centralisé

### Concept
Le contenu est externalisé dans des fichiers de configuration séparés par domaine, permettant une gestion multi-marque cohérente et maintenable.

### Structure organisationnelle

```
src/config/
├── header/
│   ├── header-content.v1.ts    # Contenu spécifique header par thème
│   └── types.ts                # Types partagés (Theme, Logo...)
├── aid-content/
│   └── aid-content.v1.ts       # Contenu spécifique aid par thème
├── hero/
│   └── hero-content.v1.ts      # Contenu spécifique hero par thème
└── shared/
    └── logos.ts                # Assets partagés
```

### Implémentation multi-thème

```typescript
// src/config/header/header-content.v1.ts
export type Theme = "pacfr" | "itefr" | "pv";

export const bannerTextByTheme: Record<Theme, string> = {
  pacfr: "Jusqu'à 11 500 € d'aides pour votre pompe à chaleur",
  itefr: "Jusqu'à 15 000€ d'aides sur l'isolation thermique extérieure", 
  pv: "Jusqu'à 11 000€ d'aides sur vos panneaux photovoltaïques",
};

export const headerBrandByTheme: Record<Theme, Logo> = {
  pacfr: { name: "PACFR", file: pacfrLogo, className: "h-12" },
  itefr: { name: "ITEFR", file: itefrLogo, className: "h-10" },
  pv: { name: "PV", file: pvLogo, className: "h-11" },
};

export const headerPartnersByTheme: Record<Theme, Logo[]> = {
  pacfr: [rgePartner, certibatPartner],
  itefr: [qualibatPartner, rgePartner],
  pv: [rgePartner, photovoltaicPartner, certibatPartner],
};
```

### Utilisation transversale dans les adapters

```typescript
// Dans n'importe quel adapter
export const toV1Props = (theme: Theme): HeaderV1Props => {
  return {
    bannerText: bannerTextByTheme[theme],      // Auto-résolution
    brandLogo: headerBrandByTheme[theme],      // par thème
    partnerLogos: headerPartnersByTheme[theme], // garantie
  };
};

export const toV2Props = (theme: Theme): HeaderV2Props => {
  return {
    // Même logique de résolution, présentation différente
    bannerText: bannerTextByTheme[theme].toUpperCase(),
    brandLogo: headerBrandByTheme[theme],
    showPartners: headerPartnersByTheme[theme].length > 0,
  };
};
```

### Avantages pour le multi-thème
- ✅ **Centralisation** : Un seul endroit pour chaque type de contenu
- ✅ **Consistency** : Même structure garantie pour tous les thèmes
- ✅ **Maintenabilité** : Modification de contenu sans toucher aux composants
- ✅ **Type safety** : `Record<Theme, T>` garantit la complétude des thèmes
- ✅ **Évolutivité** : Nouveau thème = ajout dans chaque Record

---

## Flow complet : De la config à l'affichage

### Parcours d'une section Header

```
1. LANDING CONFIG
   { type: "Header", props: { theme: "pacfr", variant: "v1" } }
                    ↓
2. REGISTRY RESOLUTION  
   sectionsRegistry["Header"] → HeaderResolver.astro
                    ↓
3. RESOLVER ORCHESTRATION
   HeaderResolver.astro → resolveHeaderVariant("v1") 
                    ↓
4. VARIANT RESOLUTION
   headerVariants.v1 → { component: HeaderV1, adapter: toV1Props }
                    ↓
5. ADAPTER TRANSFORMATION
   toV1Props("pacfr") → { bannerText: "Jusqu'à 11 500€...", brandLogo: {...}, partnerLogos: [...] }
                    ↓
6. COMPONENT RENDER
   <HeaderV1 bannerText="..." brandLogo={...} partnerLogos={[...]} />
```

### Exemple concret de test A/B sophistiqué

```typescript
// Test A : Approche conservatrice
const conservativeTest = {
  title: "Test Conservative - PACFR",
  sections: [
    { type: "Header", props: { theme: "pacfr", variant: "v1" }},
    { type: "HeroSection", props: { theme: "pacfr", variant: "v1" }},
    { type: "AidSection", props: { theme: "pacfr", variant: "v1" }}
  ]
};

// Test B : Mix agressif
const aggressiveTest = {
  title: "Test Aggressive - PACFR", 
  sections: [
    { type: "Header", props: { theme: "pacfr", variant: "v2" }},      // Header moderne
    { type: "HeroSection", props: { theme: "pacfr", variant: "v1" }}, // Hero classique
    { type: "AidSection", props: { theme: "pacfr", variant: "v3" }}   // Aid avec vidéo
  ]
};

// Test C : Cross-thème (même structure, contenu ITEFR)
const crossThemeTest = {
  title: "Test ITEFR - Même structure",
  sections: [
    { type: "Header", props: { theme: "itefr", variant: "v1" }},      // Contenu ITEFR
    { type: "HeroSection", props: { theme: "itefr", variant: "v1" }}, // automatique
    { type: "AidSection", props: { theme: "itefr", variant: "v1" }}   // résolu
  ]
};
```

## Avantages globaux de cette architecture

### Pour le développement
- 🚀 **Vélocité** : Nouveaux tests A/B en minutes, pas en heures
- 🔒 **Type Safety** : Erreurs catchées à la compilation
- 🧪 **Testabilité** : Chaque layer facilement mockable
- 🔧 **Maintenabilité** : Logique métier séparée de la présentation

### Pour le business
- 📊 **A/B Testing** : Tests granulaires et combinaisons illimitées
- 🏢 **Multi-marque** : 3 thèmes gérés avec le même code
- ⚡ **Time-to-market** : Nouvelles landing pages très rapides
- 🎯 **Personnalisation** : Contenu adapté par audience

### Pour la performance
- 📦 **Code splitting** : Seuls les composants utilisés sont chargés
- 🏗️ **Build optimisé** : Astro génère du HTML statique optimisé
- 🔄 **Réutilisabilité** : Pas de duplication de code entre variants

## Quand utiliser cette approche

### ✅ Parfait pour
- Projets avec nombreuses variantes de landing pages
- Tests A/B fréquents et granulaires
- Multi-thème/multi-marque
- Équipes avec besoins de flexibilité rapide
- Contenus changeants régulièrement

### ⚠️ Peut être over-kill pour
- Site simple avec peu de variations
- Équipe très réduite
- Contenu statique rare changement
- Budget/temps limité pour la mise en place initiale

Cette architecture excelle quand la **flexibilité**, la **scalabilité** et la **testabilité** sont des priorités business critiques.