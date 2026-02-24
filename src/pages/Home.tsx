import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchPokemon, useFetchAllPokemon } from '../hooks/useFetchPokemon';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import PokeList from '../components/pokelist';
import TypeFilter from '../components/title/TypeFilter';
import SearchBar from '../components/title/SearchBar';

const LIMIT = 20;
const TOTAL = 151;
const TOTAL_PAGES = Math.ceil(TOTAL / LIMIT);

// ─── Easter Egg : Mew modal ───────────────────────────────────────────────────
function MewEasterEgg({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)'
            : 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)',
          border: '2px solid rgba(236,72,153,0.5)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '420px',
          width: '90vw',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(236,72,153,0.4), 0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative',
          animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Sparkles */}
        <div style={{ position: 'absolute', top: '16px', left: '20px', fontSize: '20px', animation: 'spin 3s linear infinite' }}>✨</div>
        <div style={{ position: 'absolute', top: '12px', right: '24px', fontSize: '16px', animation: 'spin 2s linear infinite reverse' }}>⭐</div>
        <div style={{ position: 'absolute', bottom: '20px', left: '16px', fontSize: '14px', animation: 'spin 4s linear infinite' }}>💫</div>
        <div style={{ position: 'absolute', bottom: '16px', right: '20px', fontSize: '18px', animation: 'spin 2.5s linear infinite reverse' }}>✨</div>

        <div style={{
          fontSize: '11px', fontWeight: 900, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: 'rgba(236,72,153,0.8)',
          marginBottom: '16px',
        }}>
          🔮 Easter Egg Débloqué !
        </div>

        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png"
          alt="Mew"
          style={{
            width: '180px', height: '180px', objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(236,72,153,0.6))',
            animation: 'float 3s ease-in-out infinite',
          }}
        />

        <h2 style={{
          fontSize: '28px', fontWeight: 900, color: isDark ? 'white' : '#1a1a2e',
          margin: '16px 0 8px', letterSpacing: '0.05em',
          textShadow: isDark ? '0 0 20px rgba(236,72,153,0.6)' : 'none',
        }}>
          MEW est apparu !
        </h2>

        <p style={{
          fontSize: '13px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          lineHeight: 1.6, marginBottom: '24px',
        }}>
          Tu as découvert le secret de Pikachu ! 🌟<br/>
          Mew, le Pokémon originel, contient le code génétique<br/>
          de tous les Pokémon existants.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: '12px 32px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            border: 'none', color: 'white',
            fontSize: '12px', fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(236,72,153,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(236,72,153,0.6)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(236,72,153,0.4)';
          }}
        >
          Incroyable ! ✨
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5) rotate(-5deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Easter Egg : Music Banner ────────────────────────────────────────────────
function MusicBanner({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9998,
      background: isDark
        ? 'linear-gradient(135deg, #1a2a1a, #0f3020)'
        : 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
      border: '1px solid rgba(34,197,94,0.4)',
      borderRadius: '16px',
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: '14px',
      boxShadow: '0 8px 32px rgba(34,197,94,0.3), 0 2px 8px rgba(0,0,0,0.4)',
      animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      minWidth: '300px', maxWidth: '90vw',
    }}>
      {/* Notes musicales animées */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        background: 'rgba(34,197,94,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', flexShrink: 0,
        animation: 'spin 2s linear infinite',
      }}>
        🎵
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '11px', fontWeight: 900, color: '#22c55e',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          marginBottom: '2px',
        }}>
          🎶 Easter Egg Musical !
        </div>
        <div style={{
          fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)',
          fontWeight: 600,
        }}>
          30 secondes sur la page — thème Pokémon Rouge/Bleu ! 🎮
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          width: '28px', height: '28px', borderRadius: '50%',
          border: '1px solid rgba(34,197,94,0.4)',
          background: 'rgba(34,197,94,0.1)',
          color: '#22c55e', fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontWeight: 900,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.25)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.1)')}
      >
        ×
      </button>
    </div>
  );
}

