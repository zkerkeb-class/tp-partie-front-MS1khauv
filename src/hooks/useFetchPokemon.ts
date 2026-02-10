import { useState, useEffect } from 'react';
import { pokemonApi } from '../api/pokemonApi';
import { Pokemon } from '../types/pokemon';

export const useFetchPokemon = (offset: number, limit: number) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pokemonData = await pokemonApi.getPokemonList(offset, limit);
        
        setPokemons(pokemonData);
        
        setTotalCount(151); 

      } catch (err) {
        setError('Erreur lors du chargement des Pokémon');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [offset, limit]);

  return { pokemons, loading, error, totalCount };
};