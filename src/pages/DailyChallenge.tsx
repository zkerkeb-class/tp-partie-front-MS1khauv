import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { pokemonApi } from '../api/pokemonApi';

// ── Types ────────────────────────────────────────────────────────────────────
type ChallengeType = 'silhouette' | 'cry' | 'type-quiz' | 'stat-quiz';

interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  sprites: any;
  cries?: { latest?: string };
  customImage?: string;
}

// ── Couleurs type ─────────────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  fire:'#f97316',water:'#3b82f6',grass:'#22c55e',electric:'#eab308',
  ice:'#67e8f9',fighting:'#dc2626',poison:'#a855f7',ground:'#d97706',
  flying:'#818cf8',psychic:'#ec4899',bug:'#84cc16',rock:'#78716c',
  ghost:'#7c3aed',dragon:'#4f46e5',dark:'#4b4b4b',steel:'#94a3b8',
  fairy:'#ec4899',normal:'#9ca3af',
};

// ── Banque de défis quiz "connaissance" ──────────────────────────────────────
const TYPE_CHALLENGES = [
  { q_fr: 'Quels Pokémon ont le type Feu ET Vol ?',         q_en: 'Which Pokémon have both Fire AND Flying type?',         types: ['fire','flying'] },
  { q_fr: 'Quels Pokémon ont le type Eau ?',                q_en: 'Which Pokémon have the Water type?',                    types: ['water'] },
  { q_fr: 'Quels Pokémon ont le type Psy ?',                q_en: 'Which Pokémon have the Psychic type?',                  types: ['psychic'] },
  { q_fr: 'Quels Pokémon ont le type Spectre ?',            q_en: 'Which Pokémon have the Ghost type?',                    types: ['ghost'] },
  { q_fr: 'Quels Pokémon ont le type Dragon ?',             q_en: 'Which Pokémon have the Dragon type?',                   types: ['dragon'] },
  { q_fr: 'Quels Pokémon ont le type Poison ET Sol ?',      q_en: 'Which Pokémon have both Poison AND Ground type?',       types: ['poison','ground'] },
  { q_fr: 'Quels Pokémon ont le type Glace ?',              q_en: 'Which Pokémon have the Ice type?',                      types: ['ice'] },
  { q_fr: 'Quels Pokémon ont le type Normal ET Vol ?',      q_en: 'Which Pokémon have both Normal AND Flying type?',       types: ['normal','flying'] },
];

// ── Seed déterministe par jour ───────────────────────────────────────────────
function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}
function seededRand(seed: number, n: number): number {
  const x = Math.sin(seed + n) * 10000;
  return Math.floor((x - Math.floor(x)) * 151) + 1;
}

