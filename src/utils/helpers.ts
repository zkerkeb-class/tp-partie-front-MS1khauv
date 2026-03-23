export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const formatPokemonId = (id: number): string => {
    return `#${id.toString().padStart(3, '0')}`;
  };
  
  export const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      normal: 'bg-pokemon-normal',
      fire: 'bg-pokemon-fire',
      water: 'bg-pokemon-water',
      electric: 'bg-pokemon-electric',
      grass: 'bg-pokemon-grass',
      ice: 'bg-pokemon-ice',
      fighting: 'bg-pokemon-fighting',
      poison: 'bg-pokemon-poison',
      ground: 'bg-pokemon-ground',
      flying: 'bg-pokemon-flying',
      psychic: 'bg-pokemon-psychic',
      bug: 'bg-pokemon-bug',
      rock: 'bg-pokemon-rock',
      ghost: 'bg-pokemon-ghost',
      dragon: 'bg-pokemon-dragon',
      dark: 'bg-pokemon-dark',
      steel: 'bg-pokemon-steel',
      fairy: 'bg-pokemon-fairy',
    };
    return colors[type] || 'bg-gray-500';
  };
  
  export const getTypeColorText = (type: string): string => {
    const colors: Record<string, string> = {
      normal: 'text-pokemon-normal',
      fire: 'text-pokemon-fire',
      water: 'text-pokemon-water',
      electric: 'text-pokemon-electric',
      grass: 'text-pokemon-grass',
      ice: 'text-pokemon-ice',
      fighting: 'text-pokemon-fighting',
      poison: 'text-pokemon-poison',
      ground: 'text-pokemon-ground',
      flying: 'text-pokemon-flying',
      psychic: 'text-pokemon-psychic',
      bug: 'text-pokemon-bug',
      rock: 'text-pokemon-rock',
      ghost: 'text-pokemon-ghost',
      dragon: 'text-pokemon-dragon',
      dark: 'text-pokemon-dark',
      steel: 'text-pokemon-steel',
      fairy: 'text-pokemon-fairy',
    };
    return colors[type] || 'text-gray-500';
  };
  
  export const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];
  
  export const getStatName = (statName: string): string => {
    const names: Record<string, string> = {
      hp: 'PV',
      attack: 'Attaque',
      defense: 'Défense',
      'special-attack': 'Att. Spé',
      'special-defense': 'Déf. Spé',
      speed: 'Vitesse',
    };
    return names[statName] || statName;
  };