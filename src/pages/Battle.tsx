import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';
import { pokemonApi } from '../api/pokemonApi';

// ── Couleurs par type ────────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  fire:'#f97316',water:'#3b82f6',grass:'#22c55e',electric:'#eab308',
  ice:'#67e8f9',fighting:'#dc2626',poison:'#a855f7',ground:'#d97706',
  flying:'#818cf8',psychic:'#ec4899',bug:'#84cc16',rock:'#78716c',
  ghost:'#7c3aed',dragon:'#4f46e5',dark:'#4b4b4b',steel:'#94a3b8',
  fairy:'#ec4899',normal:'#9ca3af',
};

// ── Type effectiveness (attaquant → défenseur) ───────────────────────────────
const SUPER_EFFECTIVE: Record<string, string[]> = {
  fire: ['grass','ice','bug','steel'],
  water: ['fire','ground','rock'],
  grass: ['water','ground','rock'],
  electric: ['water','flying'],
  ice: ['grass','ground','flying','dragon'],
  fighting: ['normal','ice','rock','dark','steel'],
  poison: ['grass','fairy'],
  ground: ['fire','electric','poison','rock','steel'],
  flying: ['grass','fighting','bug'],
  psychic: ['fighting','poison'],
  bug: ['grass','psychic','dark'],
  rock: ['fire','ice','flying','bug'],
  ghost: ['ghost','psychic'],
  dragon: ['dragon'],
  dark: ['ghost','psychic'],
  steel: ['ice','rock','fairy'],
  fairy: ['fighting','dragon','dark'],
  normal: [],
};

// ── Calcul dégâts simplifié ──────────────────────────────────────────────────
function calcDamage(attacker: any, defender: any, move?: string): number {
  const atkStat = attacker.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 50;
  const defStat = defender.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 50;
  const atkType = attacker.types[0].type.name;
  const defType = defender.types[0].type.name;

  const isSuper = SUPER_EFFECTIVE[atkType]?.includes(defType);
  const effectiveness = isSuper ? 1.5 : 1.0;
  const level = 50;
  const base = move ? Math.random() * 60 + 40 : Math.random() * 40 + 30;
  const dmg = Math.floor(((2 * level / 5 + 2) * base * atkStat / defStat / 50 + 2) * effectiveness * (Math.random() * 0.15 + 0.85));
  return Math.max(1, dmg);
}

// ── Log entry ────────────────────────────────────────────────────────────────
interface LogEntry {
  text: string;
  type: 'attack' | 'info' | 'win' | 'critical';
}

