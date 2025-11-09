# Pattern Registry + Resolver - Architecture des Landing Pages

## Vue d'ensemble

Ce projet utilise une architecture **Registry + Resolver** pour construire des landing pages modulaires et testables. L'approche permet de créer facilement des dizaines de variantes pour les tests A/B tout en gardant le code maintenable.

## Architecture générale

```
Landing Page Definition (JSON-like)
         ↓
    Sections Registry (mapping type → component)
         ↓
    Resolver (si nécessaire)
         ↓
    Adapter (transformation des props)
         ↓
    Component Final (.astro)
```

## 1. Définition d'une Landing Page

```typescript
// src/landings/pacfr/pacfr-v1.ts
export default {
  title: "PACFR - Formation Certifiante",
  description: "Obtenez votre certification...",
  sections: [
    {
      type: "Header",
      props: { theme: "pacfr", variant: "v1", bannerText: "Promo -50%" }
    },
    {
      type: "HeroSection", 
      props: { title: "Formation Premium", ctaText: "Je m'inscris" }
    },
    {
      type: "AidSection",
      props: { theme: "pacfr", variant: "v1" }
    }
  ]
};
```

**Avantages** :
- ✅ Configuration déclarative (facile à modifier)
- ✅ Réutilisable entre différentes pages
- ✅ Idéal pour les tests A/B (changer juste la config)

## 2. Registry des Sections

```typescript
// src/sections/index.tsx
export const sectionsRegistry = {
  // Sections simples (rendu direct)
  HeroSection: HeroSection,
  ReviewsCarousel: ReviewsCarousel,
  HeroBadges: HeroBadges,
  
  // Sections complexes (avec resolver)
  Header: HeaderResolver,
  AidSection: AidSectionResolver,
};
```

**Principe** : Mapper un nom de section → composant correspondant

## 3. Pattern Resolver (pour sections complexes)

### Pourquoi un Resolver ?

Certaines sections ont besoin de logique avant le rendu :
- **Multi-variants** (Header v1, v2, v3...)
- **Multi-thèmes** (pacfr, itefr, pv)
- **Transformation de données** (contenu brut → props typées)

### Example : HeaderResolver

```astro
<!-- src/sections/Header/HeaderResolver.astro -->
---
import { resolveHeaderVariant } from "./adapters";
import type { Theme } from "../../config/header/header-content.v1";

// 1. Récupération des props de la définition
const { theme = "pacfr", variant = "v1", bannerText } = Astro.props as {
  theme?: Theme;
  variant?: string;
  bannerText?: string;
};

// 2. Résolution du bon composant + adapter
const { component: Component, adapter: toProps } = resolveHeaderVariant(variant);

// 3. Transformation des données
const props = toProps({ theme, bannerText });
---

<!-- 4. Rendu du composant final -->
<Component {...props} />
```

## 4. Pattern Adapter

### Rôle de l'Adapter

Transformer les données "business" en props attendues par le composant UI.

```typescript
// src/sections/Header/adapters.ts

// Props d'entrée (depuis la landing definition)
type BaseInput = {
  theme: Theme;
  bannerText?: string;
};

// Props attendues par Header.v1.astro
type V1Props = {
  theme: Theme;
  bannerText: string;
  brandLogo: Logo;
  partnerLogos: Logo[];
};

// Adapter : BaseInput → V1Props
export const toV1Props = (input: BaseInput): V1Props => {
  return {
    theme: input.theme,
    bannerText: input.bannerText || "",
    brandLogo: headerBrandByTheme[input.theme],
    partnerLogos: headerPartnersByTheme[input.theme],
  };
};
```

**Avantages** :
- ✅ Découplage données ↔ présentation
- ✅ Chaque variant peut avoir ses propres props
- ✅ Transformation/validation centralisée

## 5. Système Multi-Variant

```typescript
// src/sections/Header/adapters.ts
export const headerVariants = {
  v1: { component: HeaderV1, adapter: toV1Props },
  v2: { component: HeaderV2, adapter: toV2Props },
  v3: { component: HeaderV3, adapter: toV3Props },
} as const;

export const resolveHeaderVariant = (variant: string = "v1") => {
  return headerVariants[variant] || headerVariants.v1;
};
```

## 6. Rendu final dans la page

```astro
<!-- src/pages/pacfr/index.astro -->
---
import { sectionsRegistry } from "../../sections";
import def from "../../landings/pacfr/pacfr-v1";
---

<LandingLayout title={def.title} description={def.description}>
  <LandingShell>
    {def.sections.map((s: SectionDef) => {
      const Component = sectionsRegistry[s.type];
      return <Component {...s.props} />;
    })}
  </LandingShell>
</LandingLayout>
```

## Cas d'usage : Tests A/B

### Créer une nouvelle variante

1. **Nouveau composant** : `Header.v2.astro`
2. **Nouvel adapter** : `toV2Props`
3. **Enregistrer** dans `headerVariants`
4. **Utiliser** : `{ type: "Header", props: { variant: "v2" } }`

### Tester différentes combinaisons

```typescript
// Landing A : Header v1 + Hero v1
const landingA = {
  sections: [
    { type: "Header", props: { variant: "v1" }},
    { type: "HeroSection", props: { variant: "v1" }}
  ]
};

// Landing B : Header v2 + Hero v1  
const landingB = {
  sections: [
    { type: "Header", props: { variant: "v2" }},
    { type: "HeroSection", props: { variant: "v1" }}
  ]
};
```

## Structure des fichiers

```
src/
├── sections/
│   ├── index.tsx                 # Registry principal
│   ├── Header/
│   │   ├── HeaderResolver.astro  # Point d'entrée
│   │   ├── adapters.ts          # Logique de transformation
│   │   ├── Header.v1.astro      # Composant UI v1
│   │   └── Header.v2.astro      # Composant UI v2
│   └── AidSection/
│       ├── AidSectionResolver.astro
│       ├── adapters.ts
│       └── AidSection.v1.astro
├── landings/
│   └── pacfr/
│       ├── pacfr-v1.ts          # Config landing v1
│       └── pacfr-v2.ts          # Config landing v2
└── pages/
    └── pacfr/
        └── index.astro          # Rendu final
```

## Avantages de cette approche

✅ **Scalabilité** : Facile d'ajouter des sections/variants  
✅ **Tests A/B** : Changement de config sans toucher au code  
✅ **Multi-thème** : Support natif de plusieurs marques  
✅ **Type Safety** : Props typées à chaque niveau  
✅ **Réutilisabilité** : Composants réutilisables entre pages  
✅ **Maintenance** : Logique centralisée par section  

## Quand utiliser cette approche

- ✅ Nombreuses variantes de landing pages
- ✅ Tests A/B fréquents
- ✅ Multi-thème/multi-marque
- ✅ Équipe avec besoins de flexibilité

## Alternative plus simple

Pour des projets avec peu de variantes, une approche directe peut suffire :

```astro
<!-- Rendu direct sans registry -->
<Header theme="pacfr" variant="v1" />
<HeroSection title="Mon titre" />
<AidSection theme="pacfr" />
```

Cette architecture excelle quand la **flexibilité** et la **testabilité** sont prioritaires.