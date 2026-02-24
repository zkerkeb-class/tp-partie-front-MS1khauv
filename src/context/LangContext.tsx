import React, { createContext, useContext, useState } from 'react';

type Lang = 'fr' | 'en';

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  fr: {
    // Nav
    'nav.home': 'Home',
    'nav.pokedex': 'Pokédex',
    'nav.favorites': 'Favoris',
    'nav.battle': 'Combat',
    // Home
    'home.title': 'Pokédex',
    'home.subtitle': 'Génération I · 151 Pokémon',
    'home.results': 'résultat',
    'home.results_plural': 'résultats',
    'home.prev': '← Préc.',
    'home.next': 'Suiv. →',
    'home.page': 'Page',
    'home.types': 'Types',
    'home.reset': 'Reset',
    'home.gen': 'GEN I · 151 Pokémon',
    'home.search_placeholder': 'Rechercher un Pokémon...',
    'home.not_found': 'Aucun Pokémon trouvé',
    // Cards
    'card.sound': 'Son',
    'card.playing': 'En cours',
    'card.attacks': 'Attaques',
    // Detail
    'detail.back': '← Retour',
    'detail.edit': 'Modifier',
    'detail.delete': 'Supprimer',
    'detail.tab_about': 'À Propos',
    'detail.tab_stats': 'Stats',
    'detail.tab_evos': 'Évolutions',
    'detail.abilities': 'Capacités',
    'detail.physical': 'Physique',
    'detail.height': 'Taille',
    'detail.weight': 'Poids',
    'detail.base_exp': 'Exp. base',
    'detail.weaknesses': 'Faiblesses ×2',
    'detail.resistances': 'Résistances ×½',
    'detail.immunities': 'Immunités ×0',
    'detail.none': 'Aucune',
    'detail.no_evo': "Ce Pokémon n'évolue pas.",
    'detail.evo_loading': 'Chargement des évolutions...',
    'detail.level': 'Niv.',
    'detail.hidden': 'Cachée',
    'detail.total': 'Total',
    'detail.custom': 'Custom',
    'detail.delete_confirm': 'Supprimer ?',
    'detail.delete_text': 'sera supprimé définitivement.',
    'detail.cancel': 'Annuler',
    'detail.saving': 'Sauvegarde...',
    'detail.loading': 'Chargement...',
    // Favorites
    'favorites.title': 'Mes',
    'favorites.title2': 'Favoris',
    'favorites.saved': 'Pokémon sauvegardé',
    'favorites.saved_plural': 'Pokémon sauvegardés',
    'favorites.empty_title': 'Aucun favori',
    'favorites.empty_text': "Clique sur ❤️ d'une carte pour ajouter des Pokémon à tes favoris.",
    'favorites.search': 'Rechercher dans les favoris...',
    // Battle
    'battle.title': 'Simulateur de',
    'battle.title2': 'Combat',
    'battle.subtitle': 'Sélectionne 2 Pokémon · Lance le duel · Découvre le vainqueur',
    'battle.p1': 'Pokémon 1',
    'battle.p2': 'Pokémon 2',
    'battle.choose': 'Choisir un Pokémon',
    'battle.search': 'Chercher...',
    'battle.start': '⚔️ Lancer le combat !',
    'battle.ongoing': 'Combat en cours...',
    'battle.new': '🔄 Nouveau combat',
    'battle.log': 'Journal de combat',
    'battle.wins': 'gagne !',
    'battle.first': 'attaque en premier (vitesse supérieure) !',
    'battle.begin': 'Le combat commence !',
    'battle.draw': '🤝 Match nul ! Les deux Pokémon sont K.O. !',
    'battle.uses': 'utilise',
    'battle.damages': 'dégâts',
    'battle.critical': '💥 CRITIQUE !',
    'battle.hp': 'PV',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.pokedex': 'Pokédex',
    'nav.favorites': 'Favorites',
    'nav.battle': 'Battle',
    // Home
    'home.title': 'Pokédex',
    'home.subtitle': 'Generation I · 151 Pokémon',
    'home.results': 'result',
    'home.results_plural': 'results',
    'home.prev': '← Prev.',
    'home.next': 'Next →',
    'home.page': 'Page',
    'home.types': 'Types',
    'home.reset': 'Reset',
    'home.gen': 'GEN I · 151 Pokémon',
    'home.search_placeholder': 'Search a Pokémon...',
    'home.not_found': 'No Pokémon found',
    // Cards
    'card.sound': 'Sound',
    'card.playing': 'Playing',
    'card.attacks': 'Moves',
    // Detail
    'detail.back': '← Back',
    'detail.edit': 'Edit',
    'detail.delete': 'Delete',
    'detail.tab_about': 'About',
    'detail.tab_stats': 'Stats',
    'detail.tab_evos': 'Evolutions',
    'detail.abilities': 'Abilities',
    'detail.physical': 'Physical',
    'detail.height': 'Height',
    'detail.weight': 'Weight',
    'detail.base_exp': 'Base Exp.',
    'detail.weaknesses': 'Weaknesses ×2',
    'detail.resistances': 'Resistances ×½',
    'detail.immunities': 'Immunities ×0',
    'detail.none': 'None',
    'detail.no_evo': "This Pokémon doesn't evolve.",
    'detail.evo_loading': 'Loading evolutions...',
    'detail.level': 'Lv.',
    'detail.hidden': 'Hidden',
    'detail.total': 'Total',
    'detail.custom': 'Custom',
    'detail.delete_confirm': 'Delete?',
    'detail.delete_text': 'will be permanently deleted.',
    'detail.cancel': 'Cancel',
    'detail.saving': 'Saving...',
    'detail.loading': 'Loading...',
    // Favorites
    'favorites.title': 'My',
    'favorites.title2': 'Favorites',
    'favorites.saved': 'Pokémon saved',
    'favorites.saved_plural': 'Pokémon saved',
    'favorites.empty_title': 'No favorites',
    'favorites.empty_text': "Click ❤️ on a card to add Pokémon to your favorites.",
    'favorites.search': 'Search in favorites...',
    // Battle
    'battle.title': 'Battle',
    'battle.title2': 'Simulator',
    'battle.subtitle': 'Pick 2 Pokémon · Start the duel · Find out who wins',
    'battle.p1': 'Pokémon 1',
    'battle.p2': 'Pokémon 2',
    'battle.choose': 'Choose a Pokémon',
    'battle.search': 'Search...',
    'battle.start': '⚔️ Start battle!',
    'battle.ongoing': 'Battle in progress...',
    'battle.new': '🔄 New battle',
    'battle.log': 'Battle log',
    'battle.wins': 'wins!',
    'battle.first': 'attacks first (higher speed)!',
    'battle.begin': 'The battle begins!',
    'battle.draw': '🤝 Draw! Both Pokémon are K.O.!',
    'battle.uses': 'uses',
    'battle.damages': 'damage',
    'battle.critical': '💥 CRITICAL!',
    'battle.hp': 'HP',
  },
};

const LangContext = createContext<LangContextType>({
  lang: 'fr',
  toggleLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('pokedex-lang') as Lang) || 'fr';
  });

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('pokedex-lang', next);
      return next;
    });
  };

  const t = (key: string): string => {
    return translations[lang][key] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
