# 🎮 Pokédex TCG — Frontend

Application web immersive style **Cartes à Collectionner Pokémon**, construite avec **React 18 + Vite + TypeScript**.
Couvre les **151 Pokémon de la Génération I** avec une expérience visuelle soignée, des Easter Eggs et un mode bilingue FR/EN.

---

## 📋 Prérequis

- **Node.js** v20+ ([télécharger](https://nodejs.org))
- **npm** v10+
- Le **backend** doit tourner sur `http://localhost:3000` (voir [README backend](../tp-partie-back-MS1khauv/README.md))

---

## ⚙️ Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/zkerkeb-class/tp-partie-front-MS1khauv.git
cd tp-partie-front-MS1khauv

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application est accessible sur **http://localhost:5173**

---

## 🛠️ Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre Vite en mode développement (hot reload) |
| `npm run build` | Compile pour la production dans `/dist` |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Analyse le code avec ESLint |

---

## 📁 Structure du projet

```
tp-partie-front-MS1khauv/
├── src/
│   ├── pages/
│   │   ├── IntroScreen.tsx      # Écran d'introduction cinématique
│   │   ├── Home.tsx             # Page d'accueil — grille des Pokémon
│   │   ├── DetailPage.tsx       # Fiche détaillée d'un Pokémon
│   │   ├── Favorites.tsx        # Mes Pokémon favoris
│   │   ├── Battle.tsx           # Simulateur de combat
│   │   ├── DailyChallenge.tsx   # Défi du Jour (quiz quotidien)
│   │   └── CreatePokemon.tsx    # Créer un Pokémon personnalisé
│   │
│   ├── components/
│   │   ├── pokeCard/            # Carte TCG avec effet 3D holographique
│   │   ├── pokelist/            # Grille de cartes (4 par ligne)
│   │   └── title/
│   │       ├── Layout.jsx       # Navigation principale
│   │       ├── SearchBar.jsx    # Barre de recherche bilingue
│   │       └── TypeFilter.jsx   # Filtre par type (18 types, FR/EN)
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx     # Mode sombre / clair
│   │   ├── LangContext.tsx      # Langue FR / EN (i18n complet)
│   │   └── PokemonContext.tsx   # État global (favoris, Pokémon custom)
│   │
│   ├── hooks/
│   │   ├── useFetchPokemon.ts   # Fetch paginé, fetch tout, fetch par ID
│   │   ├── useAudio.ts          # Lecture des cris Pokémon
│   │   └── usePokemon.tsx       # Accès au PokemonContext
│   │
│   ├── api/
│   │   └── pokemonApi.ts        # Client axios — backend REST
│   │
│   ├── types/
│   │   └── pokemon.ts           # Types TypeScript
│   │
│   ├── App.jsx                  # Routing React Router v6
│   └── main.jsx                 # Point d'entrée
│
├── public/                      # Assets statiques
├── vite.config.js
└── package.json
```

---

## 🗺️ Routes de l'application

| Route | Page | Description |
|-------|------|-------------|
| `/intro` | `IntroScreen` | Écran d'introduction (1er lancement uniquement) |
| `/` | `Home` | Grille paginée des 151 Pokémon |
| `/pokemon/:id` | `DetailPage` | Fiche complète avec stats, évolutions, localisations |
| `/favorites` | `Favorites` | Pokémon mis en favoris |
| `/battle` | `Battle` | Simulateur de combat entre 2 Pokémon |
| `/daily` | `DailyChallenge` | Défi du Jour — quiz quotidien |
| `/create` | `CreatePokemon` | Créer un Pokémon personnalisé |

---

## ✨ Fonctionnalités

### 🃏 Cartes TCG holographiques
- Grille **4 cartes par ligne**, style Cartes à Collectionner Pokémon
- Effet **3D tilt** au survol (perspective + rotateX/Y dynamiques)
- **Reflet holographique** qui suit la position de la souris
- Glow coloré selon le **type** du Pokémon
- Lecture du **cri Pokémon** intégrée sur chaque carte
- Bouton **favori** ❤️ persistant

### 🔍 Recherche & filtres
- Recherche par nom en temps réel
- Filtre par **type** avec logique AND (multi-sélection)
- 18 types avec leurs couleurs officielles
- Noms de types traduits en **FR/EN** (Feu, Eau, Plante...)

### 📖 Fiche détaillée (`/pokemon/:id`)
- 4 onglets : **À Propos**, **Stats**, **Évolutions**, **Lieux**
- Fond thématique selon le type (couleur + paysage)
- Numéro Pokédex filigrane dans le hero
- Barres de stats animées avec couleurs progressives
- Chaîne d'évolutions interactive (clic → navigation vers le Pokémon)
- **Carte interactive des régions** avec points de capture animés (données PokéAPI)
- Bouton **Retour** qui revient à la page précédente
- Messages d'erreur HTTP (404, 429, 500)

### 🌍 Bilingue FR / EN
- Bouton de basculement de langue dans la navigation
- Toutes les pages traduites : Home, Favoris, Combat, Défi du Jour, Fiche détaillée
- Types Pokémon traduits dans le filtre latéral
- Placeholders et messages d'erreur traduits
- Préférence sauvegardée en `localStorage`

### 🌙 Mode sombre / clair
- Toggle dans la navigation
- Adapté sur toutes les pages et composants
- Préférence sauvegardée en `localStorage`

### ⭐ Favoris
- Ajout / retrait depuis n'importe quelle carte
- Page dédiée avec filtre par type et barre de recherche
- Persistance en `localStorage`

### ⚔️ Simulateur de Combat
- Recherche et sélection de 2 Pokémon parmi les 151
- Calcul des dégâts basé sur ATK, DEF, vitesse et efficacité des types
- **Coups critiques** (10% de chance, ×1.5 dégâts)
- Journal de combat animé avec auto-scroll
- Barre de PV colorée (vert → jaune → rouge)
- Animation de tremblement lors des coups reçus
- Journal et messages traduits FR/EN

### 🏆 Défi du Jour
- Défi **quotidien identique** pour tous les utilisateurs (seed basé sur la date)
- 4 types de challenges :
  - 🕵️ **Silhouette** — deviner le Pokémon masqué
  - 🔊 **Cri** — identifier le Pokémon au son
  - 🎯 **Type Quiz** — quel est son type principal ?
  - 📊 **Stats Quiz** — lequel a la meilleure stat ?
- Score et **streak** (série) sauvegardés en `localStorage`
- Icône trophée 🏆 avec badge animé dans la navigation

### 🎬 Écran d'introduction (1er lancement)
- Affiché **uniquement lors du premier lancement** (mémorisé en `localStorage`)
- Fond spatial avec **30 étoiles scintillantes** et effet scanlines rétro
- **Dialogue progressif** du Professeur Chen / Prof. Oak (effet machine à écrire lettre par lettre)
- Barre de progression des dialogues
- **Choix du starter** : Bulbizarre 🌿, Salamèche 🔥, Carapuce 💧
- **Carte secrète `???`** → hover → révèle Pikachu ⚡
- Animations : float, popIn, glowPulse, twinkle
- Bouton **"Passer"** pour ignorer l'intro
- Support FR/EN complet

> **Revoir l'intro :** ouvrir la console du navigateur et taper :
> ```js
> localStorage.removeItem('pokedex-hasSeenIntro')
> ```

### 🥚 Easter Egg

| Easter Egg | Déclencheur | Effet |
|-----------|------------|-------|
| **Thème Pokémon** | Rester **30 secondes** sur la page d'accueil | Toast vert slide-up + lecture du thème **Pokémon Rouge/Bleu** (Title Screen) |

### 🛠️ Pokémon personnalisés
- Formulaire de création complet avec image URL
- Pokémon créés disponibles dans toute l'app
- Suppression depuis la fiche détaillée

---

## 🗂️ Sources de données

| Source | Utilisation |
|--------|------------|
| **Backend REST** (`localhost:3000`) | Données de base, CRUD Pokémon personnalisés |
| **PokéAPI** (`pokeapi.co`) | Sprites HD, stats complètes, évolutions, cris audio, lieux de capture |
| **Internet Archive** | Thème musical Pokémon Rouge/Bleu (Easter Egg 30s) |

---

## 💾 localStorage — Clés utilisées

| Clé | Description |
|-----|-------------|
| `pokedex-hasSeenIntro` | Intro déjà vue → redirige directement vers Home |
| `pokedex-lang` | Langue sélectionnée (`fr` / `en`) |
| `pokedex-theme` | Thème sélectionné (`dark` / `light`) |
| `pokemon-storage` | Favoris + Pokémon personnalisés (JSON) |
| `daily-score` | Score cumulé du Défi du Jour |
| `daily-total` | Nombre total de défis tentés |
| `daily-streak` | Série de bonnes réponses en cours |

---

## 📦 Dépendances

### Production

| Package | Version | Rôle |
|---------|---------|------|
| `react` | ^18.3.1 | Framework UI |
| `react-dom` | ^18.3.1 | Rendu DOM |
| `react-router-dom` | ^6.30.3 | Routing SPA (BrowserRouter) |
| `axios` | ^1.13.5 | Client HTTP |
| `lucide-react` | ^0.563.0 | Icônes SVG |

### Développement

| Package | Version | Rôle |
|---------|---------|------|
| `vite` | ^5.1.0 | Bundler & dev server ultra-rapide |
| `@vitejs/plugin-react` | ^4.2.1 | Support React + Fast Refresh dans Vite |
| `typescript` | ^5.3.3 | Typage statique |
| `eslint` | ^8.56.0 | Linting |
| `tailwindcss` | ^3.4.1 | Utilitaires CSS |

---

## 🔗 Dépôt GitHub

[https://github.com/zkerkeb-class/tp-partie-front-MS1khauv](https://github.com/zkerkeb-class/tp-partie-front-MS1khauv)
