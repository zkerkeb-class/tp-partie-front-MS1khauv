import React from 'react';
import PokeCard from '../pokeCard';

export default function PokeList({ pokemons, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 max-w-[1400px] mx-auto">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-800 animate-pulse rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500 font-bold text-center">{error}</p>;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8 justify-items-center">
        {pokemons.map((pokemon) => (
          <PokeCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}