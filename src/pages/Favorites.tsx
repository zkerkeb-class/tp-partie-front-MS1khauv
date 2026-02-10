import React, { useState, useEffect } from 'react';
import { usePokemon } from '../hooks/usePokemon';
import { pokemonApi } from '../api/pokemonApi';
import { Pokemon } from '../types/pokemon';
import PokeList from '../components/pokelist';

export default function Favorites() {
  const { state } = usePokemon();
  const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const pokemonPromises = state.favorites.map(async (id) => {
          const custom = state.customPokemons.find((p) => p.id === id);
          if (custom) return custom;
          return pokemonApi.getPokemonById(id);
        });

        const pokemons = await Promise.all(pokemonPromises);
        setFavoritePokemons(pokemons);
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
      } finally {
        setLoading(false);
      }
    };

    if (state.favorites.length > 0) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [state.favorites, state.customPokemons]);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          ❤️ Mes Pokémon Favoris
        </h1>
        <p className="text-xl text-gray-600">
          Vous avez {state.favorites.length} favori{state.favorites.length > 1 ? 's' : ''}
        </p>
      </div>

      {state.favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-lg p-8">
          <p className="text-6xl mb-4">💔</p>
          <p className="text-2xl text-gray-600 mb-2">Aucun favori pour le moment</p>
          <p className="text-gray-500">
            Cliquez sur le cœur d'un Pokémon pour l'ajouter à vos favoris!
          </p>
        </div>
      ) : (
        <PokeList pokemons={favoritePokemons} loading={loading} error={null} />
      )}
    </div>
  );
}