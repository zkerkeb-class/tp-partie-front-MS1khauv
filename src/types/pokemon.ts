export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: { name: string; url: string; };
}
  
export interface PokemonType {
    slot: number;
    type: { name: string; url: string; };
}
  
export interface PokemonAbility {
    ability: { name: string; url: string; };
    is_hidden: boolean;
    slot: number;
}
  
export interface PokemonSprites {
    front_default: string;
    other?: {
      'official-artwork'?: { front_default: string; };
    };
}
  
export interface PokemonCries {
    latest: string;
    legacy: string;
}

// AJOUT : Interface pour les visuels TCG
export interface TcgData {
    id: string;
    images: {
        small: string;
        large: string;
    };
}
  
export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: PokemonSprites;
    types: PokemonType[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    cries?: PokemonCries;
    species: { name: string; url: string; };
    isCustom?: boolean;
    tcgData?: TcgData; // Propriété optionnelle pour stocker l'image de la carte
}
  
export interface PokemonListItem {
    name: string;
    url: string;
}
  
export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}
  
export interface PokemonState {
    customPokemons: Pokemon[];
    favorites: number[];
}
  
export type PokemonAction =
    | { type: 'ADD_POKEMON'; payload: Pokemon }
    | { type: 'UPDATE_POKEMON'; payload: { id: number; data: Partial<Pokemon> } }
    | { type: 'DELETE_POKEMON'; payload: number }
    | { type: 'TOGGLE_FAVORITE'; payload: number }
    | { type: 'LOAD_STATE'; payload: PokemonState };