// ─── Traduction d'erreur HTTP ─────────────────────────────────────────────────
function translateError(err: string | null, lang: string): string | null {
  if (!err) return null;
  if (err.includes('404')) return lang === 'fr' ? 'Pokémon introuvable (erreur 404).' : 'Pokémon not found (error 404).';
  if (err.includes('429')) return lang === 'fr' ? 'Trop de requêtes — attends un instant (erreur 429).' : 'Too many requests — please wait (error 429).';
  if (err.includes('500')) return lang === 'fr' ? 'Erreur serveur, réessaie plus tard (erreur 500).' : 'Server error, try again later (error 500).';
  if (err.includes('Network') || err.includes('connexion') || err.includes('network'))
    return lang === 'fr' ? 'Problème de connexion. Vérifie ton réseau.' : 'Connection error. Check your network.';
  return lang === 'fr' ? 'Erreur de chargement. Réessaie.' : 'Loading error. Please try again.';
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { isDark } = useTheme();
  const { lang, t } = useLang();

  // Redirect vers l'intro si c'est le premier lancement
  useEffect(() => {
    if (!localStorage.getItem('pokedex-hasSeenIntro')) {
      navigate('/intro');
    }
  }, []);

  // ── Easter Egg states ──
  const [pikachuClicks, setPikachuClicks] = useState(0);
  const [showMew, setShowMew] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const musicShownRef = useRef(false);
  const musicAudio = useRef<HTMLAudioElement | null>(null);
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFiltering = selectedTypes.length > 0;

  const offset = (page - 1) * LIMIT;
  const { pokemons: pagedPokemons, loading: pagedLoading, error: pagedError } = useFetchPokemon(offset, LIMIT);
  const { allPokemons, loading: allLoading, error: allError } = useFetchAllPokemon();

  const pokemons = isFiltering ? allPokemons : pagedPokemons;
  const loading  = isFiltering ? allLoading  : pagedLoading;
  const rawError = isFiltering ? allError    : pagedError;
  const error    = translateError(rawError, lang);

  const bg          = isDark ? '#080808' : '#f4f4f4';
  const sidebarBg   = isDark ? '#0d0d0d' : '#ebebeb';
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const textColor   = isDark ? 'white' : '#111';
  const mutedColor  = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)';

  // ── Pikachu click handler (appelé par PokeCard) ──
  const handlePikachuClick = useCallback(() => {
    setPikachuClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowMew(true);
        // Réinitialise après déclenchement
        if (clickTimeout.current) clearTimeout(clickTimeout.current);
        return 0;
      }
      // Reset auto après 3 secondes sans clic
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      clickTimeout.current = setTimeout(() => setPikachuClicks(0), 3000);
      return next;
    });
  }, []);

  // Expose le handler globalement pour PokeCard
  useEffect(() => {
    (window as any).__pikachuClickHandler = handlePikachuClick;
    return () => { delete (window as any).__pikachuClickHandler; };
  }, [handlePikachuClick]);

  // ── Easter Egg sonore : 30 secondes sur la page ──
  useEffect(() => {
    if (musicShownRef.current) return;
    const timer = setTimeout(() => {
      if (musicShownRef.current) return;
      musicShownRef.current = true;
      setShowMusic(true);
      // Joue le thème d'intro Pokémon (Welcome to the world of Pokémon)
      const audio = new Audio('https://ia802905.us.archive.org/28/items/PokemonRedBlueGBSoundtrack/01%20-%20Title%20Screen.mp3');
      audio.volume = 0.35;
      audio.play().catch(() => {}); // Ignore les erreurs autoplay
      musicAudio.current = audio;
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Stop la musique quand on ferme le banner
  const handleCloseMusicBanner = () => {
    setShowMusic(false);
    if (musicAudio.current) {
      musicAudio.current.pause();
      musicAudio.current = null;
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filtered = pokemons.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every(sel => p.types.some(tp => tp.type.name.toLowerCase() === sel));
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg }}>

      {/* Easter Egg : Mew */}
      {showMew && <MewEasterEgg onClose={() => setShowMew(false)} isDark={isDark} />}

      {/* Easter Egg : Music Banner */}
      {showMusic && <MusicBanner onClose={handleCloseMusicBanner} isDark={isDark} />}

      {/* Indicateur de progression Easter Egg Pikachu (subtil) */}
      {pikachuClicks > 0 && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 999,
          background: isDark ? 'rgba(20,20,20,0.9)' : 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(251,191,36,0.4)',
          borderRadius: '12px', padding: '8px 14px',
          fontSize: '11px', fontWeight: 900, color: '#fbbf24',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(251,191,36,0.3)',
          letterSpacing: '0.05em',
          animation: 'popIn 0.2s ease',
          pointerEvents: 'none',
        }}>
          ⚡ {pikachuClicks}/5
        </div>
      )}

      {/* ═══════════════════════════════════
          SIDEBAR
      ═══════════════════════════════════ */}
      <aside style={{
        width: '210px',
        flexShrink: 0,
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo sidebar */}
        <div style={{
          padding: '24px 16px 20px',
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2"/>
              <path d="M2 12h20" stroke="#dc2626" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="#dc2626"/>
            </svg>
            <span style={{ fontSize: '11px', fontWeight: 900, color: textColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Pokédex
            </span>
          </div>
          <p style={{ fontSize: '8px', color: mutedColor, fontWeight: 600, letterSpacing: '0.1em', marginTop: '2px' }}>
            GEN I · 151 Pokémon
          </p>
        </div>

        {/* Filtres */}
        <div style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              ◈ {lang === 'fr' ? 'Types' : 'Types'}
            </span>
            {selectedTypes.length > 0 && (
              <button
                onClick={() => setSelectedTypes([])}
                style={{
                  padding: '2px 8px', borderRadius: '6px',
                  border: '1px solid rgba(220,38,38,0.4)',
                  background: 'rgba(220,38,38,0.12)', color: '#dc2626',
                  fontSize: '8px', fontWeight: 900, cursor: 'pointer',
                  letterSpacing: '0.05em',
                }}
              >
                {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
              </button>
            )}
          </div>
          <TypeFilter selectedTypes={selectedTypes} toggleType={toggleType} />
        </div>

        {/* Footer sidebar */}
        {!isFiltering && (
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${borderColor}` }}>
            <p style={{ fontSize: '8px', color: mutedColor, textAlign: 'center', letterSpacing: '0.05em' }}>
              {lang === 'fr' ? 'Page' : 'Page'} {page} / {TOTAL_PAGES}
            </p>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR */}
        <div style={{
          padding: '28px 40px 24px',
          borderBottom: `1px solid ${borderColor}`,
          marginBottom: '32px',
        }}>
          {/* Titre */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0', marginBottom: '6px' }}>
            <h1 style={{
              fontSize: '52px', fontWeight: 900, color: textColor,
              textTransform: 'uppercase', fontStyle: 'italic',
              letterSpacing: '-0.05em', lineHeight: 1, margin: 0,
            }}>
              Pokédex&nbsp;
            </h1>
            <span style={{
              fontSize: '52px', fontWeight: 900, color: '#dc2626',
              textTransform: 'uppercase', fontStyle: 'italic',
              letterSpacing: '-0.05em', lineHeight: 1,
            }}>
              TCG
            </span>
          </div>

          {/* Sous-titre + stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <p style={{
              fontSize: '10px', color: mutedColor, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0,
            }}>
              {lang === 'fr' ? 'Génération I · 151 Pokémon' : 'Generation I · 151 Pokémon'}
            </p>
            {selectedTypes.length > 0 && (
              <span style={{
                padding: '2px 10px', borderRadius: '20px',
                background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)',
                color: '#dc2626', fontSize: '9px', fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                {filtered.length} {lang === 'fr' ? `résultat${filtered.length !== 1 ? 's' : ''}` : `result${filtered.length !== 1 ? 's' : ''}`}
              </span>
            )}
            {searchTerm && (
              <span style={{
                padding: '2px 10px', borderRadius: '20px',
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                color: mutedColor, fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.05em',
              }}>
                "{searchTerm}"
              </span>
            )}
          </div>

          {/* SearchBar */}
          <div style={{ maxWidth: '520px' }}>
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
        </div>

        {/* ──── Erreur HTTP ──── */}
        {error && (
          <div style={{
            margin: '0 40px 24px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.3)',
            color: '#ef4444',
            fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            {error}
          </div>
        )}

        {/* ──── GRILLE POKÉMONS ──── */}
        <div style={{ padding: '0 40px', flex: 1 }}>
          <PokeList pokemons={filtered} loading={loading} error={null} />
        </div>

        {/* ──── PAGINATION ──── */}
        {!loading && !rawError && !isFiltering && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '6px', padding: '48px 40px 40px',
          }}>
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
              disabled={page === 1}
              style={{
                padding: '9px 20px', borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                color: textColor,
                fontSize: '10px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.1em', cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.25 : 0.8,
                transition: 'opacity 0.2s',
              }}
            >
              ← {lang === 'fr' ? 'Préc.' : 'Prev.'}
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid',
                    borderColor: p === page ? '#dc2626' : borderColor,
                    background: p === page
                      ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                    color: p === page ? 'white' : mutedColor,
                    fontSize: '11px', fontWeight: 900, cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: p === page ? '0 2px 12px rgba(220,38,38,0.4)' : 'none',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setPage(p => Math.min(TOTAL_PAGES, p + 1)); window.scrollTo(0, 0); }}
              disabled={page === TOTAL_PAGES}
              style={{
                padding: '9px 20px', borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                color: textColor,
                fontSize: '10px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: page === TOTAL_PAGES ? 'not-allowed' : 'pointer',
                opacity: page === TOTAL_PAGES ? 0.25 : 0.8,
                transition: 'opacity 0.2s',
              }}
            >
              {lang === 'fr' ? 'Suiv.' : 'Next'} →
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5) rotate(-5deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
