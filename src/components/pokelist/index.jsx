import React from 'react';
import PokeCard from '../pokeCard';

export default function PokeList({ pokemons, loading, error }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  };

  if (loading) {
    return (
      <div style={gridStyle}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: '2/3',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
              animation: 'pulse 1.5s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  if (error) return (
    <p style={{ color: '#ef4444', fontWeight: 700, textAlign: 'center', padding: '40px' }}>
      {error}
    </p>
  );

  if (pokemons.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.2)' }}>
      <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
      <p style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        Aucun Pokémon trouvé
      </p>
    </div>
  );

  return (
    <div style={gridStyle}>
      {pokemons.map((pokemon) => (
        <PokeCard key={`${pokemon.id}-${pokemon.name}`} pokemon={pokemon} />
      ))}
    </div>
  );
}
