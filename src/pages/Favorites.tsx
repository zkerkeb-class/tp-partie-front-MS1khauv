import React, { useState, useEffect } from 'react';
import { usePokemon } from '../hooks/usePokemon';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { pokemonApi } from '../api/pokemonApi';
import { Pokemon } from '../types/pokemon';
import PokeList from '../components/pokelist';
import TypeFilter from '../components/title/TypeFilter';

export default function Favorites() {
  const { state } = usePokemon();
  const { isDark } = useTheme();
  const { lang } = useLang();
  const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const bg           = isDark ? '#080808' : '#f4f4f4';
  const cardBg       = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const cardBorder   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textColor    = isDark ? 'white' : '#111';
  const mutedColor   = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.32)';
  const sidebarBg    = isDark ? '#0d0d0d' : '#ebebeb';

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const promises = state.favorites.map(async (id) => {
          const custom = state.customPokemons.find(p => p.id === id);
          if (custom) return custom;
          return pokemonApi.getPokemonById(id);
        });
        const pokemons = await Promise.all(promises);
        setFavoritePokemons(pokemons);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };

    if (state.favorites.length > 0) fetchFavorites();
    else setLoading(false);
  }, [state.favorites, state.customPokemons]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filtered = favoritePokemons.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedTypes.length === 0 || p.types.some(t => selectedTypes.includes(t.type.name));
    return matchSearch && matchType;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg }}>

      {/* ── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside style={{
        width: '210px', flexShrink: 0,
        background: sidebarBg, borderRight: `1px solid ${cardBorder}`,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '24px 16px 20px', borderBottom: `1px solid ${cardBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '9px', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.2em' }}>◈ Types</p>
            {selectedTypes.length > 0 && (
              <button onClick={() => setSelectedTypes([])} style={{ padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.08)', color: '#dc2626', fontSize: '8px', fontWeight: 900, cursor: 'pointer' }}>{lang === 'fr' ? 'Réinitialiser' : 'Reset'}</button>
            )}
          </div>
        </div>
        <div style={{ padding: '14px 12px', flex: 1, overflowY: 'auto' }}>
          <TypeFilter selectedTypes={selectedTypes} toggleType={toggleType} />
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{
          padding: '28px 40px 24px',
          borderBottom: `1px solid ${cardBorder}`,
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: textColor, fontStyle: 'italic', letterSpacing: '-0.05em', lineHeight: 1, margin: 0 }}>
              {lang === 'fr' ? 'Mes\u00a0' : 'My\u00a0'}
            </h1>
            <span style={{ fontSize: '48px', fontWeight: 900, color: '#dc2626', fontStyle: 'italic', letterSpacing: '-0.05em', lineHeight: 1 }}>
              {lang === 'fr' ? 'Favoris' : 'Favorites'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <p style={{ fontSize: '10px', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>
              {state.favorites.length} {lang === 'fr' ? `Pokémon sauvegardé${state.favorites.length !== 1 ? 's' : ''}` : `Saved Pokémon`}
            </p>
            {(selectedTypes.length > 0 || searchTerm) && (
              <span style={{ padding: '2px 10px', borderRadius: '20px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', color: '#dc2626', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {filtered.length} {lang === 'fr' ? `résultat${filtered.length !== 1 ? 's' : ''}` : `result${filtered.length !== 1 ? 's' : ''}`}
              </span>
            )}
          </div>

          {/* Search */}
          <div style={{ maxWidth: '480px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '13px', height: '13px', color: mutedColor, pointerEvents: 'none' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={lang === 'fr' ? 'Rechercher dans les favoris...' : 'Search in favorites...'}
              style={{
                width: '100%', padding: '10px 36px 10px 36px',
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: '12px', color: textColor, fontSize: '13px',
                fontWeight: 500, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(239,68,68,0.45)'}
              onBlur={e => e.target.style.borderColor = cardBorder}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: cardBg, border: 'none', color: mutedColor, borderRadius: '6px', padding: '3px 7px', cursor: 'pointer', fontSize: '10px', fontWeight: 900 }}>✕</button>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div style={{ padding: '0 40px', flex: 1 }}>
          {state.favorites.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: cardBg, border: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>💔</div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', fontWeight: 900, color: textColor, marginBottom: '6px' }}>{lang === 'fr' ? 'Aucun favori' : 'No favorites yet'}</p>
                <p style={{ fontSize: '12px', color: mutedColor }}>{lang === 'fr' ? "Clique sur ❤️ d'une carte pour ajouter des Pokémon à tes favoris." : "Click ❤️ on a card to add Pokémon to your favorites."}</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: mutedColor }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
              <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{lang === 'fr' ? 'Aucun résultat' : 'No results'}</p>
            </div>
          ) : (
            <PokeList pokemons={filtered} loading={loading} error={null} />
          )}
        </div>
        <div style={{ height: '48px' }}/>
      </main>
    </div>
  );
}