// ── Utilitaires ──────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor((Math.sin(seed * (i + 1)) * 10000 % 1 + 1) % 1 * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Composant score ───────────────────────────────────────────────────────────
function ScoreBadge({ score, total, color }: { score: number; total: number; color: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 12px', borderRadius: '20px',
      background: `${color}22`, border: `1px solid ${color}55`,
      color, fontSize: '12px', fontWeight: 900,
    }}>
      ⭐ {score} / {total}
    </span>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function DailyChallenge() {
  const { isDark } = useTheme();
  const { lang } = useLang();
  const navigate = useNavigate();

  const [challengeType, setChallengeType] = useState<ChallengeType>('silhouette');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('daily-score') || '0'));
  const [totalPlayed, setTotalPlayed] = useState(() => parseInt(localStorage.getItem('daily-total') || '0'));
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizChallenge, setQuizChallenge] = useState<typeof TYPE_CHALLENGES[0] | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('daily-streak') || '0'));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cryPlaying, setCryPlaying] = useState(false);
  const [cryRevealed, setCryRevealed] = useState(false);

  const seed = getDailySeed();
  const bg = isDark ? '#080808' : '#f4f4f4';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? 'white' : '#111';
  const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  // ── Charger un Pokémon du jour ──────────────────────────────────────────────
  useEffect(() => {
    loadChallenge(challengeType);
  }, [challengeType]);

  async function loadChallenge(type: ChallengeType) {
    setLoading(true);
    setError(null);
    setRevealed(false);
    setGuess('');
    setSubmitted(false);
    setIsCorrect(false);
    setSelectedOption(null);
    setCryRevealed(false);
    setQuizAnswer(null);

    try {
      if (type === 'type-quiz') {
        // Quiz type : choisir le bon type du Pokémon du jour
        const id = seededRand(seed, 1);
        const p = await pokemonApi.getPokemonById(id);
        setPokemon(p as unknown as Pokemon);
        // Générer 4 options de types
        const correct = (p as any).types[0].type.name;
        const allTypes = Object.keys(TYPE_COLOR);
        const wrongs = shuffle(allTypes.filter(t => t !== correct), seed).slice(0, 3);
        const opts = shuffle([correct, ...wrongs], seed + 99);
        setOptions(opts);

      } else if (type === 'stat-quiz') {
        // Quiz stat : deviner si stat A > stat B
        const id = seededRand(seed, 2);
        const p = await pokemonApi.getPokemonById(id);
        setPokemon(p as unknown as Pokemon);
        setOptions([]);

      } else if (type === 'cry') {
        // Devine le Pokémon au cri
        const id = seededRand(seed, 3);
        const p = await pokemonApi.getPokemonById(id);
        setPokemon(p as unknown as Pokemon);
        const allNames = Array.from({ length: 151 }, (_, i) => i + 1)
          .map(i => `pokemon-${i}`)
          .filter((_, i) => i !== id - 1);
        const fakePokes = await Promise.all(
          shuffle([...Array(151)].map((_, i) => i + 1).filter(i => i !== id), seed).slice(0, 3)
            .map(i => pokemonApi.getPokemonById(i))
        );
        const opts = shuffle(
          [(p as any).name, ...fakePokes.map((fp: any) => fp.name)],
          seed + 7
        );
        setOptions(opts);

      } else {
        // Silhouette
        const id = seededRand(seed, 4);
        const p = await pokemonApi.getPokemonById(id);
        setPokemon(p as unknown as Pokemon);
        const fakePokes = await Promise.all(
          shuffle([...Array(151)].map((_, i) => i + 1).filter(i => i !== id), seed).slice(0, 3)
            .map(i => pokemonApi.getPokemonById(i))
        );
        const opts = shuffle(
          [(p as any).name, ...fakePokes.map((fp: any) => fp.name)],
          seed + 3
        );
        setOptions(opts);
      }

      // Défi "type quiz" global
      const challengeIdx = seed % TYPE_CHALLENGES.length;
      setQuizChallenge(TYPE_CHALLENGES[challengeIdx]);

    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) setError(lang === 'fr' ? 'Pokémon introuvable (404)' : 'Pokémon not found (404)');
      else if (status === 429) setError(lang === 'fr' ? 'Trop de requêtes, réessaie dans quelques secondes (429)' : 'Too many requests, try again in a few seconds (429)');
      else if (status === 500) setError(lang === 'fr' ? 'Erreur serveur (500)' : 'Server error (500)');
      else setError(lang === 'fr' ? 'Erreur de chargement. Vérifie ta connexion.' : 'Loading error. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  // ── Soumettre une réponse ──────────────────────────────────────────────────
  function submitGuess(answer: string) {
    if (submitted || !pokemon) return;
    const correct = (pokemon as any).name.toLowerCase();
    const ok = answer.trim().toLowerCase() === correct;
    setIsCorrect(ok);
    setSubmitted(true);
    setRevealed(true);
    setSelectedOption(answer);

    const newTotal = totalPlayed + 1;
    const newScore = ok ? score + 1 : score;
    const newStreak = ok ? streak + 1 : 0;
    setTotalPlayed(newTotal);
    setScore(newScore);
    setStreak(newStreak);
    localStorage.setItem('daily-score', String(newScore));
    localStorage.setItem('daily-total', String(newTotal));
    localStorage.setItem('daily-streak', String(newStreak));
  }

  function submitTypeGuess(answer: string) {
    if (submitted || !pokemon) return;
    const correct = (pokemon as any).types[0].type.name;
    const ok = answer === correct;
    setIsCorrect(ok);
    setSubmitted(true);
    setSelectedOption(answer);

    const newTotal = totalPlayed + 1;
    const newScore = ok ? score + 1 : score;
    const newStreak = ok ? streak + 1 : 0;
    setTotalPlayed(newTotal);
    setScore(newScore);
    setStreak(newStreak);
    localStorage.setItem('daily-score', String(newScore));
    localStorage.setItem('daily-total', String(newTotal));
    localStorage.setItem('daily-streak', String(newStreak));
  }

  function playCry() {
    if (!pokemon || !(pokemon as any).cries?.latest) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio((pokemon as any).cries.latest);
    audio.onplay = () => setCryPlaying(true);
    audio.onended = () => setCryPlaying(false);
    audio.onerror = () => setCryPlaying(false);
    audioRef.current = audio;
    audio.play().catch(() => setCryPlaying(false));
  }

  function nextChallenge() {
    loadChallenge(challengeType);
  }

  const imageUrl = pokemon ? ((pokemon as any).customImage || (pokemon as any).sprites?.other?.['official-artwork']?.front_default) : '';
  const mainType = pokemon ? (pokemon as any).types?.[0]?.type?.name : 'normal';
  const typeColor = TYPE_COLOR[mainType] || '#888';

  const TABS: { key: ChallengeType; label_fr: string; label_en: string; icon: string }[] = [
    { key: 'silhouette', label_fr: 'Silhouette', label_en: 'Silhouette', icon: '👤' },
    { key: 'cry',        label_fr: 'Devine le cri', label_en: 'Guess the cry', icon: '🔊' },
    { key: 'type-quiz',  label_fr: 'Quiz Type', label_en: 'Type Quiz', icon: '🎯' },
    { key: 'stat-quiz',  label_fr: 'Quiz Stats', label_en: 'Stats Quiz', icon: '📊' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: bg }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '36px 32px 0', borderBottom: `1px solid ${cardBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
          <span style={{ fontSize: '28px' }}>🏆</span>
          <h1 style={{ fontSize: '40px', fontWeight: 900, color: textColor, fontStyle: 'italic', letterSpacing: '-0.04em', margin: 0 }}>
            {lang === 'fr' ? 'Défi du' : 'Daily'}&nbsp;
            <span style={{ color: '#dc2626' }}>{lang === 'fr' ? 'Jour' : 'Challenge'}</span>
          </h1>
        </div>
        <p style={{ fontSize: '11px', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>
          {lang === 'fr' ? 'Teste tes connaissances Pokémon · Nouveau défi chaque jour' : 'Test your Pokémon knowledge · New challenge every day'}
        </p>

        {/* Score + Streak */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <ScoreBadge score={score} total={totalPlayed} color="#dc2626" />
          {streak > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)', color: '#fbbf24', fontSize: '12px', fontWeight: 900 }}>
              🔥 {lang === 'fr' ? 'Série :' : 'Streak:'} {streak}
            </span>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('daily-score');
              localStorage.removeItem('daily-total');
              localStorage.removeItem('daily-streak');
              setScore(0); setTotalPlayed(0); setStreak(0);
            }}
            style={{ padding: '4px 10px', borderRadius: '8px', border: `1px solid ${cardBorder}`, background: cardBg, color: mutedColor, fontSize: '9px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            Reset
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', paddingBottom: '0' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setChallengeType(tab.key)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: challengeType === tab.key ? '#dc2626' : mutedColor,
                borderBottom: challengeType === tab.key ? '2px solid #dc2626' : '2px solid transparent',
                borderTop: '2px solid transparent',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <span>{tab.icon}</span>
              <span>{lang === 'fr' ? tab.label_fr : tab.label_en}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENU ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* Erreur HTTP */}
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>⚠️</p>
            <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '14px' }}>{error}</p>
            <button onClick={() => loadChallenge(challengeType)} style={{ marginTop: '12px', padding: '8px 20px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.15)', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {lang === 'fr' ? 'Réessayer' : 'Retry'}
            </button>
          </div>
        )}

        {loading && !error && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: '44px', height: '44px', border: '3px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}/>
            <p style={{ color: mutedColor, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {lang === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        )}

        {!loading && !error && pokemon && (

          <div>
            {/* ── SILHOUETTE ─────────────────────────────────────────── */}
            {challengeType === 'silhouette' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
                  {lang === 'fr' ? '🔍 Qui est ce Pokémon ?' : '🔍 Who is this Pokémon?'}
                </p>

                {/* Image silhouette ou révélée */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '32px' }}>
                  <img
                    src={imageUrl}
                    alt="?"
                    style={{
                      width: '200px', height: '200px', objectFit: 'contain',
                      filter: revealed ? `drop-shadow(0 0 24px ${typeColor}88)` : 'brightness(0)',
                      transition: 'filter 0.6s ease',
                      animation: revealed ? 'floatPoke 3s ease-in-out infinite' : 'none',
                    }}
                  />
                  {!revealed && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '48px', fontWeight: 900, color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>?</span>
                    </div>
                  )}
                </div>

                {/* Boutons réponses */}
                {!submitted && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => submitGuess(opt)}
                        style={{
                          padding: '12px 16px', borderRadius: '12px', border: `1px solid ${cardBorder}`,
                          background: cardBg, color: textColor, fontSize: '12px', fontWeight: 700,
                          textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s',
                          letterSpacing: '0.03em',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.background = cardBg; }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Saisie libre */}
                {!submitted && (
                  <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto 12px' }}>
                    <input
                      type="text"
                      value={guess}
                      onChange={e => setGuess(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && submitGuess(guess)}
                      placeholder={lang === 'fr' ? 'Ou tape le nom...' : 'Or type the name...'}
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: '10px',
                        border: `1px solid ${cardBorder}`, background: inputBg,
                        color: textColor, fontSize: '13px', outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => submitGuess(guess)}
                      style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 900, fontSize: '12px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      OK
                    </button>
                  </div>
                )}

                {/* Résultat */}
                {submitted && (
                  <ResultBanner
                    isCorrect={isCorrect}
                    answer={(pokemon as any).name}
                    lang={lang}
                    typeColor={typeColor}
                    pokemonId={(pokemon as any).id}
                    onNavigate={() => navigate(`/pokemon/${(pokemon as any).id}`)}
                    onNext={nextChallenge}
                    selectedOption={selectedOption}
                    correctAnswer={(pokemon as any).name}
                  />
                )}
              </div>
            )}

            {/* ── CRI ─────────────────────────────────────────────────── */}
            {challengeType === 'cry' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px' }}>
                  {lang === 'fr' ? '🎵 Devine le Pokémon à son cri !' : '🎵 Guess the Pokémon by its cry!'}
                </p>

                <button
                  onClick={playCry}
                  style={{
                    width: '100px', height: '100px', borderRadius: '50%', border: `3px solid ${cryPlaying ? '#dc2626' : cardBorder}`,
                    background: cryPlaying ? 'rgba(220,38,38,0.15)' : cardBg,
                    cursor: 'pointer', fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 32px', transition: 'all 0.2s',
                    boxShadow: cryPlaying ? '0 0 24px rgba(220,38,38,0.4)' : 'none',
                    animation: cryPlaying ? 'pulse 0.8s infinite' : 'none',
                  }}
                >
                  {cryPlaying ? '🔊' : '▶️'}
                </button>

                {!submitted && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setCryRevealed(true); submitGuess(opt); }}
                        style={{
                          padding: '12px 16px', borderRadius: '12px', border: `1px solid ${cardBorder}`,
                          background: cardBg, color: textColor, fontSize: '12px', fontWeight: 700,
                          textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.background = cardBg; }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {submitted && (
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <img
                      src={imageUrl}
                      alt={(pokemon as any).name}
                      style={{ width: '150px', height: '150px', objectFit: 'contain', filter: `drop-shadow(0 0 20px ${typeColor}88)`, animation: 'floatPoke 3s ease-in-out infinite', marginBottom: '8px' }}
                    />
                    <p style={{ fontSize: '20px', fontWeight: 900, color: textColor, textTransform: 'capitalize' }}>{(pokemon as any).name}</p>
                  </div>
                )}

                {submitted && (
                  <ResultBanner
                    isCorrect={isCorrect}
                    answer={(pokemon as any).name}
                    lang={lang}
                    typeColor={typeColor}
                    pokemonId={(pokemon as any).id}
                    onNavigate={() => navigate(`/pokemon/${(pokemon as any).id}`)}
                    onNext={nextChallenge}
                    selectedOption={selectedOption}
                    correctAnswer={(pokemon as any).name}
                  />
                )}
              </div>
            )}

            {/* ── QUIZ TYPE ────────────────────────────────────────────── */}
            {challengeType === 'type-quiz' && (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={imageUrl}
                  alt={(pokemon as any).name}
                  style={{ width: '170px', height: '170px', objectFit: 'contain', filter: `drop-shadow(0 0 20px ${typeColor}66)`, animation: 'floatPoke 3s ease-in-out infinite', marginBottom: '8px' }}
                />
                <p style={{ fontSize: '20px', fontWeight: 900, color: textColor, textTransform: 'capitalize', marginBottom: '6px' }}>{(pokemon as any).name}</p>
                <p style={{ fontSize: '12px', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
                  {lang === 'fr' ? '❓ Quel est le type principal ?' : '❓ What is the primary type?'}
                </p>

                {!submitted && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => submitTypeGuess(opt)}
                        style={{
                          padding: '12px 16px', borderRadius: '12px',
                          border: `2px solid ${TYPE_COLOR[opt] || '#888'}55`,
                          background: `${TYPE_COLOR[opt] || '#888'}18`,
                          color: TYPE_COLOR[opt] || textColor, fontSize: '12px', fontWeight: 900,
                          textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s',
                          letterSpacing: '0.05em',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {submitted && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '440px', margin: '0 auto 24px' }}>
                      {options.map(opt => {
                        const isCorrectOpt = opt === (pokemon as any).types[0].type.name;
                        const isSelected = opt === selectedOption;
                        return (
                          <div key={opt} style={{
                            padding: '12px 16px', borderRadius: '12px',
                            border: `2px solid ${isCorrectOpt ? '#22c55e' : isSelected ? '#ef4444' : cardBorder}`,
                            background: isCorrectOpt ? 'rgba(34,197,94,0.15)' : isSelected ? 'rgba(239,68,68,0.1)' : cardBg,
                            color: isCorrectOpt ? '#22c55e' : isSelected ? '#ef4444' : mutedColor,
                            fontSize: '12px', fontWeight: 900, textTransform: 'capitalize',
                          }}>
                            {isCorrectOpt ? '✓ ' : isSelected && !isCorrectOpt ? '✗ ' : ''}{opt}
                          </div>
                        );
                      })}
                    </div>
                    <ResultBanner
                      isCorrect={isCorrect}
                      answer={(pokemon as any).types[0].type.name}
                      lang={lang}
                      typeColor={typeColor}
                      pokemonId={(pokemon as any).id}
                      onNavigate={() => navigate(`/pokemon/${(pokemon as any).id}`)}
                      onNext={nextChallenge}
                      selectedOption={selectedOption}
                      correctAnswer={(pokemon as any).types[0].type.name}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── QUIZ STATS ───────────────────────────────────────────── */}
            {challengeType === 'stat-quiz' && (
              <StatQuiz
                pokemon={pokemon as any}
                isDark={isDark}
                lang={lang}
                textColor={textColor}
                mutedColor={mutedColor}
                cardBg={cardBg}
                cardBorder={cardBorder}
                typeColor={typeColor}
                imageUrl={imageUrl}
                seed={seed}
                score={score}
                totalPlayed={totalPlayed}
                streak={streak}
                onResult={(ok: boolean) => {
                  const nt = totalPlayed + 1;
                  const ns = ok ? score + 1 : score;
                  const nst = ok ? streak + 1 : 0;
                  setTotalPlayed(nt); setScore(ns); setStreak(nst);
                  localStorage.setItem('daily-score', String(ns));
                  localStorage.setItem('daily-total', String(nt));
                  localStorage.setItem('daily-streak', String(nst));
                }}
                onNext={nextChallenge}
                onNavigate={() => navigate(`/pokemon/${(pokemon as any).id}`)}
              />
            )}

          </div>
        )}

        {/* ── DÉFI TYPE DU JOUR ────────────────────────────────────────── */}
        {!loading && !error && quizChallenge && (
          <div style={{ marginTop: '40px', background: cardBg, borderRadius: '18px', border: `1px solid ${cardBorder}`, padding: '24px' }}>
            <p style={{ fontSize: '9px', fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px' }}>
              🎯 {lang === 'fr' ? 'Défi Connaissance du Jour' : "Today's Knowledge Challenge"}
            </p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: textColor, marginBottom: '16px' }}>
              {lang === 'fr' ? quizChallenge.q_fr : quizChallenge.q_en}
            </p>
            {quizAnswer === null ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setQuizAnswer('show')}
                  style={{ padding: '8px 18px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.12)', color: '#dc2626', fontSize: '11px', fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  {lang === 'fr' ? 'Voir la réponse' : 'Show answer'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '11px', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  {lang === 'fr' ? '✅ Réponse :' : '✅ Answer:'}
                </p>
                <button
                  onClick={() => {
                    // Naviguer vers le pokédex avec le filtre des types correspondants
                    navigate('/');
                  }}
                  style={{ padding: '8px 18px', borderRadius: '10px', border: `1px solid ${cardBorder}`, background: cardBg, color: textColor, fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
                >
                  {lang === 'fr' ? '→ Voir dans le Pokédex avec filtre' : '→ View in Pokédex with filter'}
                </button>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {quizChallenge.types.map(t => (
                    <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: 'white', background: TYPE_COLOR[t] || '#888', textTransform: 'capitalize' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes floatPoke { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

// ── Composant bannière résultat ───────────────────────────────────────────────
function ResultBanner({ isCorrect, answer, lang, typeColor, pokemonId, onNavigate, onNext, selectedOption, correctAnswer }: any) {
  return (
    <div style={{
      padding: '20px', borderRadius: '16px', marginTop: '16px',
      background: isCorrect ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)',
      border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.3)'}`,
      animation: 'fadeInUp 0.3s ease',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '28px', marginBottom: '6px' }}>{isCorrect ? '🎉' : '😢'}</p>
      <p style={{ fontSize: '16px', fontWeight: 900, color: isCorrect ? '#22c55e' : '#ef4444', marginBottom: '4px' }}>
        {isCorrect
          ? (lang === 'fr' ? 'Bravo ! Bonne réponse !' : 'Great! Correct answer!')
          : (lang === 'fr' ? 'Raté...' : 'Wrong...')}
      </p>
      {!isCorrect && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
          {lang === 'fr' ? 'Réponse :' : 'Answer:'} <span style={{ color: '#22c55e', fontWeight: 900, textTransform: 'capitalize' }}>{correctAnswer}</span>
        </p>
      )}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '12px', flexWrap: 'wrap' }}>
        <button onClick={onNavigate} style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${typeColor}55`, background: `${typeColor}18`, color: typeColor, fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
          {lang === 'fr' ? '→ Voir la fiche' : '→ View Pokédex page'}
        </button>
        <button onClick={onNext} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.12)', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}>
          {lang === 'fr' ? '🔄 Nouveau' : '🔄 Next'}
        </button>
      </div>
    </div>
  );
}

// ── Composant Quiz Stats ──────────────────────────────────────────────────────
function StatQuiz({ pokemon, isDark, lang, textColor, mutedColor, cardBg, cardBorder, typeColor, imageUrl, seed, onResult, onNext, onNavigate }: any) {
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  const stats = pokemon.stats;
  // Choisir 2 stats à comparer
  const statNames = stats.map((s: any) => s.stat.name);
  const i1 = seed % stats.length;
  const i2 = (seed + 3) % stats.length === i1 ? (seed + 4) % stats.length : (seed + 3) % stats.length;
  const stat1 = stats[i1];
  const stat2 = stats[i2];

  const STAT_LABELS: Record<string, string> = {
    hp: 'HP', attack: 'Attaque', defense: 'Défense',
    'special-attack': 'Atk Spé', 'special-defense': 'Déf Spé', speed: 'Vitesse',
  };
  const STAT_LABELS_EN: Record<string, string> = {
    hp: 'HP', attack: 'Attack', defense: 'Defense',
    'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Speed',
  };

  const label1 = (lang === 'fr' ? STAT_LABELS : STAT_LABELS_EN)[stat1.stat.name] || stat1.stat.name;
  const label2 = (lang === 'fr' ? STAT_LABELS : STAT_LABELS_EN)[stat2.stat.name] || stat2.stat.name;

  function guess(which: 'A' | 'B') {
    if (answered) return;
    const aVal = stat1.base_stat;
    const bVal = stat2.base_stat;
    const isOk = which === 'A' ? aVal >= bVal : bVal > aVal;
    setCorrect(isOk);
    setAnswered(true);
    onResult(isOk);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={imageUrl} alt={pokemon.name} style={{ width: '150px', height: '150px', objectFit: 'contain', filter: `drop-shadow(0 0 20px ${typeColor}66)`, animation: 'floatPoke 3s ease-in-out infinite', marginBottom: '8px' }} />
      <p style={{ fontSize: '20px', fontWeight: 900, color: textColor, textTransform: 'capitalize', marginBottom: '4px' }}>{pokemon.name}</p>
      <p style={{ fontSize: '12px', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '28px' }}>
        {lang === 'fr' ? '📊 Quelle stat est la plus haute ?' : '📊 Which stat is higher?'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '380px', margin: '0 auto 24px' }}>
        {[{ label: label1, stat: stat1, key: 'A' }, { label: label2, stat: stat2, key: 'B' }].map(item => (
          <button
            key={item.key}
            onClick={() => guess(item.key as 'A' | 'B')}
            disabled={answered}
            style={{
              padding: '20px 16px', borderRadius: '16px', cursor: answered ? 'default' : 'pointer',
              border: answered
                ? item.stat.base_stat >= (item.key === 'A' ? stat2 : stat1).base_stat
                  ? '2px solid #22c55e'
                  : '2px solid rgba(239,68,68,0.4)'
                : `2px solid ${typeColor}44`,
              background: answered
                ? item.stat.base_stat >= (item.key === 'A' ? stat2 : stat1).base_stat
                  ? 'rgba(34,197,94,0.15)'
                  : 'rgba(239,68,68,0.08)'
                : `${typeColor}12`,
              transition: 'all 0.2s',
            }}
          >
            <p style={{ fontSize: '10px', fontWeight: 900, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{item.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 900, color: answered ? (item.stat.base_stat >= (item.key === 'A' ? stat2 : stat1).base_stat ? '#22c55e' : '#ef4444') : typeColor, fontStyle: 'italic' }}>
              {answered ? item.stat.base_stat : '?'}
            </p>
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <p style={{ fontSize: '18px', fontWeight: 900, color: correct ? '#22c55e' : '#ef4444', marginBottom: '16px' }}>
            {correct ? (lang === 'fr' ? '🎉 Correct !' : '🎉 Correct!') : (lang === 'fr' ? '😢 Raté !' : '😢 Wrong!')}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onNavigate} style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${typeColor}55`, background: `${typeColor}18`, color: typeColor, fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
              {lang === 'fr' ? '→ Voir la fiche' : '→ View page'}
            </button>
            <button onClick={onNext} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.12)', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
              {lang === 'fr' ? '🔄 Nouveau' : '🔄 Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
