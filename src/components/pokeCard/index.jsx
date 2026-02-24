import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../../hooks/useAudio';
import { usePokemon } from '../../hooks/usePokemon';
import { useTheme } from '../../context/ThemeContext';

const TYPE_GLOW = {
  fire:'#f97316',water:'#3b82f6',grass:'#22c55e',electric:'#eab308',
  ice:'#67e8f9',fighting:'#dc2626',poison:'#a855f7',ground:'#d97706',
  flying:'#818cf8',psychic:'#ec4899',bug:'#84cc16',rock:'#78716c',
  ghost:'#7c3aed',dragon:'#4f46e5',dark:'#9ca3af',steel:'#94a3b8',
  fairy:'#f9a8d4',normal:'#9ca3af',
};

const TYPE_BG_DARK = {
  fire:'rgba(249,115,22,0.13)',water:'rgba(59,130,246,0.13)',grass:'rgba(34,197,94,0.13)',
  electric:'rgba(234,179,8,0.13)',ice:'rgba(103,232,249,0.13)',fighting:'rgba(220,38,38,0.13)',
  poison:'rgba(168,85,247,0.13)',ground:'rgba(217,119,6,0.13)',flying:'rgba(129,140,248,0.13)',
  psychic:'rgba(236,72,153,0.13)',bug:'rgba(132,204,22,0.13)',rock:'rgba(120,113,108,0.13)',
  ghost:'rgba(124,58,237,0.13)',dragon:'rgba(79,70,229,0.13)',dark:'rgba(107,84,72,0.13)',
  steel:'rgba(148,163,184,0.13)',fairy:'rgba(249,168,212,0.13)',normal:'rgba(156,163,175,0.13)',
};

const TYPE_BG_LIGHT = {
  fire:'rgba(249,115,22,0.08)',water:'rgba(59,130,246,0.08)',grass:'rgba(34,197,94,0.08)',
  electric:'rgba(234,179,8,0.08)',ice:'rgba(103,232,249,0.1)',fighting:'rgba(220,38,38,0.08)',
  poison:'rgba(168,85,247,0.08)',ground:'rgba(217,119,6,0.08)',flying:'rgba(129,140,248,0.08)',
  psychic:'rgba(236,72,153,0.08)',bug:'rgba(132,204,22,0.08)',rock:'rgba(120,113,108,0.08)',
  ghost:'rgba(124,58,237,0.08)',dragon:'rgba(79,70,229,0.08)',dark:'rgba(107,84,72,0.08)',
  steel:'rgba(148,163,184,0.08)',fairy:'rgba(249,168,212,0.1)',normal:'rgba(156,163,175,0.08)',
};

