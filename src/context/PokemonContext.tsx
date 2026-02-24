import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Pokemon, PokemonState } from '../types/pokemon';
import { pokemonReducer, initialState } from './PokemonReducer';

interface PokemonContextType {
  state: PokemonState;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (id: number, data: Partial<Pokemon>) => void;
  deletePokemon: (id: number) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  getCustomPokemon: (id: number) => Pokemon | undefined;
  getAllPokemons: (apiPokemons: Pokemon[]) => Pokemon[];
  getNextCustomId: () => number;
}

export const PokemonContext = createContext<PokemonContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'pokemon-storage';

interface PokemonProviderProps {
  children: ReactNode;
}

export const PokemonProvider: React.FC<PokemonProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(pokemonReducer, initialState, () => {
    // Charger l'état depuis localStorage
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      try {
        return JSON.parse(storedState);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return initialState;
      }
    }
    return initialState;
  });

  // Sauvegarder l'état dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addPokemon = (pokemon: Pokemon) => {
    dispatch({ type: 'ADD_POKEMON', payload: pokemon });
  };

  const updatePokemon = (id: number, data: Partial<Pokemon>) => {
    dispatch({ type: 'UPDATE_POKEMON', payload: { id, data } });
  };

  const deletePokemon = (id: number) => {
    dispatch({ type: 'DELETE_POKEMON', payload: id });
  };

  const toggleFavorite = (id: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  };

  const isFavorite = (id: number): boolean => {
    return state.favorites.includes(id);
  };

  const getCustomPokemon = (id: number): Pokemon | undefined => {
    return state.customPokemons.find((pokemon) => pokemon.id === id);
  };

  const getAllPokemons = (apiPokemons: Pokemon[]): Pokemon[] => {
    return [...apiPokemons, ...state.customPokemons];
  };

  const getNextCustomId = (): number => {
    if (state.customPokemons.length === 0) return 10001;
    return Math.max(...state.customPokemons.map((p) => p.id)) + 1;
  };

  const value: PokemonContextType = {
    state,
    addPokemon,
    updatePokemon,
    deletePokemon,
    toggleFavorite,
    isFavorite,
    getCustomPokemon,
    getAllPokemons,
    getNextCustomId,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};