// ── Composant mini-carte sélecteur ───────────────────────────────────────────
function PokemonSelector({ label, selected, onSelect, isDark, lang }: {
  label: string;
  selected: any;
  onSelect: (p: any) => void;
  isDark: boolean;
  lang: string;
}) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const bg = isDark ? '#0e0e0e' : '#f0f0f0';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? 'white' : '#111';
  const mutedColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const dropBg = isDark ? '#1a1a1a' : 'white';

  const handleSearch = async (q: string) => {
    setSearch(q);
    if (q.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      const data = await res.json();
      const filtered = data.results.filter((p: any) => p.name.includes(q.toLowerCase())).slice(0, 6);
      setResults(filtered);
    } catch { setResults([]); }
    finally { setSearching(false); }
  };

  const handleSelect = async (p: any) => {
    setSearch('');
    setResults([]);
    const pokemon = await pokemonApi.getPokemonById(p.name);
    onSelect(pokemon);
  };

  const mainType = selected?.types?.[0]?.type?.name;
  const typeColor = mainType ? TYPE_COLOR[mainType] || '#888' : '#dc2626';
  const imageUrl = (selected as any)?.customImage || selected?.sprites?.other?.['official-artwork']?.front_default;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <p style={{ fontSize: '10px', fontWeight: 900, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{label}</p>

      {/* Zone Pokémon sélectionné */}
      <div style={{
        width: '200px', height: '200px', borderRadius: '20px',
        background: selected ? `linear-gradient(135deg, ${typeColor}22 0%, ${isDark ? '#0e0e0e' : '#f5f5f5'} 100%)` : inputBg,
        border: `2px solid ${selected ? typeColor + '55' : border}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
      }}>
        {selected ? (
          <>
            <img src={imageUrl} alt={selected.name} style={{ width: '130px', height: '130px', objectFit: 'contain', filter: `drop-shadow(0 8px 16px ${typeColor}66)` }} />
            <p style={{ fontSize: '13px', fontWeight: 900, color: textColor, textTransform: 'capitalize', marginTop: '4px' }}>{selected.name}</p>
            <p style={{ fontSize: '9px', color: mutedColor, fontWeight: 700 }}>
              HP: {selected.stats.find((s: any) => s.stat.name === 'hp')?.base_stat} · ATK: {selected.stats.find((s: any) => s.stat.name === 'attack')?.base_stat}
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: mutedColor }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</p>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lang === 'fr' ? 'Choisir un Pokémon' : 'Choose a Pokémon'}</p>
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      <div style={{ position: 'relative', width: '200px' }}>
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder={lang === 'fr' ? 'Chercher...' : 'Search...'}
          style={{
            width: '100%', padding: '9px 12px', borderRadius: '10px',
            border: `1px solid ${border}`, background: inputBg,
            color: textColor, fontSize: '12px', outline: 'none',
          }}
        />
        {searching && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', color: mutedColor }}>...</span>}

        {/* Dropdown */}
        {results.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            background: dropBg, border: `1px solid ${border}`, borderRadius: '10px',
            marginTop: '4px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>
            {results.map((p: any) => (
              <button key={p.name} onClick={() => handleSelect(p)} style={{
                display: 'block', width: '100%', padding: '8px 12px', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer', color: textColor,
                fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
                borderBottom: `1px solid ${border}`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Barre de vie animée ──────────────────────────────────────────────────────
function HPBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = pct > 50 ? '#22c55e' : pct > 25 ? '#eab308' : '#ef4444';
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PV</span>
        <span style={{ fontSize: '11px', fontWeight: 900, color: 'white' }}>{current} / {max}</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '99px', transition: 'width 0.4s ease, background 0.3s', boxShadow: `0 0 8px ${barColor}88` }}/>
      </div>
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────────────────────
export default function Battle() {
  const { isDark } = useTheme();
  const { lang } = useLang();

  const [pokemon1, setPokemon1] = useState<any>(null);
  const [pokemon2, setPokemon2] = useState<any>(null);
  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  const [maxHp1, setMaxHp1] = useState(0);
  const [maxHp2, setMaxHp2] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [fighting, setFighting] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [shake1, setShake1] = useState(false);
  const [shake2, setShake2] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const bg = isDark ? '#080808' : '#f4f4f4';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? 'white' : '#111';
  const mutedColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';

  // Préparer les PV quand les pokémons changent
  useEffect(() => {
    if (pokemon1) {
      const hp = pokemon1.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 100;
      setMaxHp1(hp); setHp1(hp);
    }
  }, [pokemon1]);
  useEffect(() => {
    if (pokemon2) {
      const hp = pokemon2.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 100;
      setMaxHp2(hp); setHp2(hp);
    }
  }, [pokemon2]);

  // Auto-scroll log
  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [log]);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    setLog(prev => [...prev, { text, type }]);
  };

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const startBattle = async () => {
    if (!pokemon1 || !pokemon2) return;
    setFighting(true);
    setWinner(null);
    setLog([]);

    const hp1init = pokemon1.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 100;
    const hp2init = pokemon2.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 100;
    setHp1(hp1init); setHp2(hp2init);

    let curHp1 = hp1init, curHp2 = hp2init;
    addLog(lang === 'fr' ? `⚔️  Le combat commence !` : `⚔️  Battle starts!`, 'info');
    addLog(`${pokemon1.name.toUpperCase()} VS ${pokemon2.name.toUpperCase()}`, 'info');
    await sleep(600);

    // Déterminer l'ordre par vitesse
    const spd1 = pokemon1.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 50;
    const spd2 = pokemon2.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 50;
    let first = spd1 >= spd2 ? 1 : 2;
    addLog(lang === 'fr'
      ? `${(first === 1 ? pokemon1 : pokemon2).name} attaque en premier (vitesse supérieure) !`
      : `${(first === 1 ? pokemon1 : pokemon2).name} attacks first (higher speed)!`, 'info');
    await sleep(500);

    let round = 0;
    while (curHp1 > 0 && curHp2 > 0 && round < 50) {
      round++;
      await sleep(700);

      const attacker = first === 1 ? pokemon1 : pokemon2;
      const defender = first === 1 ? pokemon2 : pokemon1;
      const move = attacker.moves?.[Math.floor(Math.random() * Math.min(4, attacker.moves.length))]?.move?.name?.replace(/-/g, ' ') || 'tackle';
      const dmg = calcDamage(attacker, defender, move);
      const isCritical = Math.random() < 0.1;
      const finalDmg = isCritical ? Math.floor(dmg * 1.5) : dmg;

      if (first === 1) {
        curHp2 = Math.max(0, curHp2 - finalDmg);
        setHp2(curHp2);
        setShake2(true); setTimeout(() => setShake2(false), 400);
      } else {
        curHp1 = Math.max(0, curHp1 - finalDmg);
        setHp1(curHp1);
        setShake1(true); setTimeout(() => setShake1(false), 400);
      }

      const logType = isCritical ? 'critical' : 'attack';
      addLog(
        lang === 'fr'
          ? `${attacker.name} utilise ${move} → ${finalDmg} dégâts${isCritical ? ' 💥 CRITIQUE !' : ''}`
          : `${attacker.name} uses ${move} → ${finalDmg} damage${isCritical ? ' 💥 CRITICAL!' : ''}`,
        logType
      );

      if (curHp1 <= 0 || curHp2 <= 0) break;

      // Changer d'attaquant
      first = first === 1 ? 2 : 1;
    }

    await sleep(400);
    if (curHp1 <= 0 && curHp2 <= 0) {
      addLog(lang === 'fr' ? '🤝 Match nul ! Les deux Pokémon sont K.O. !' : '🤝 Draw! Both Pokémon are K.O.!', 'info');
    } else {
      const w = curHp1 > 0 ? pokemon1 : pokemon2;
      setWinner(w);
      addLog(lang === 'fr' ? `🏆 ${w.name.toUpperCase()} remporte le combat !` : `🏆 ${w.name.toUpperCase()} wins the battle!`, 'win');
    }
    setFighting(false);
  };

  const reset = () => {
    setPokemon1(null); setPokemon2(null);
    setHp1(0); setHp2(0); setMaxHp1(0); setMaxHp2(0);
    setLog([]); setWinner(null); setFighting(false);
  };

  const type1 = pokemon1?.types?.[0]?.type?.name;
  const type2 = pokemon2?.types?.[0]?.type?.name;
  const c1 = type1 ? TYPE_COLOR[type1] : '#dc2626';
  const c2 = type2 ? TYPE_COLOR[type2] : '#3b82f6';
  const img1 = (pokemon1 as any)?.customImage || pokemon1?.sprites?.other?.['official-artwork']?.front_default;
  const img2 = (pokemon2 as any)?.customImage || pokemon2?.sprites?.other?.['official-artwork']?.front_default;

  return (
    <div style={{ minHeight: '100vh', background: bg }}>
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '40px 32px 32px', borderBottom: `1px solid ${cardBorder}` }}>
        <h1 style={{ fontSize: '44px', fontWeight: 900, color: textColor, fontStyle: 'italic', letterSpacing: '-0.04em', margin: 0 }}>
          {lang === 'fr' ? 'Simulateur de ' : 'Battle '}<span style={{ color: '#dc2626' }}>{lang === 'fr' ? 'Combat' : 'Simulator'}</span>
        </h1>
        <p style={{ fontSize: '11px', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '6px' }}>
          {lang === 'fr' ? 'Sélectionne 2 Pokémon · Lance le duel · Découvre le vainqueur' : 'Select 2 Pokémon · Start the duel · Find the winner'}
        </p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

        {/* ── SÉLECTEURS ──────────────────────────────────────────────────── */}
        {!fighting && !winner && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
            <PokemonSelector label="Pokémon 1" selected={pokemon1} onSelect={setPokemon1} isDark={isDark} lang={lang} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '60px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900, color: mutedColor }}>VS</span>
            </div>

            <PokemonSelector label="Pokémon 2" selected={pokemon2} onSelect={setPokemon2} isDark={isDark} lang={lang} />
          </div>
        )}

        {/* ── ARÈNE DE COMBAT ──────────────────────────────────────────────── */}
        {(fighting || winner) && pokemon1 && pokemon2 && (
          <div style={{
            background: `linear-gradient(135deg, ${c1}15 0%, ${isDark ? '#0a0a0a' : '#f8f8f8'} 50%, ${c2}15 100%)`,
            borderRadius: '24px', border: `1px solid ${cardBorder}`,
            padding: '32px', marginBottom: '32px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center' }}>

              {/* Pokémon 1 */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: c1, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Pokémon 1</p>
                <p style={{ fontSize: '16px', fontWeight: 900, color: textColor, textTransform: 'capitalize', marginBottom: '12px' }}>{pokemon1.name}</p>
                <img src={img1} alt={pokemon1.name} style={{
                  width: '120px', height: '120px', objectFit: 'contain',
                  filter: `drop-shadow(0 8px 16px ${c1}66)`,
                  transform: shake1 ? 'translateX(-8px)' : 'none',
                  transition: 'transform 0.1s',
                  opacity: hp1 <= 0 ? 0.3 : 1,
                }}/>
                <div style={{ marginTop: '16px' }}>
                  <HPBar current={hp1} max={maxHp1} color={c1} />
                </div>
              </div>

              {/* VS central */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 900, color: mutedColor, fontStyle: 'italic' }}>VS</span>
              </div>

              {/* Pokémon 2 */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: c2, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Pokémon 2</p>
                <p style={{ fontSize: '16px', fontWeight: 900, color: textColor, textTransform: 'capitalize', marginBottom: '12px' }}>{pokemon2.name}</p>
                <img src={img2} alt={pokemon2.name} style={{
                  width: '120px', height: '120px', objectFit: 'contain',
                  filter: `drop-shadow(0 8px 16px ${c2}66)`,
                  transform: shake2 ? 'translateX(8px)' : 'none',
                  transition: 'transform 0.1s',
                  opacity: hp2 <= 0 ? 0.3 : 1,
                }}/>
                <div style={{ marginTop: '16px' }}>
                  <HPBar current={hp2} max={maxHp2} color={c2} />
                </div>
              </div>
            </div>

            {/* Bannière vainqueur */}
            {winner && (
              <div style={{
                marginTop: '24px', textAlign: 'center', padding: '20px',
                background: `${TYPE_COLOR[winner.types[0].type.name] || '#dc2626'}22`,
                borderRadius: '16px', border: `1px solid ${TYPE_COLOR[winner.types[0].type.name] || '#dc2626'}44`,
                animation: 'fadeInScale 0.4s ease',
              }}>
                <p style={{ fontSize: '28px', fontWeight: 900, color: TYPE_COLOR[winner.types[0].type.name] || '#dc2626', textTransform: 'capitalize', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
                  🏆 {winner.name} {lang === 'fr' ? 'gagne !' : 'wins!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── LOG DE COMBAT ─────────────────────────────────────────────── */}
        {log.length > 0 && (
          <div style={{
            background: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`,
            padding: '16px', marginBottom: '24px',
          }}>
            <p style={{ fontSize: '9px', fontWeight: 900, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '10px' }}>{lang === 'fr' ? 'Journal de combat' : 'Battle log'}</p>
            <div ref={logRef} style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {log.map((entry, i) => (
                <p key={i} style={{
                  fontSize: '12px', fontWeight: entry.type === 'win' || entry.type === 'critical' ? 700 : 500,
                  color: entry.type === 'win' ? '#22c55e' : entry.type === 'critical' ? '#f97316' : entry.type === 'attack' ? textColor : mutedColor,
                  margin: 0, padding: '2px 0',
                }}>
                  {entry.text}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* ── BOUTONS ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {!fighting && !winner && (
            <button
              onClick={startBattle}
              disabled={!pokemon1 || !pokemon2}
              style={{
                padding: '14px 40px', borderRadius: '14px', border: 'none',
                background: pokemon1 && pokemon2
                  ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                  : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                color: pokemon1 && pokemon2 ? 'white' : mutedColor,
                fontSize: '13px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.1em', cursor: pokemon1 && pokemon2 ? 'pointer' : 'not-allowed',
                boxShadow: pokemon1 && pokemon2 ? '0 4px 20px rgba(220,38,38,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              ⚔️ {lang === 'fr' ? 'Lancer le combat !' : 'Start battle!'}
            </button>
          )}

          {fighting && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: mutedColor }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid #dc2626', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}/>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lang === 'fr' ? 'Combat en cours...' : 'Battle in progress...'}</span>
            </div>
          )}

          {winner && (
            <button onClick={reset} style={{
              padding: '14px 40px', borderRadius: '14px', border: `1px solid ${cardBorder}`,
              background: cardBg, color: textColor, fontSize: '13px', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
            }}>
              🔄 {lang === 'fr' ? 'Nouveau combat' : 'New battle'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes fadeInScale { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}
