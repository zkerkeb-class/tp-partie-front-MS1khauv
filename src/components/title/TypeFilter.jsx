import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';

// Traduction des types Pokémon
const TYPE_FR = {
  normal: 'Normal', fire: 'Feu', water: 'Eau', electric: 'Électrik',
  grass: 'Plante', ice: 'Glace', fighting: 'Combat', poison: 'Poison',
  ground: 'Sol', flying: 'Vol', psychic: 'Psy', bug: 'Insecte',
  rock: 'Roche', ghost: 'Spectre', dragon: 'Dragon', dark: 'Ténèbres',
  steel: 'Acier', fairy: 'Fée',
};

const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const TYPE_COLOR = {
  fire:'#f97316', water:'#3b82f6', grass:'#22c55e', electric:'#eab308',
  ice:'#67e8f9', fighting:'#dc2626', poison:'#a855f7', ground:'#d97706',
  flying:'#818cf8', psychic:'#ec4899', bug:'#84cc16', rock:'#78716c',
  ghost:'#7c3aed', dragon:'#4f46e5', dark:'#6b7280', steel:'#94a3b8',
  fairy:'#f9a8d4', normal:'#6b7280',
};

export default function TypeFilter({ selectedTypes, toggleType }) {
  const { isDark } = useTheme();
  const { lang } = useLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {TYPES.map((type) => {
        const isActive = selectedTypes.includes(type);
        const color = TYPE_COLOR[type] || '#888';
        const btnBorder = isActive
          ? color + '66'
          : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
        const btnBg = isActive
          ? color + '18'
          : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
        const labelColor = isActive
          ? (isDark ? 'white' : '#111')
          : isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)';

        return (
          <button
            key={type}
            onClick={() => toggleType(type)}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 10px', borderRadius: '9px',
              border: `1px solid ${btnBorder}`,
              background: btnBg,
              cursor: 'pointer', transition: 'all 0.15s', outline: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                background: color,
                boxShadow: isActive ? `0 0 7px ${color}` : 'none',
              }}/>
              <span style={{
                fontSize: '10px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.12em',
                color: labelColor, transition: 'color 0.15s',
              }}>
                {lang === 'fr' ? (TYPE_FR[type] || type) : type}
              </span>
            </div>
            {isActive && (
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }}/>
            )}
          </button>
        );
      })}
    </div>
  );
}