export default function PokeCard({ pokemon }) {
  const { play, isPlaying } = useAudio(pokemon.cries?.latest);
  const { toggleFavorite, isFavorite } = usePokemon();
  const { isDark } = useTheme();
  const favorite = isFavorite(pokemon.id);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const imageUrl = pokemon.customImage || pokemon.sprites?.other?.['official-artwork']?.front_default;
  const mainType = pokemon.types[0].type.name;
  const glowColor = TYPE_GLOW[mainType] || '#ffffff';
  const bgColor = isDark
    ? (TYPE_BG_DARK[mainType] || 'rgba(255,255,255,0.05)')
    : (TYPE_BG_LIGHT[mainType] || 'rgba(0,0,0,0.03)');

  const cardBg = isDark
    ? `linear-gradient(170deg, ${bgColor} 0%, rgba(6,6,6,0.98) 50%)`
    : `linear-gradient(170deg, ${bgColor} 0%, rgba(250,250,250,0.98) 50%)`;
  // Contour permanent couleur du type (plus visible au hover)
  const cardBorder = hovered
    ? glowColor + 'cc'
    : glowColor + '55';
  const namColor = isDark ? 'white' : '#111';
  const idColor = isDark ? (hovered ? glowColor + 'dd' : 'rgba(255,255,255,0.15)') : (hovered ? glowColor : 'rgba(0,0,0,0.18)');
  const moveColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)';
  const moveBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const moveBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const btnBg = isPlaying ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)');
  const btnColor = isDark ? 'white' : '#333';

  // 3 premières attaques
  const moves = (pokemon.moves || []).slice(0, 3).map(m => m.move?.name?.replace(/-/g, ' ') || '');

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTilt({
      x: ((y - rect.height / 2) / (rect.height / 2)) * -9,
      y: ((x - rect.width / 2) / (rect.width / 2)) * 9,
    });
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        aspectRatio: '2/3',
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: hovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: hovered ? 'transform 0.08s ease-out, box-shadow 0.2s' : 'transform 0.5s ease, box-shadow 0.4s',
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.55), 0 0 30px ${glowColor}55`
          : `0 6px 24px rgba(0,0,0,0.35), 0 0 12px ${glowColor}22`,
        cursor: 'pointer',
      }}
    >
      {/* ── Fond ── */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '18px',
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        transition: 'border-color 0.3s',
      }}/>

      {/* ── Reflet holographique ── */}
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '18px',
          pointerEvents: 'none', zIndex: 10,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}44 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}/>
      )}

      {/* ── Contenu ── */}
      <div style={{
        position: 'relative', zIndex: 20, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', padding: '10px 10px 8px',
      }}>

        {/* ── ZONE HAUTE (~38%) : numéro + image ── */}
        <div style={{ flex: '0 0 38%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>

          {/* Numéro + favori */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
            <span style={{
              fontSize: '20px', fontWeight: 900, color: idColor,
              letterSpacing: '-0.03em', lineHeight: 1, fontStyle: 'italic',
              transition: 'color 0.3s',
            }}>
              #{String(pokemon.id).padStart(3, '0')}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorite(pokemon.id); }}
              style={{ fontSize: '13px', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '1px' }}
            >
              {favorite ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Image — occupe le reste de la zone haute */}
          <Link
            to={`/pokemon/${pokemon.id}`}
            onClick={() => {
              // Easter Egg : 5 clics sur Pikachu → Mew apparaît
              if (pokemon.id === 25 && typeof window.__pikachuClickHandler === 'function') {
                window.__pikachuClickHandler();
              }
            }}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textDecoration: 'none', minHeight: 0 }}
          >
            <img
              src={imageUrl}
              alt={pokemon.name}
              style={{
                maxWidth: '80%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: hovered
                  ? `drop-shadow(0 0 16px ${glowColor}cc)`
                  : isDark ? 'drop-shadow(0 8px 18px rgba(0,0,0,0.9))' : 'drop-shadow(0 6px 14px rgba(0,0,0,0.25))',
                transition: 'filter 0.3s ease, transform 0.3s ease',
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
              }}
              loading="lazy"
            />
          </Link>
        </div>

        {/* ── SÉPARATEUR ── */}
        <div style={{ height: '1px', background: dividerColor, margin: '6px 0' }}/>

        {/* ── ZONE BASSE (~58%) : nom + types + attaques + son ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>

          {/* Nom */}
          <h3 style={{
            fontSize: '13px', fontWeight: 900, color: namColor,
            textTransform: 'capitalize', textAlign: 'center',
            marginBottom: '5px', letterSpacing: '0.01em', flexShrink: 0,
          }}>
            {pokemon.name}
          </h3>

          {/* Types */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '7px', flexShrink: 0 }}>
            {pokemon.types.map((t) => (
              <span key={t.type.name} style={{
                padding: '2px 8px', borderRadius: '5px',
                fontSize: '8px', fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.08em', color: 'white',
                background: (TYPE_GLOW[t.type.name] || '#888') + '99',
                border: `1px solid ${(TYPE_GLOW[t.type.name] || '#888') + '55'}`,
              }}>
                {t.type.name}
              </span>
            ))}
          </div>

          {/* ── ATTAQUES ── */}
          {moves.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              <p style={{
                fontSize: '8px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.15em', color: glowColor, marginBottom: '2px', flexShrink: 0,
              }}>
                ◈ Attaques
              </p>
              {moves.map((move, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '5px 8px', borderRadius: '8px',
                  background: moveBg, border: `1px solid ${moveBorder}`,
                  flex: 1, minHeight: 0,
                }}>
                  {/* Pastille couleur type */}
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: glowColor,
                    boxShadow: hovered ? `0 0 5px ${glowColor}` : 'none',
                  }}/>
                  <span style={{
                    fontSize: '9px', fontWeight: 700, color: moveColor,
                    textTransform: 'capitalize', letterSpacing: '0.02em',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {move}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Son ── */}
          {pokemon.cries?.latest && (
            <button
              onClick={(e) => { e.preventDefault(); play(); }}
              style={{
                width: '100%', padding: '5px 0', borderRadius: '8px', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '5px', marginTop: '6px', flexShrink: 0,
                fontSize: '8px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: btnColor,
                background: btnBg, transition: 'background 0.2s',
              }}
            >
              <svg style={{ width: '9px', height: '9px' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a.5.5 0 0 0-.84-.37L5.83 6H3.5A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h2.33l3.33 2.87a.5.5 0 0 0 .84-.37v-13z"/>
              </svg>
              {isPlaying ? '♪ En cours' : '♪ Son'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
