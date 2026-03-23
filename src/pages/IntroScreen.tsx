import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useTheme } from '../context/ThemeContext';

// ── Starters ──────────────────────────────────────────────────────────────────
const STARTERS = [
  { id: 1,  name: 'Bulbizarre', nameEN: 'Bulbasaur',  type: 'grass',   color: '#22c55e', emoji: '🌿' },
  { id: 4,  name: 'Salamèche', nameEN: 'Charmander', type: 'fire',    color: '#f97316', emoji: '🔥' },
  { id: 7,  name: 'Carapuce',  nameEN: 'Squirtle',   type: 'water',   color: '#3b82f6', emoji: '💧' },
];
const PIKACHU = { id: 25, name: 'Pikachu', nameEN: 'Pikachu', type: 'electric', color: '#eab308', emoji: '⚡' };

// ── Dialogues ─────────────────────────────────────────────────────────────────
const DIALOGS_FR = [
  'Bienvenue dans le monde des Pokémon !',
  'Je suis le Professeur Chen, spécialiste des relations entre les humains et les Pokémon.',
  'Ces créatures mystérieuses peuplent notre monde en grand nombre...',
  'Ta propre aventure est sur le point de commencer !',
  'Mais d\'abord... choisis le Pokémon qui t\'accompagnera !',
];
const DIALOGS_EN = [
  'Welcome to the world of Pokémon!',
  'My name is Professor Oak. People call me the Pokémon Professor!',
  'This world is inhabited by creatures called Pokémon...',
  'For some people, Pokémon are pets. Others use them for fights.',
  'But now... it is time to choose your first partner!',
];

