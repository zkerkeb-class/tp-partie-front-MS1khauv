import React, { useState } from 'react';
import { useLang } from '../../context/LangContext';

export default function SearchBar({ onSearch }) {
  const { lang } = useLang();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        {/* Icône loupe — petite */}
        <svg
          style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
            width: '13px', height: '13px', color: 'rgba(255,255,255,0.25)',
            pointerEvents: 'none', flexShrink: 0,
          }}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
          placeholder={lang === 'fr' ? 'Rechercher un Pokémon...' : 'Search a Pokémon...'}
          style={{
            width: '100%',
            padding: '11px 110px 11px 36px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '13px',
            fontWeight: 500,
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(239,68,68,0.45)';
            e.target.style.background = 'rgba(255,255,255,0.06)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)';
            e.target.style.background = 'rgba(255,255,255,0.04)';
          }}
        />

        <div style={{
          position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', gap: '6px', alignItems: 'center',
        }}>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.5)',
                borderRadius: '8px', padding: '4px 8px', cursor: 'pointer',
                fontSize: '10px', fontWeight: 900, lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            style={{
              background: '#dc2626', border: 'none', color: 'white',
              borderRadius: '8px', padding: '5px 12px', cursor: 'pointer',
              fontSize: '10px', fontWeight: 900, textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Go
          </button>
        </div>
      </div>
    </form>
  );
}
