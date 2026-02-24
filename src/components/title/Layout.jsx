import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';

// ── Pokéball Logo SVG ──────────────────────────────────────────────────────────
function PokedexLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill="#e53e3e"/>
      <path d="M2 50 Q2 98 50 98 Q98 98 98 50 Z" fill="white"/>
      <rect x="2" y="44" width="96" height="12" fill="#1a202c"/>
      <circle cx="50" cy="50" r="14" fill="#1a202c" stroke="#4a5568" strokeWidth="2"/>
      <circle cx="50" cy="50" r="9" fill="white"/>
      <circle cx="46" cy="46" r="2.5" fill="rgba(255,255,255,0.6)"/>
    </svg>
  );
}

// ── Icônes nav ─────────────────────────────────────────────────────────────────
const HomeIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
const PokedexIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>;
const FavIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const BattleIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const TrophyIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5v4a6 6 0 0 0 12 0V5H6z"/></svg>;
const SunIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;

const NAV_KEYS = [
  { to: '/', labelKey: 'nav.pokedex', Icon: PokedexIcon, match: (p) => p === '/' || p.startsWith('/pokemon') },
  { to: '/favorites', labelKey: 'nav.favorites', Icon: FavIcon, match: (p) => p === '/favorites' },
  { to: '/battle', labelKey: 'nav.battle', Icon: BattleIcon, match: (p) => p === '/battle' },
  { to: '/daily', labelKey: 'nav.daily', Icon: TrophyIcon, match: (p) => p === '/daily', badge: true },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();

  const bg          = isDark ? '#080808' : '#f4f4f4';
  const navBg       = isDark ? 'rgba(8,8,8,0.96)' : 'rgba(255,255,255,0.97)';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.09)';
  const textColor   = isDark ? 'white' : '#111111';
  const mutedColor  = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.32)';

  return (
    <div style={{ minHeight: '100vh', background: bg, transition: 'background 0.3s' }}>

      {/* ══ NAV ══════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: navBg, backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`,
      }}>
        <div style={{
          maxWidth: '1600px', margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', height: '58px',
        }}>
          {/* Logo Pokéball */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: '48px', display: 'flex', alignItems: 'center' }}>
            <PokedexLogo size={34} />
          </Link>

          {/* Nav items centrés */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '58px', flex: 1, justifyContent: 'center', gap: '4px' }}>
            {NAV_KEYS.map(({ to, labelKey, Icon, match, badge }) => {
              const active = match(location.pathname);
              const navLabels = {
                'nav.pokedex': 'Pokédex',
                'nav.favorites': lang === 'fr' ? 'Favoris' : 'Favorites',
                'nav.battle': lang === 'fr' ? 'Combat' : 'Battle',
                'nav.daily': lang === 'fr' ? 'Défi du Jour' : 'Daily Challenge',
              };
              const label = navLabels[labelKey] || labelKey;
              return (
                <Link
                  key={labelKey}
                  to={to}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '3px',
                    padding: '0 24px', textDecoration: 'none',
                    color: active ? '#dc2626' : mutedColor,
                    fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    borderBottom: active ? '3px solid #dc2626' : '3px solid transparent',
                    borderTop: '3px solid transparent',
                    transition: 'color 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = textColor; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = mutedColor; }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon />
                    {badge && (
                      <span style={{
                        position: 'absolute', top: '-5px', right: '-8px',
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#f97316',
                        boxShadow: '0 0 6px #f97316',
                      }}/>
                    )}
                  </div>
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Boutons droite : langue + thème */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>

            {/* Toggle langue FR/EN */}
            <button
              onClick={toggleLang}
              title={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '0 10px', height: '34px', borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                color: textColor, cursor: 'pointer',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>
                {lang === 'fr' ? '🇫🇷' : '🇬🇧'}
              </span>
              <span style={{ color: mutedColor }}>
                {lang === 'fr' ? 'FR' : 'EN'}
              </span>
            </button>

            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Mode jour' : 'Mode nuit'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '34px', height: '34px', borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                color: isDark ? '#fbbf24' : '#6366f1',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Bande arc-en-ciel sous le nav */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg,#ef4444 0%,#f97316 14%,#eab308 28%,#22c55e 42%,#3b82f6 57%,#8b5cf6 71%,#ec4899 85%,#ef4444 100%)',
        }}/>
      </nav>

      <main style={{ color: textColor }}>{children}</main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${borderColor}`, padding: '24px', marginTop: '48px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Données :{' '}
            <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', textDecoration: 'none' }}>PokéAPI</a>
            {' · '}
            <a href="https://tcgdex.net" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', textDecoration: 'none' }}>TCGdex</a>
          </p>
          <p style={{ fontSize: '9px', marginTop: '4px', color: mutedColor }}>Pokédex TCG © 2026</p>
        </div>
      </footer>
    </div>
  );
}
