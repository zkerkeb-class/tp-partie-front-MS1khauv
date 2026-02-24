import { PokemonState, PokemonAction } from '../types/pokemon';

export const initialState: PokemonState = {
  customPokemons: [],
  favorites: [],
};

export const pokemonReducer = (
  state: PokemonState,
  action: PokemonAction
): PokemonState => {
  switch (action.type) {
    case 'ADD_POKEMON':
      return {
        ...state,
        customPokemons: [...state.customPokemons, { ...action.payload, isCustom: true }],
      };

    case 'UPDATE_POKEMON':
      return {
        ...state,
        customPokemons: state.customPokemons.map((pokemon) =>
          pokemon.id === action.payload.id
            ? { ...pokemon, ...action.payload.data }
            : pokemon
        ),
      };

    case 'DELETE_POKEMON':
      return {
        ...state,
        customPokemons: state.customPokemons.filter(
          (pokemon) => pokemon.id !== action.payload
        ),
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
};