const ARTWORK = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// ── Carte Starter ─────────────────────────────────────────────────────────────
function StarterCard({
  pokemon, selected, onSelect, revealed, lang
}: {
  pokemon: typeof STARTERS[0] | null;
  selected: boolean;
  onSelect: () => void;
  revealed: boolean;
  lang: string;
}) {
  const [hovered, setHovered] = useState(false);
  const isSecret = !pokemon;

  const color = pokemon?.color || '#6b7280';
  const name  = pokemon ? (lang === 'fr' ? pokemon.name : pokemon.nameEN) : '???';

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '160px',
        borderRadius: '20px',
        border: selected
          ? `3px solid ${color}`
          : hovered
          ? `2px solid ${color}88`
          : '2px solid rgba(255,255,255,0.1)',
        background: selected
          ? `linear-gradient(135deg, ${color}33 0%, rgba(10,10,46,0.95) 100%)`
          : hovered
          ? `linear-gradient(135deg, ${color}18 0%, rgba(10,10,46,0.9) 100%)`
          : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: selected ? 'scale(1.07)' : hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: selected
          ? `0 8px 32px ${color}55, 0 0 0 1px ${color}33`
          : hovered
          ? `0 4px 20px ${color}30`
          : '0 2px 8px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}
    >
      {/* Glow de fond */}
      {(selected || hovered) && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '18px',
          background: `radial-gradient(circle at 50% 40%, ${color}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}/>
      )}

      {/* Image Pokémon */}
      <div style={{
        width: '110px', height: '110px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {isSecret && !revealed ? (
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '2px dashed rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', color: 'rgba(255,255,255,0.3)',
            fontWeight: 900, letterSpacing: '0.1em',
          }}>
            ???
          </div>
        ) : (
          <img
            src={ARTWORK(pokemon?.id || PIKACHU.id)}
            alt={name}
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              filter: selected
                ? `drop-shadow(0 0 16px ${color}cc)`
                : hovered
                ? `drop-shadow(0 0 10px ${color}88)`
                : 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
              transition: 'filter 0.3s ease',
              animation: selected ? 'floatCard 2s ease-in-out infinite' : 'none',
            }}
          />
        )}
      </div>

      {/* Nom */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: isSecret && !revealed ? '18px' : '14px',
          fontWeight: 900,
          color: isSecret && !revealed ? 'rgba(255,255,255,0.25)' : 'white',
          textTransform: 'capitalize',
          letterSpacing: '0.05em',
          margin: 0,
          fontFamily: isSecret && !revealed ? 'monospace' : 'inherit',
        }}>
          {isSecret && !revealed ? '???' : name}
        </p>
        {pokemon && (
          <p style={{
            fontSize: '10px', color: color, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.15em',
            marginTop: '4px',
          }}>
            {pokemon.emoji} {lang === 'fr'
              ? { grass: 'Plante', fire: 'Feu', water: 'Eau', electric: 'Électrik' }[pokemon.type]
              : { grass: 'Grass', fire: 'Fire', water: 'Water', electric: 'Electric' }[pokemon.type]
            }
          </p>
        )}
      </div>

      {/* Check sélection */}
      {selected && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          width: '22px', height: '22px', borderRadius: '50%',
          background: color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '12px', fontWeight: 900,
          boxShadow: `0 0 10px ${color}`,
        }}>
          ✓
        </div>
      )}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function IntroScreen() {
  const navigate    = useNavigate();
  const { lang }    = useLang();
  const { isDark }  = useTheme();

  const dialogs = lang === 'fr' ? DIALOGS_FR : DIALOGS_EN;

  const [step, setStep]                 = useState<'dialog' | 'choice'>('dialog');
  const [dialogIndex, setDialogIndex]   = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [textDone, setTextDone]         = useState(false);
  const [selectedStarter, setSelectedStarter] = useState<typeof STARTERS[0] | typeof PIKACHU | null>(null);
  const [pikachuRevealed, setPikachuRevealed] = useState(false);
  const [leaving, setLeaving]           = useState(false);
  const [showCursor, setShowCursor]     = useState(true);

  const typingRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const charRef    = useRef(0);
  const autoRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clignotement curseur
  useEffect(() => {
    cursorRef.current = setInterval(() => setShowCursor(v => !v), 530);
    return () => { if (cursorRef.current) clearInterval(cursorRef.current); };
  }, []);

  // Effet machine à écrire
  const startTyping = useCallback((text: string) => {
    if (typingRef.current) clearInterval(typingRef.current);
    if (autoRef.current) clearTimeout(autoRef.current);
    charRef.current = 0;
    setDisplayedText('');
    setTextDone(false);

    typingRef.current = setInterval(() => {
      charRef.current += 1;
      setDisplayedText(text.slice(0, charRef.current));
      if (charRef.current >= text.length) {
        if (typingRef.current) clearInterval(typingRef.current);
        setTextDone(true);
        // Auto-avance après 1.2s sur le dernier dialogue, 800ms sinon
        const isLast = dialogIndex >= dialogs.length - 1;
        if (!isLast) {
          autoRef.current = setTimeout(() => advanceDialog(), 1100);
        }
      }
    }, 42);
  }, [dialogIndex, dialogs.length]);

  // Lance le typing quand dialogIndex change
  useEffect(() => {
    if (step === 'dialog') {
      startTyping(dialogs[dialogIndex]);
    }
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [dialogIndex, step]);

  const advanceDialog = useCallback(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    const isLast = dialogIndex >= dialogs.length - 1;
    if (!textDone) {
      // Compléter le texte instantanément
      if (typingRef.current) clearInterval(typingRef.current);
      setDisplayedText(dialogs[dialogIndex]);
      setTextDone(true);
      if (!isLast) autoRef.current = setTimeout(() => advanceDialog(), 900);
      return;
    }
    if (isLast) {
      setStep('choice');
    } else {
      setDialogIndex(i => i + 1);
    }
  }, [dialogIndex, dialogs, textDone]);

  const handleStart = () => {
    if (!selectedStarter) return;
    setLeaving(true);
    localStorage.setItem('pokedex-hasSeenIntro', 'true');
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div
      onClick={step === 'dialog' ? advanceDialog : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'linear-gradient(180deg, #050518 0%, #0a0a2e 35%, #111840 70%, #0d1b2a 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: leaving ? 'fadeOut 0.6s ease forwards' : 'none',
        cursor: step === 'dialog' ? 'pointer' : 'default',
      }}
    >
      {/* ── Scanlines overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
      }}/>

      {/* ── Étoiles animées ── */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.sin(i * 127.1) * 50 + 50}%`,
          top: `${Math.sin(i * 311.3) * 50 + 50}%`,
          width: i % 5 === 0 ? '3px' : '2px',
          height: i % 5 === 0 ? '3px' : '2px',
          borderRadius: '50%',
          background: 'white',
          opacity: 0.15 + (i % 4) * 0.1,
          animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i * 0.3) % 2}s infinite alternate`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* ── Corps central ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: '900px',
        padding: '0 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '32px',
      }}>

        {/* ── Logo Pokédex ── */}
        <div style={{
          textAlign: 'center',
          animation: 'fadeInDown 0.8s ease',
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 900, letterSpacing: '0.5em',
            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
            marginBottom: '8px', fontFamily: 'monospace',
          }}>
            ◆ POKÉDEX TCG ◆
          </div>
          <h1 style={{
            fontSize: '56px', fontWeight: 900, margin: 0, lineHeight: 1,
            background: 'linear-gradient(135deg, #ffffff 30%, #fbbf24 60%, #dc2626 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            textTransform: 'uppercase', letterSpacing: '-0.03em',
            fontStyle: 'italic',
            filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.4))',
            animation: 'glowPulse 3s ease-in-out infinite',
          }}>
            Pokémon
          </h1>
          <div style={{
            width: '120px', height: '2px', margin: '12px auto 0',
            background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
            animation: 'expandLine 1s ease 0.5s both',
          }}/>
        </div>

        {/* ── Zone Professeur (visible pendant les dialogues) ── */}
        {step === 'dialog' && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            animation: 'fadeInUp 0.6s ease',
          }}>
            {/* Avatar Professeur */}
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(220,38,38,0.15))',
              border: '2px solid rgba(251,191,36,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '42px', marginBottom: '0px',
              boxShadow: '0 0 30px rgba(251,191,36,0.2)',
              animation: 'float 4s ease-in-out infinite',
            }}>
              👨‍🔬
            </div>
            <div style={{
              fontSize: '9px', fontWeight: 900, color: 'rgba(251,191,36,0.6)',
              textTransform: 'uppercase', letterSpacing: '0.25em',
              fontFamily: 'monospace', marginTop: '6px',
            }}>
              {lang === 'fr' ? 'Pr. Chen' : 'Prof. Oak'}
            </div>
          </div>
        )}

        {/* ── Zone starters (visible pendant le choix) ── */}
        {step === 'choice' && (
          <div style={{
            display: 'flex', gap: '16px', alignItems: 'center',
            justifyContent: 'center', flexWrap: 'wrap',
            animation: 'fadeInUp 0.5s ease',
          }}>
            {STARTERS.map(s => (
              <StarterCard
                key={s.id}
                pokemon={s}
                selected={selectedStarter?.id === s.id}
                onSelect={() => setSelectedStarter(selectedStarter?.id === s.id ? null : s)}
                revealed={true}
                lang={lang}
              />
            ))}
            {/* Carte secrète Pikachu */}
            <div
              onMouseEnter={() => setPikachuRevealed(true)}
              onMouseLeave={() => !selectedStarter || selectedStarter.id !== PIKACHU.id ? null : undefined}
            >
              <StarterCard
                pokemon={pikachuRevealed ? PIKACHU : null}
                selected={selectedStarter?.id === PIKACHU.id}
                onSelect={() => setSelectedStarter(selectedStarter?.id === PIKACHU.id ? null : PIKACHU)}
                revealed={pikachuRevealed}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ── Bouton "Commencer" (après choix de starter) ── */}
        {step === 'choice' && selectedStarter && (
          <button
            onClick={handleStart}
            style={{
              padding: '14px 48px', borderRadius: '14px', border: 'none',
              background: `linear-gradient(135deg, ${selectedStarter.color}, ${selectedStarter.color}99)`,
              color: 'white', fontSize: '14px', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer',
              boxShadow: `0 6px 30px ${selectedStarter.color}55`,
              animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = `0 10px 40px ${selectedStarter.color}77`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 6px 30px ${selectedStarter.color}55`;
            }}
          >
            {selectedStarter.emoji} {lang === 'fr' ? 'Commencer l\'aventure !' : 'Start the adventure!'}
          </button>
        )}
      </div>

      {/* ══════════════════════════════════
          BOÎTE DE DIALOGUE (bas d'écran)
      ══════════════════════════════════ */}
      {step === 'dialog' && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 3,
          padding: '20px 32px 28px',
          background: 'linear-gradient(0deg, rgba(5,5,24,0.98) 0%, rgba(10,10,46,0.94) 100%)',
          borderTop: '2px solid rgba(59,130,246,0.4)',
          backdropFilter: 'blur(12px)',
          animation: 'fadeInUp 0.5s ease',
        }}>
          {/* Barre de progression dialogues */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', justifyContent: 'flex-end' }}>
            {dialogs.map((_, i) => (
              <div key={i} style={{
                width: i <= dialogIndex ? '20px' : '8px',
                height: '4px', borderRadius: '2px',
                background: i < dialogIndex
                  ? 'rgba(59,130,246,0.8)'
                  : i === dialogIndex
                  ? '#3b82f6'
                  : 'rgba(255,255,255,0.12)',
                transition: 'all 0.3s ease',
              }}/>
            ))}
          </div>

          {/* Texte dialogue */}
          <p style={{
            fontSize: '17px',
            fontWeight: 600,
            color: 'white',
            fontFamily: '"Courier New", monospace',
            lineHeight: 1.65,
            margin: 0,
            minHeight: '52px',
            letterSpacing: '0.02em',
            maxWidth: '820px',
          }}>
            {displayedText}
            {!textDone && (
              <span style={{ opacity: showCursor ? 1 : 0, color: '#3b82f6' }}>▌</span>
            )}
          </p>

          {/* Hint "Cliquer pour continuer" */}
          {textDone && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginTop: '10px',
              animation: 'bounce 1s ease-in-out infinite',
            }}>
              <span style={{
                fontSize: '10px', fontWeight: 700,
                color: 'rgba(59,130,246,0.7)', textTransform: 'uppercase',
                letterSpacing: '0.2em', fontFamily: 'monospace',
              }}>
                {dialogIndex >= dialogs.length - 1
                  ? (lang === 'fr' ? '[ Cliquer pour choisir ]' : '[ Click to choose ]')
                  : (lang === 'fr' ? '[ Cliquer pour continuer ]' : '[ Click to continue ]')
                }
              </span>
              <span style={{ fontSize: '14px', color: '#3b82f6', animation: 'bounce 0.8s ease infinite' }}>▼</span>
            </div>
          )}
        </div>
      )}

      {/* Hint "Passer" */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          localStorage.setItem('pokedex-hasSeenIntro', 'true');
          setLeaving(true);
          setTimeout(() => navigate('/'), 600);
        }}
        style={{
          position: 'fixed', top: '20px', right: '24px', zIndex: 4,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.4)', borderRadius: '8px',
          padding: '6px 14px', fontSize: '10px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          cursor: 'pointer', fontFamily: 'monospace',
          transition: 'all 0.2s',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
        }}
      >
        {lang === 'fr' ? 'Passer ›' : 'Skip ›'}
      </button>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(1); }
          to   { opacity: 0.6; transform: scale(1.4); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(4px); }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(251,191,36,0.3)); }
          50%       { filter: drop-shadow(0 0 40px rgba(251,191,36,0.6)); }
        }
        @keyframes expandLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
