# Mise en place d'un projet Astro avec Tailwind CSS et Preact sur un VPS Linux

Ce guide décrit les commandes à exécuter sur un serveur VPS (distribution Debian/Ubuntu) pour initialiser un projet Astro prêt à l'emploi avec Tailwind CSS v4 et le support de Preact. Les étapes supposent que vous disposez d'un accès SSH au serveur et d'un compte utilisateur avec droits sudo.

## 1. Connexion au serveur
```bash
ssh utilisateur@adresse-ip-ou-domaine
```

## 2. Mise à jour du système et installation des dépendances de base
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
```

## 3. Installation de Node.js (via nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v
npm -v
```

> nvm permet de gérer plusieurs versions de Node.js et garantit que vous utilisez une version récente compatible avec Astro.

## 4. Création du dossier de projet
```bash
mkdir -p ~/projets && cd ~/projets
mkdir astro-tailwind-preact && cd astro-tailwind-preact
```

## 5. Initialisation du projet Astro minimal
```bash
npm create astro@latest . -- --template minimal --yes
```

Cette commande :
- installe les dépendances requises ;
- configure un dépôt Git local (désactivable avec --no-git si besoin) ;
- crée une structure minimale dans le répertoire courant.

## 6. Ajout de Tailwind CSS v4
```bash
npx astro add tailwind --yes
```

Astro ajoute automatiquement Tailwind CSS et crée le fichier src/styles/global.css avec l'import requis. Le flag --yes accepte les options proposées (installation via npm et mise à jour de astro.config.mjs).

## 7. Ajout de Preact
```bash
npx astro add preact --yes
```

Cette commande installe les dépendances Preact et met à jour les fichiers de configuration pour autoriser les îlots interactifs Preact dans vos pages Astro.

## 8. Vérification rapide
```bash
npm run build
```

La commande npm run build s'assure que la configuration Astro + Tailwind + Preact fonctionne correctement sur le serveur. Pour lancer le serveur de développement, utilisez npm run dev -- --host (utile si vous souhaitez prévisualiser depuis votre machine locale via un tunnel SSH).

Le projet est maintenant prêt à être personnalisé (création de composants, contenu, etc.).