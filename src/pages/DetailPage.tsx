import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchPokemonById } from '../hooks/useFetchPokemon';
import { useAudio } from '../hooks/useAudio';
import { usePokemon } from '../hooks/usePokemon';
import { useTheme } from '../context/ThemeContext';
import { pokemonApi } from '../api/pokemonApi';
import PokemonForm from '../components/title/PokemonForm';

// ── Couleurs hex par type ────────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  fire:'#f97316',water:'#3b82f6',grass:'#22c55e',electric:'#eab308',
  ice:'#67e8f9',fighting:'#dc2626',poison:'#a855f7',ground:'#d97706',
  flying:'#818cf8',psychic:'#ec4899',bug:'#84cc16',rock:'#78716c',
  ghost:'#7c3aed',dragon:'#4f46e5',dark:'#4b4b4b',steel:'#94a3b8',
  fairy:'#ec4899',normal:'#9ca3af',
};

// ── Paysages CSS par type ────────────────────────────────────────────────────
// Chaque paysage = gradient de fond + SVG décoratif en position absolute
interface Landscape { bg: string; svgLayer: string; }

const TYPE_LANDSCAPE: Record<string, Landscape> = {
  grass: {
    bg: 'linear-gradient(180deg, #7dd87d 0%, #4ade80 30%, #86efac 60%, #dcfce7 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Ciel -->
      <circle cx="120" cy="60" r="45" fill="white" opacity="0.7"/>
      <circle cx="90" cy="68" r="32" fill="white" opacity="0.7"/>
      <circle cx="155" cy="65" r="28" fill="white" opacity="0.6"/>
      <circle cx="400" cy="40" r="38" fill="white" opacity="0.5"/>
      <circle cx="370" cy="48" r="28" fill="white" opacity="0.5"/>
      <!-- Arbres -->
      <rect x="580" y="160" width="18" height="80" fill="#4a7c3f"/>
      <polygon points="589,80 540,200 638,200" fill="#2d6a4f"/>
      <polygon points="589,110 548,200 630,200" fill="#52b788"/>
      <rect x="680" y="175" width="14" height="65" fill="#4a7c3f"/>
      <polygon points="687,110 645,210 729,210" fill="#2d6a4f"/>
      <polygon points="687,135 652,210 722,210" fill="#52b788"/>
      <!-- Sol herbe -->
      <ellipse cx="400" cy="310" rx="450" ry="60" fill="#4ade80" opacity="0.5"/>
      <ellipse cx="400" cy="320" rx="480" ry="50" fill="#22c55e" opacity="0.4"/>
      <!-- Touffes herbe -->
      <path d="M100,290 Q110,260 120,290" stroke="#16a34a" stroke-width="3" fill="none"/>
      <path d="M115,290 Q125,255 135,290" stroke="#16a34a" stroke-width="3" fill="none"/>
      <path d="M300,285 Q310,258 320,285" stroke="#16a34a" stroke-width="3" fill="none"/>
    </svg>`,
  },
  fire: {
    bg: 'linear-gradient(180deg, #1a0a00 0%, #7c1d06 25%, #c2410c 55%, #f97316 80%, #fbbf24 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Lave / sol -->
      <ellipse cx="400" cy="320" rx="500" ry="70" fill="#dc2626" opacity="0.6"/>
      <ellipse cx="400" cy="330" rx="500" ry="55" fill="#b91c1c" opacity="0.5"/>
      <!-- Flammes arrière-plan -->
      <path d="M100,320 Q110,240 130,280 Q150,200 170,260 Q190,180 200,320 Z" fill="#ef4444" opacity="0.5"/>
      <path d="M200,320 Q215,230 240,270 Q260,200 280,260 Q300,180 310,320 Z" fill="#f97316" opacity="0.5"/>
      <path d="M550,320 Q560,210 580,260 Q600,170 620,250 Q640,190 650,320 Z" fill="#ef4444" opacity="0.5"/>
      <path d="M650,320 Q665,240 690,270 Q710,200 730,250 Q745,190 755,320 Z" fill="#f97316" opacity="0.4"/>
      <!-- Flammes avant-plan -->
      <path d="M50,320 Q60,270 75,290 Q90,250 100,320 Z" fill="#fbbf24" opacity="0.8"/>
      <path d="M720,320 Q730,265 745,285 Q755,248 765,320 Z" fill="#fbbf24" opacity="0.8"/>
      <!-- Étoiles / braises -->
      <circle cx="200" cy="80" r="2" fill="#fbbf24" opacity="0.8"/>
      <circle cx="350" cy="50" r="1.5" fill="#fde68a" opacity="0.9"/>
      <circle cx="500" cy="90" r="2" fill="#fbbf24" opacity="0.7"/>
      <circle cx="620" cy="60" r="1.5" fill="#fde68a" opacity="0.8"/>
    </svg>`,
  },
  water: {
    bg: 'linear-gradient(180deg, #075985 0%, #0369a1 30%, #0ea5e9 65%, #38bdf8 85%, #7dd3fc 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Soleil -->
      <circle cx="680" cy="55" r="38" fill="#fde68a" opacity="0.9"/>
      <circle cx="680" cy="55" r="28" fill="#fef08a" opacity="0.9"/>
      <!-- Nuages -->
      <circle cx="150" cy="70" r="35" fill="white" opacity="0.75"/>
      <circle cx="120" cy="78" r="28" fill="white" opacity="0.75"/>
      <circle cx="185" cy="75" r="26" fill="white" opacity="0.65"/>
      <!-- Vagues océan -->
      <ellipse cx="400" cy="290" rx="500" ry="55" fill="#0284c7" opacity="0.6"/>
      <path d="M0,260 Q100,235 200,255 Q300,275 400,252 Q500,230 600,250 Q700,270 800,248 L800,320 L0,320 Z" fill="#0369a1" opacity="0.7"/>
      <path d="M0,280 Q100,258 200,272 Q300,285 400,265 Q500,248 600,268 Q700,285 800,265 L800,320 L0,320 Z" fill="#0284c7" opacity="0.5"/>
      <!-- Reflets soleil eau -->
      <path d="M560,290 Q580,285 600,292" stroke="#fef9c3" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M575,305 Q600,298 625,308" stroke="#fef9c3" stroke-width="2" fill="none" opacity="0.4"/>
    </svg>`,
  },
  electric: {
    bg: 'linear-gradient(180deg, #1c1400 0%, #3f2e00 25%, #713f12 50%, #ca8a04 75%, #eab308 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Nuages orageux -->
      <ellipse cx="200" cy="60" rx="100" ry="40" fill="#44403c" opacity="0.8"/>
      <ellipse cx="170" cy="72" rx="70" ry="32" fill="#57534e" opacity="0.7"/>
      <ellipse cx="550" cy="50" rx="90" ry="35" fill="#44403c" opacity="0.8"/>
      <ellipse cx="520" cy="62" rx="65" ry="28" fill="#57534e" opacity="0.7"/>
      <!-- Éclairs -->
      <path d="M210,95 L195,145 L205,145 L185,200 L200,200 L180,250" stroke="#fde047" stroke-width="3" fill="none" opacity="0.9"/>
      <path d="M560,80 L545,130 L555,130 L535,185 L550,185 L530,235" stroke="#fde047" stroke-width="2.5" fill="none" opacity="0.8"/>
      <path d="M400,70 L390,110 L397,110 L383,155" stroke="#fef08a" stroke-width="2" fill="none" opacity="0.6"/>
      <!-- Sol -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#854d0e" opacity="0.6"/>
      <ellipse cx="400" cy="325" rx="500" ry="45" fill="#713f12" opacity="0.5"/>
      <!-- Particules électriques -->
      <circle cx="150" cy="170" r="3" fill="#fef08a" opacity="0.7"/>
      <circle cx="620" cy="140" r="2" fill="#fef08a" opacity="0.8"/>
      <circle cx="380" cy="100" r="2" fill="#fde047" opacity="0.9"/>
    </svg>`,
  },
  ice: {
    bg: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 30%, #80deea 60%, #e0f2fe 85%, #f0f9ff 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Montagnes enneigées -->
      <polygon points="150,320 280,90 410,320" fill="#cffafe" opacity="0.8"/>
      <polygon points="150,320 280,90 310,180 260,200" fill="white" opacity="0.9"/>
      <polygon points="350,320 480,110 610,320" fill="#a5f3fc" opacity="0.7"/>
      <polygon points="350,320 480,110 510,195 460,210" fill="white" opacity="0.9"/>
      <polygon points="550,320 650,150 750,320" fill="#cffafe" opacity="0.7"/>
      <polygon points="550,320 650,150 670,205 640,218" fill="white" opacity="0.9"/>
      <!-- Flocons -->
      <text x="80" y="80" font-size="18" fill="#a5f3fc" opacity="0.8">❄</text>
      <text x="320" y="60" font-size="14" fill="#67e8f9" opacity="0.7">❄</text>
      <text x="600" y="75" font-size="16" fill="#a5f3fc" opacity="0.8">❄</text>
      <text x="700" y="50" font-size="12" fill="#e0f7ff" opacity="0.6">❄</text>
      <!-- Sol neigeux -->
      <ellipse cx="400" cy="320" rx="500" ry="50" fill="white" opacity="0.8"/>
    </svg>`,
  },
  psychic: {
    bg: 'linear-gradient(180deg, #1a0030 0%, #3b0764 30%, #7e22ce 60%, #c026d3 80%, #e879f9 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Étoiles / galaxie -->
      <circle cx="80" cy="40" r="1.5" fill="#f0abfc" opacity="0.9"/>
      <circle cx="150" cy="20" r="1" fill="white" opacity="0.8"/>
      <circle cx="250" cy="55" r="2" fill="#e879f9" opacity="0.8"/>
      <circle cx="320" cy="30" r="1" fill="white" opacity="0.7"/>
      <circle cx="450" cy="15" r="1.5" fill="#f0abfc" opacity="0.9"/>
      <circle cx="600" cy="45" r="2" fill="#c026d3" opacity="0.8"/>
      <circle cx="700" cy="25" r="1" fill="white" opacity="0.7"/>
      <circle cx="760" cy="60" r="1.5" fill="#e879f9" opacity="0.8"/>
      <!-- Orbites / cercles mystiques -->
      <ellipse cx="400" cy="160" rx="200" ry="80" stroke="#e879f9" stroke-width="1" fill="none" opacity="0.25"/>
      <ellipse cx="400" cy="160" rx="280" ry="120" stroke="#c026d3" stroke-width="0.5" fill="none" opacity="0.15"/>
      <!-- Cristaux -->
      <polygon points="100,220 115,170 130,220" fill="#e879f9" opacity="0.5"/>
      <polygon points="650,210 665,155 680,210" fill="#c026d3" opacity="0.5"/>
      <polygon points="380,230 390,195 400,230" fill="#f0abfc" opacity="0.4"/>
      <!-- Sol nébuleux -->
      <ellipse cx="400" cy="315" rx="500" ry="60" fill="#6b21a8" opacity="0.5"/>
    </svg>`,
  },
  ghost: {
    bg: 'linear-gradient(180deg, #030712 0%, #0f0a1e 25%, #1e1b4b 55%, #312e81 80%, #4c1d95 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Lune -->
      <circle cx="680" cy="55" r="40" fill="#fef9c3" opacity="0.9"/>
      <circle cx="700" cy="45" r="32" fill="#030712" opacity="0.9"/>
      <!-- Étoiles -->
      <circle cx="100" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="200" cy="15" r="1" fill="#e9d5ff" opacity="0.7"/>
      <circle cx="350" cy="40" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="500" cy="20" r="1" fill="#e9d5ff" opacity="0.8"/>
      <!-- Château hanté silhouette -->
      <rect x="300" y="150" width="200" height="170" fill="#0f0a1e"/>
      <rect x="330" y="120" width="40" height="50" fill="#0f0a1e"/>
      <rect x="430" y="110" width="40" height="60" fill="#0f0a1e"/>
      <polygon points="330,120 350,80 370,120" fill="#0f0a1e"/>
      <polygon points="430,110 450,68 470,110" fill="#0f0a1e"/>
      <!-- Fenêtres lumineuses -->
      <rect x="340" y="175" width="18" height="22" fill="#fef08a" opacity="0.7"/>
      <rect x="442" y="175" width="18" height="22" fill="#fef08a" opacity="0.7"/>
      <rect x="391" y="195" width="18" height="125" fill="#fef08a" opacity="0.5"/>
      <!-- Brouillard sol -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#1e1b4b" opacity="0.7"/>
      <ellipse cx="200" cy="305" rx="220" ry="35" fill="#312e81" opacity="0.4"/>
      <ellipse cx="600" cy="308" rx="200" ry="30" fill="#312e81" opacity="0.4"/>
    </svg>`,
  },
  dragon: {
    bg: 'linear-gradient(180deg, #0a0a2e 0%, #1e1b4b 30%, #312e81 60%, #4338ca 85%, #6366f1 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Étoiles -->
      <circle cx="80" cy="25" r="1.5" fill="#c7d2fe" opacity="0.9"/>
      <circle cx="200" cy="45" r="1" fill="white" opacity="0.7"/>
      <circle cx="400" cy="20" r="2" fill="#a5b4fc" opacity="0.8"/>
      <circle cx="600" cy="35" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="720" cy="50" r="1" fill="#c7d2fe" opacity="0.7"/>
      <!-- Montagnes draconiennes -->
      <polygon points="0,320 120,100 240,320" fill="#1e1b4b"/>
      <polygon points="150,320 300,80 450,320" fill="#312e81" opacity="0.9"/>
      <polygon points="350,320 500,90 650,320" fill="#1e1b4b"/>
      <polygon points="550,320 680,120 800,320" fill="#312e81" opacity="0.8"/>
      <!-- Sommet enflammé (dragon) -->
      <path d="M290,80 Q300,40 310,80 Q295,60 290,80" fill="#f97316" opacity="0.6"/>
      <!-- Brume violet -->
      <ellipse cx="400" cy="315" rx="500" ry="60" fill="#4338ca" opacity="0.5"/>
    </svg>`,
  },
  fighting: {
    bg: 'linear-gradient(180deg, #1c0505 0%, #450a0a 30%, #7f1d1d 60%, #b91c1c 85%, #dc2626 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Colisée / arène -->
      <rect x="200" y="200" width="400" height="120" fill="#7f1d1d" opacity="0.7"/>
      <rect x="180" y="195" width="440" height="20" fill="#991b1b" opacity="0.8"/>
      <!-- Colonnes -->
      <rect x="220" y="160" width="18" height="60" fill="#b91c1c" opacity="0.7"/>
      <rect x="280" y="155" width="18" height="65" fill="#b91c1c" opacity="0.7"/>
      <rect x="340" y="160" width="18" height="60" fill="#b91c1c" opacity="0.7"/>
      <rect x="460" y="160" width="18" height="60" fill="#b91c1c" opacity="0.7"/>
      <rect x="520" y="155" width="18" height="65" fill="#b91c1c" opacity="0.7"/>
      <rect x="562" y="160" width="18" height="60" fill="#b91c1c" opacity="0.7"/>
      <!-- Sol sable -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#78350f" opacity="0.6"/>
      <!-- Lumière de torche -->
      <path d="M100,250 Q120,200 130,250" fill="#f97316" opacity="0.5"/>
      <path d="M670,250 Q690,200 700,250" fill="#f97316" opacity="0.5"/>
    </svg>`,
  },
  poison: {
    bg: 'linear-gradient(180deg, #1a0033 0%, #2e1065 30%, #6b21a8 60%, #9333ea 85%, #c084fc 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Marais / brouillard toxique -->
      <ellipse cx="400" cy="300" rx="450" ry="80" fill="#4a044e" opacity="0.6"/>
      <ellipse cx="150" cy="295" rx="200" ry="50" fill="#7e22ce" opacity="0.3"/>
      <ellipse cx="650" cy="290" rx="180" ry="45" fill="#7e22ce" opacity="0.3"/>
      <!-- Bulles toxiques -->
      <circle cx="120" cy="250" r="12" stroke="#c084fc" stroke-width="2" fill="none" opacity="0.5"/>
      <circle cx="300" cy="220" r="8" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.6"/>
      <circle cx="500" cy="235" r="15" stroke="#c084fc" stroke-width="2" fill="none" opacity="0.4"/>
      <circle cx="680" cy="245" r="10" stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.5"/>
      <!-- Étoiles sombres -->
      <circle cx="80" cy="40" r="1.5" fill="#e9d5ff" opacity="0.6"/>
      <circle cx="350" cy="25" r="1" fill="#e9d5ff" opacity="0.5"/>
      <circle cx="600" cy="50" r="1.5" fill="#e9d5ff" opacity="0.6"/>
    </svg>`,
  },
  ground: {
    bg: 'linear-gradient(180deg, #1c1008 0%, #431407 25%, #7c2d12 50%, #b45309 75%, #d97706 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Désert / dunes -->
      <path d="M0,280 Q200,220 400,260 Q600,300 800,240 L800,320 L0,320 Z" fill="#b45309" opacity="0.7"/>
      <path d="M0,300 Q200,260 400,285 Q600,310 800,270 L800,320 L0,320 Z" fill="#92400e" opacity="0.6"/>
      <!-- Rochers -->
      <ellipse cx="150" cy="260" rx="55" ry="35" fill="#78350f" opacity="0.7"/>
      <ellipse cx="650" cy="255" rx="50" ry="30" fill="#78350f" opacity="0.7"/>
      <ellipse cx="400" cy="270" rx="40" ry="25" fill="#92400e" opacity="0.6"/>
      <!-- Crevasses -->
      <path d="M200,320 Q220,290 240,310 Q260,280 280,320" stroke="#1c0f05" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M500,320 Q520,285 540,305 Q560,275 580,320" stroke="#1c0f05" stroke-width="2" fill="none" opacity="0.7"/>
      <!-- Soleil voilé de poussière -->
      <circle cx="400" cy="55" r="45" fill="#fbbf24" opacity="0.3"/>
      <circle cx="400" cy="55" r="30" fill="#fcd34d" opacity="0.4"/>
    </svg>`,
  },
  flying: {
    bg: 'linear-gradient(180deg, #0c4a6e 0%, #075985 20%, #0ea5e9 50%, #38bdf8 75%, #bae6fd 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Soleil -->
      <circle cx="400" cy="60" r="50" fill="#fef08a" opacity="0.8"/>
      <circle cx="400" cy="60" r="38" fill="#fef9c3" opacity="0.9"/>
      <!-- Nuages -->
      <ellipse cx="150" cy="100" rx="80" ry="35" fill="white" opacity="0.9"/>
      <ellipse cx="120" cy="110" rx="60" ry="28" fill="white" opacity="0.9"/>
      <ellipse cx="185" cy="107" rx="55" ry="25" fill="white" opacity="0.8"/>
      <ellipse cx="600" cy="80" rx="90" ry="38" fill="white" opacity="0.85"/>
      <ellipse cx="570" cy="90" rx="65" ry="30" fill="white" opacity="0.85"/>
      <ellipse cx="640" cy="86" rx="58" ry="28" fill="white" opacity="0.75"/>
      <ellipse cx="350" cy="155" rx="70" ry="30" fill="white" opacity="0.6"/>
      <!-- Horizon / mer -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#0369a1" opacity="0.4"/>
    </svg>`,
  },
  bug: {
    bg: 'linear-gradient(180deg, #1a2e05 0%, #365314 30%, #4d7c0f 60%, #65a30d 85%, #84cc16 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Forêt dense -->
      <rect x="50" y="180" width="16" height="140" fill="#3f6212"/>
      <ellipse cx="58" cy="165" rx="38" ry="55" fill="#4d7c0f" opacity="0.9"/>
      <ellipse cx="58" cy="150" rx="28" ry="42" fill="#65a30d" opacity="0.8"/>
      <rect x="150" y="190" width="14" height="130" fill="#3f6212"/>
      <ellipse cx="157" cy="175" rx="35" ry="50" fill="#365314" opacity="0.9"/>
      <ellipse cx="157" cy="160" rx="26" ry="40" fill="#4d7c0f" opacity="0.8"/>
      <rect x="600" y="185" width="16" height="135" fill="#3f6212"/>
      <ellipse cx="608" cy="168" rx="38" ry="55" fill="#4d7c0f" opacity="0.9"/>
      <ellipse cx="608" cy="153" rx="28" ry="42" fill="#65a30d" opacity="0.8"/>
      <rect x="700" y="175" width="14" height="145" fill="#3f6212"/>
      <ellipse cx="707" cy="160" rx="35" ry="52" fill="#365314" opacity="0.9"/>
      <!-- Lumière filtrée -->
      <ellipse cx="400" cy="100" rx="100" ry="60" fill="#d9f99d" opacity="0.15"/>
      <!-- Sol végétal -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#3f6212" opacity="0.6"/>
    </svg>`,
  },
  rock: {
    bg: 'linear-gradient(180deg, #1c1917 0%, #292524 30%, #44403c 60%, #78716c 80%, #a8a29e 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Falaises rocheuses -->
      <polygon points="0,320 0,120 120,80 200,140 200,320" fill="#44403c" opacity="0.9"/>
      <polygon points="600,320 600,100 720,70 800,120 800,320" fill="#44403c" opacity="0.9"/>
      <polygon points="300,320 320,160 380,120 440,160 460,320" fill="#57534e" opacity="0.8"/>
      <!-- Rochers épars -->
      <ellipse cx="130" cy="285" rx="45" ry="28" fill="#57534e" opacity="0.8"/>
      <ellipse cx="650" cy="280" rx="40" ry="25" fill="#57534e" opacity="0.8"/>
      <ellipse cx="400" cy="295" rx="35" ry="22" fill="#44403c" opacity="0.7"/>
      <!-- Sol pierreux -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#292524" opacity="0.7"/>
      <!-- Ciel gris -->
      <ellipse cx="300" cy="40" rx="120" ry="30" fill="#57534e" opacity="0.4"/>
      <ellipse cx="560" cy="55" rx="100" ry="25" fill="#57534e" opacity="0.3"/>
    </svg>`,
  },
  dark: {
    bg: 'linear-gradient(180deg, #000000 0%, #0a0a0a 30%, #111111 60%, #1c1c1c 85%, #2a2a2a 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Lune croissant -->
      <circle cx="700" cy="60" r="36" fill="#fef3c7" opacity="0.8"/>
      <circle cx="720" cy="50" r="28" fill="#050505" opacity="0.9"/>
      <!-- Étoiles -->
      <circle cx="80" cy="35" r="1.5" fill="white" opacity="0.5"/>
      <circle cx="200" cy="20" r="1" fill="white" opacity="0.4"/>
      <circle cx="350" cy="45" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="500" cy="25" r="1" fill="white" opacity="0.5"/>
      <circle cx="150" cy="60" r="1" fill="white" opacity="0.4"/>
      <circle cx="450" cy="55" r="1.5" fill="white" opacity="0.3"/>
      <!-- Silhouettes arbres morts -->
      <line x1="100" y1="320" x2="100" y2="170" stroke="#111" stroke-width="8"/>
      <line x1="100" y1="210" x2="60" y2="175" stroke="#111" stroke-width="4"/>
      <line x1="100" y1="220" x2="140" y2="185" stroke="#111" stroke-width="4"/>
      <line x1="100" y1="195" x2="75" y2="165" stroke="#111" stroke-width="3"/>
      <line x1="680" y1="320" x2="680" y2="175" stroke="#111" stroke-width="7"/>
      <line x1="680" y1="215" x2="645" y2="180" stroke="#111" stroke-width="3.5"/>
      <line x1="680" y1="225" x2="715" y2="188" stroke="#111" stroke-width="3.5"/>
      <!-- Brouillard nuit -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#111" opacity="0.8"/>
    </svg>`,
  },
  steel: {
    bg: 'linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #334155 60%, #475569 80%, #94a3b8 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Cité industrielle / acier -->
      <rect x="100" y="200" width="60" height="120" fill="#334155" opacity="0.8"/>
      <rect x="175" y="180" width="45" height="140" fill="#1e293b" opacity="0.9"/>
      <rect x="235" y="215" width="50" height="105" fill="#334155" opacity="0.8"/>
      <rect x="500" y="190" width="55" height="130" fill="#334155" opacity="0.8"/>
      <rect x="570" y="170" width="50" height="150" fill="#1e293b" opacity="0.9"/>
      <rect x="635" y="205" width="45" height="115" fill="#334155" opacity="0.8"/>
      <!-- Antennes -->
      <line x1="197" y1="180" x2="197" y2="155" stroke="#94a3b8" stroke-width="2"/>
      <line x1="592" y1="170" x2="592" y2="145" stroke="#94a3b8" stroke-width="2"/>
      <!-- Fenêtres lumineuses -->
      <rect x="110" y="215" width="10" height="10" fill="#fef3c7" opacity="0.6"/>
      <rect x="130" y="215" width="10" height="10" fill="#fef3c7" opacity="0.4"/>
      <rect x="185" y="195" width="8" height="10" fill="#fef3c7" opacity="0.5"/>
      <rect x="510" y="205" width="10" height="10" fill="#fef3c7" opacity="0.6"/>
      <rect x="580" y="185" width="8" height="10" fill="#fef3c7" opacity="0.5"/>
      <!-- Sol métallique -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#0f172a" opacity="0.8"/>
    </svg>`,
  },
  fairy: {
    bg: 'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 55%, #f9a8d4 80%, #f472b6 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Arc-en-ciel léger -->
      <path d="M0,200 Q400,50 800,200" stroke="#f9a8d4" stroke-width="8" fill="none" opacity="0.3"/>
      <path d="M0,215 Q400,65 800,215" stroke="#c084fc" stroke-width="5" fill="none" opacity="0.25"/>
      <!-- Châteaux féeriques / tours -->
      <rect x="340" y="160" width="120" height="160" fill="#fce7f3" opacity="0.7"/>
      <polygon points="340,160 400,120 460,160" fill="#f9a8d4" opacity="0.8"/>
      <rect x="360" y="100" width="20" height="65" fill="#fce7f3" opacity="0.7"/>
      <rect x="420" y="95" width="20" height="70" fill="#fce7f3" opacity="0.7"/>
      <polygon points="360,100 370,70 380,100" fill="#f472b6" opacity="0.7"/>
      <polygon points="420,95 430,65 440,95" fill="#f472b6" opacity="0.7"/>
      <!-- Étoiles scintillantes -->
      <text x="80" y="80" font-size="16" fill="#f9a8d4" opacity="0.8">✦</text>
      <text x="650" y="65" font-size="14" fill="#c084fc" opacity="0.7">✦</text>
      <text x="230" y="50" font-size="12" fill="#f9a8d4" opacity="0.6">✦</text>
      <text x="560" y="90" font-size="10" fill="#f472b6" opacity="0.7">✦</text>
      <!-- Sol enchanté -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#fce7f3" opacity="0.6"/>
    </svg>`,
  },
  normal: {
    bg: 'linear-gradient(180deg, #1c1c1e 0%, #2d2d30 30%, #48484a 60%, #636366 80%, #8e8e93 100%)',
    svgLayer: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
      <!-- Paysage route / plaine -->
      <path d="M0,320 Q400,240 800,320" fill="#48484a" opacity="0.5"/>
      <!-- Route -->
      <path d="M350,320 Q400,240 450,320" fill="#2d2d30" opacity="0.8"/>
      <line x1="400" y1="260" x2="400" y2="320" stroke="#8e8e93" stroke-width="2" stroke-dasharray="8,8" opacity="0.4"/>
      <!-- Nuages neutres -->
      <ellipse cx="200" cy="70" rx="75" ry="30" fill="#636366" opacity="0.4"/>
      <ellipse cx="170" cy="78" rx="55" ry="24" fill="#48484a" opacity="0.3"/>
      <ellipse cx="560" cy="55" rx="70" ry="28" fill="#636366" opacity="0.4"/>
      <!-- Sol -->
      <ellipse cx="400" cy="315" rx="500" ry="55" fill="#2d2d30" opacity="0.6"/>
    </svg>`,
  },
};

// ── Efficacité des types (simplifié) ────────────────────────────────────────
const TYPE_EFFECTIVENESS: Record<string, { weak: string[]; resist: string[]; immune: string[] }> = {
  normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
  fire: { weak: ['water','ground','rock'], resist: ['fire','grass','ice','bug','steel','fairy'], immune: [] },
  water: { weak: ['electric','grass'], resist: ['fire','water','ice','steel'], immune: [] },
  electric: { weak: ['ground'], resist: ['electric','flying','steel'], immune: [] },
  grass: { weak: ['fire','ice','poison','flying','bug'], resist: ['water','electric','grass','ground'], immune: [] },
  ice: { weak: ['fire','fighting','rock','steel'], resist: ['ice'], immune: [] },
  fighting: { weak: ['flying','psychic','fairy'], resist: ['bug','rock','dark'], immune: [] },
  poison: { weak: ['ground','psychic'], resist: ['grass','fighting','poison','bug','fairy'], immune: [] },
  ground: { weak: ['water','grass','ice'], resist: ['poison','rock'], immune: ['electric'] },
  flying: { weak: ['electric','ice','rock'], resist: ['grass','fighting','bug'], immune: ['ground'] },
  psychic: { weak: ['bug','ghost','dark'], resist: ['fighting','psychic'], immune: [] },
  bug: { weak: ['fire','flying','rock'], resist: ['grass','fighting','ground'], immune: [] },
  rock: { weak: ['water','grass','fighting','ground','steel'], resist: ['normal','fire','poison','flying'], immune: [] },
  ghost: { weak: ['ghost','dark'], resist: ['poison','bug'], immune: ['normal','fighting'] },
  dragon: { weak: ['ice','dragon','fairy'], resist: ['fire','water','electric','grass'], immune: [] },
  dark: { weak: ['fighting','bug','fairy'], resist: ['ghost','dark'], immune: ['psychic'] },
  steel: { weak: ['fire','fighting','ground'], resist: ['normal','grass','ice','flying','psychic','bug','rock','dragon','steel','fairy'], immune: ['poison'] },
  fairy: { weak: ['poison','steel'], resist: ['fighting','bug','dark'], immune: ['dragon'] },
};

// ── Stat labels ──────────────────────────────────────────────────────────────
const STAT_LABEL: Record<string, string> = {
  hp:'HP', attack:'ATK', defense:'DEF',
  'special-attack':'SpAtk', 'special-defense':'SpDef', speed:'SPD',
};
const STAT_MAX: Record<string, number> = {
  hp:255, attack:190, defense:230, 'special-attack':194, 'special-defense':230, speed:180,
};

// ── Interface Evolution ──────────────────────────────────────────────────────
interface EvoStep {
  id: number;
  name: string;
  image: string;
  minLevel: number | null;
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemon, setPokemon, loading } = useFetchPokemonById(id);
  const { play, isPlaying } = useAudio(pokemon?.cries?.latest);
  const { updatePokemon, deletePokemon, getCustomPokemon, toggleFavorite, isFavorite } = usePokemon();
  const { isDark } = useTheme();

  const [tab, setTab] = useState<'about'|'stats'|'evolutions'|'locations'>('about');
  const [isShiny, setIsShiny] = useState(false);
  const [shinyUrl, setShinyUrl] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [evolutions, setEvolutions] = useState<EvoStep[]>([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [httpError, setHttpError] = useState<string | null>(null);

  const isCustom = pokemon?.isCustom;
  const customData = id ? getCustomPokemon(Number(id)) : undefined;
  const displayPokemon = isCustom && customData ? customData : pokemon;
  const favorite = displayPokemon ? isFavorite(displayPokemon.id) : false;

  const mainType = displayPokemon?.types?.[0]?.type?.name || 'normal';
  const typeColor = TYPE_COLOR[mainType] || '#888';
  const normalUrl = (displayPokemon as any)?.customImage
    || displayPokemon?.sprites?.other?.['official-artwork']?.front_default;
  const imageUrl = (isShiny && shinyUrl) ? shinyUrl : normalUrl;

  // Paysage adapté au type
  const landscape = TYPE_LANDSCAPE[mainType] || TYPE_LANDSCAPE.normal;

  // ── Charger le sprite shiny depuis PokéAPI ───────────────────────────────
  useEffect(() => {
    if (!displayPokemon || isCustom) return;
    setShinyUrl(null);
    (async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${displayPokemon.id}`);
        if (!res.ok) return;
        const data = await res.json();
        const url = data?.sprites?.other?.['official-artwork']?.front_shiny
          || data?.sprites?.front_shiny
          || null;
        setShinyUrl(url);
      } catch { /* pas de shiny dispo */ }
    })();
  }, [displayPokemon?.id]);

  // ── Charger les lieux de capture ─────────────────────────────────────────
  useEffect(() => {
    if (!displayPokemon || tab !== 'locations') return;
    setLocLoading(true);
    setLocError(null);
    (async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${displayPokemon.id}/encounters`);
        if (!res.ok) {
          if (res.status === 404) setLocError('Données de localisation introuvables (404)');
          else if (res.status === 429) setLocError('Trop de requêtes, réessaie dans quelques secondes (429)');
          else setLocError(`Erreur HTTP ${res.status}`);
          setLocLoading(false);
          return;
        }
        const data = await res.json();
        setLocations(data);
      } catch {
        setLocError('Impossible de charger les lieux. Vérifie ta connexion.');
      } finally {
        setLocLoading(false);
      }
    })();
  }, [displayPokemon, tab]);

  // ── Charger les évolutions ────────────────────────────────────────────────
  useEffect(() => {
    if (!displayPokemon?.species?.url || tab !== 'evolutions') return;
    setEvoLoading(true);
    (async () => {
      try {
        const specRes = await fetch(displayPokemon.species.url);
        const specData = await specRes.json();
        const evoRes = await fetch(specData.evolution_chain.url);
        const evoData = await evoRes.json();

        const steps: EvoStep[] = [];
        const traverse = async (node: any, level: number) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${node.species.name}`);
          const d = await res.json();
          steps.push({
            id: d.id,
            name: node.species.name,
            image: d.sprites.other?.home?.front_default || d.sprites.other?.['official-artwork']?.front_default || d.sprites.front_default,
            minLevel: node.evolution_details?.[0]?.min_level ?? null,
          });
          for (const next of node.evolves_to) await traverse(next, level + 1);
        };
        await traverse(evoData.chain, 0);
        setEvolutions(steps);
      } catch { setEvolutions([]); }
      finally { setEvoLoading(false); }
    })();
  }, [displayPokemon, tab]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleUpdate = async (data: any) => {
    setSaving(true);
    try {
      if (isCustom) updatePokemon(displayPokemon!.id, data);
      else {
        await pokemonApi.updatePokemon(displayPokemon!.id, { 'name.english': data.name });
        setPokemon((prev: any) => prev ? { ...prev, ...data } : prev);
      }
      setShowEdit(false);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (isCustom) deletePokemon(displayPokemon!.id);
      else await pokemonApi.deletePokemon(displayPokemon!.id);
      navigate('/');
    } catch (e) { console.error(e); setDeleting(false); setShowDeleteModal(false); }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading || !displayPokemon) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#080808' : '#f4f4f4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: `3px solid ${typeColor}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}/>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Chargement...</p>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Mode édition ──────────────────────────────────────────────────────────
  if (showEdit) {
    return (
      <div style={{ minHeight: '100vh', background: isDark ? '#080808' : '#f4f4f4', padding: '32px' }}>
        <button onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Annuler
        </button>
        <PokemonForm initialData={displayPokemon} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} mode="edit" />
        {saving && <p style={{ textAlign: 'center', color: '#ef4444', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '16px' }}>Sauvegarde...</p>}
      </div>
    );
  }

  const textColor = isDark ? 'white' : '#111';
  const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  // Le hero a toujours un fond sombre (paysage + overlay) → textes toujours blancs dans hero
  const heroTextColor = 'white';
  const heroMutedColor = 'rgba(255,255,255,0.6)';
  const heroBtnBg = 'rgba(255,255,255,0.12)';
  const heroBtnBorder = 'rgba(255,255,255,0.2)';
  const effectiveness = TYPE_EFFECTIVENESS[mainType];

  return (
    <div style={{ minHeight: '100vh', background: isDark ? '#080808' : '#f4f4f4' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid rgba(0,0,0,0.25)`,
        background: landscape.bg,
      }}>
        {/* Paysage SVG en fond */}
        <div
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
          dangerouslySetInnerHTML={{ __html: landscape.svgLayer }}
        />
        {/* Overlay sombre pour lisibilité */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 32px 0', position: 'relative', zIndex: 2 }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: heroMutedColor, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ← Retour
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              {shinyUrl && (
                <button
                  onClick={() => setIsShiny(v => !v)}
                  title={isShiny ? 'Voir version normale' : 'Voir version Shiny ✨'}
                  style={{
                    padding: '7px 14px', borderRadius: '10px',
                    border: `1px solid ${isShiny ? '#fbbf24' : heroBtnBorder}`,
                    background: isShiny ? 'rgba(251,191,36,0.25)' : heroBtnBg,
                    cursor: 'pointer', fontSize: '13px',
                    transition: 'all 0.2s',
                    boxShadow: isShiny ? '0 0 14px rgba(251,191,36,0.55)' : 'none',
                  }}
                >
                  ✨
                </button>
              )}
              <button onClick={() => toggleFavorite(displayPokemon.id)} style={{ padding: '7px 14px', borderRadius: '10px', border: `1px solid ${heroBtnBorder}`, background: heroBtnBg, cursor: 'pointer', fontSize: '13px' }}>
                {favorite ? '❤️' : '🤍'}
              </button>
              <button onClick={() => setShowEdit(true)} style={{ padding: '7px 16px', borderRadius: '10px', border: `1px solid ${heroBtnBorder}`, background: heroBtnBg, cursor: 'pointer', color: heroTextColor, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ✏️ Modifier
              </button>
              <button onClick={() => setShowDeleteModal(true)} style={{ padding: '7px 16px', borderRadius: '10px', border: '1px solid rgba(255,80,80,0.5)', background: 'rgba(220,38,38,0.25)', cursor: 'pointer', color: '#fca5a5', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🗑 Supprimer
              </button>
            </div>
          </div>

          {/* Contenu héro : image gauche, infos droite */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-end' }}>
            {/* Image */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingBottom: '24px' }}>
              {/* Numéro en filigrane — toujours visible car fond paysage sombre */}
              <span style={{
                position: 'absolute', bottom: 0, right: 0,
                fontSize: 'clamp(80px, 14vw, 160px)', fontWeight: 900, fontStyle: 'italic',
                color: `${typeColor}60`,
                textShadow: `0 0 40px ${typeColor}40`,
                lineHeight: 1, letterSpacing: '-0.06em', userSelect: 'none',
                zIndex: 0,
              }}>
                #{String(displayPokemon.id).padStart(3, '0')}
              </span>
              <img
                src={imageUrl}
                alt={displayPokemon.name}
                style={{
                  width: '280px', maxWidth: '100%',
                  filter: `drop-shadow(0 24px 48px ${typeColor}44)`,
                  position: 'relative', zIndex: 1,
                  animation: 'floatPoke 3s ease-in-out infinite',
                }}
              />
            </div>

            {/* Infos droite */}
            <div style={{ paddingBottom: '32px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                #{String(displayPokemon.id).padStart(3, '0')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 900, color: heroTextColor, textTransform: 'capitalize', letterSpacing: '-0.03em', lineHeight: 1, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
                  {displayPokemon.name}
                </h1>
                {displayPokemon.cries?.latest && (
                  <button onClick={play} style={{ width: '38px', height: '38px', borderRadius: '50%', border: `2px solid ${isPlaying ? typeColor : 'rgba(255,255,255,0.3)'}`, background: isPlaying ? `${typeColor}44` : heroBtnBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isPlaying ? typeColor : heroMutedColor, flexShrink: 0 }}>
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a.5.5 0 0 0-.84-.37L5.83 6H3.5A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h2.33l3.33 2.87a.5.5 0 0 0 .84-.37v-13z"/></svg>
                  </button>
                )}
              </div>

              {/* Types */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {displayPokemon.types.map((t: any) => (
                  <span key={t.type.name} style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'capitalize', color: 'white', background: TYPE_COLOR[t.type.name] || '#888', letterSpacing: '0.03em', boxShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
                    {t.type.name}
                  </span>
                ))}
                {isCustom && <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,0.3)', border: '1px solid rgba(251,191,36,0.5)' }}>Custom</span>}
              </div>

              {/* Physique rapide */}
              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: heroTextColor, fontStyle: 'italic', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{(displayPokemon.height / 10).toFixed(1)}m</p>
                  <p style={{ fontSize: '9px', color: heroMutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Taille</p>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }}/>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: heroTextColor, fontStyle: 'italic', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{(displayPokemon.weight / 10).toFixed(1)}kg</p>
                  <p style={{ fontSize: '9px', color: heroMutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Poids</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ONGLETS ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: '2px', borderBottom: `1px solid ${cardBorder}`, marginBottom: '32px', flexWrap: 'wrap' }}>
          {([
            { key: 'about',     label_fr: 'À Propos',    label_en: 'About',     icon: 'ℹ️' },
            { key: 'stats',     label_fr: 'Stats',       label_en: 'Stats',     icon: '📊' },
            { key: 'evolutions',label_fr: 'Évolutions',  label_en: 'Evolutions',icon: '🔄' },
            { key: 'locations', label_fr: 'Lieux',       label_en: 'Locations', icon: '🗺️' },
          ] as const).map(({ key, label_fr, label_en, icon }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: tab === key ? typeColor : mutedColor,
              borderBottom: tab === key ? `2px solid ${typeColor}` : '2px solid transparent',
              borderTop: '2px solid transparent',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <span>{icon}</span>
              <span>{label_fr}</span>
            </button>
          ))}
        </div>

        {/* ── TAB : ABOUT ─────────────────────────────────────────────────── */}
        {tab === 'about' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingBottom: '48px' }}>
            {/* Capacités */}
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`, padding: '24px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 900, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>Capacités</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayPokemon.abilities?.map((a: any) => (
                  <div key={a.ability.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: textColor, textTransform: 'capitalize' }}>{a.ability.name.replace(/-/g, ' ')}</span>
                    {a.is_hidden && <span style={{ fontSize: '8px', fontWeight: 700, color: mutedColor, background: cardBg, border: `1px solid ${cardBorder}`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cachée</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Physique */}
            <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`, padding: '24px' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 900, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>Physique</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[['Taille', `${(displayPokemon.height/10).toFixed(1)} m`], ['Poids', `${(displayPokemon.weight/10).toFixed(1)} kg`], ['Exp. base', displayPokemon.base_experience]].map(([label, val]) => (
                  <div key={label as string}>
                    <p style={{ fontSize: '9px', color: mutedColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '2px' }}>{label}</p>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: textColor, fontStyle: 'italic' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Faiblesses */}
            {effectiveness && (
              <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`, padding: '24px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>Faiblesses ×2</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {effectiveness.weak.map(t => (
                    <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'capitalize', color: 'white', background: TYPE_COLOR[t] || '#888' }}>{t}</span>
                  ))}
                  {effectiveness.weak.length === 0 && <span style={{ fontSize: '12px', color: mutedColor }}>Aucune</span>}
                </div>
              </div>
            )}

            {/* Résistances */}
            {effectiveness && (
              <div style={{ background: cardBg, borderRadius: '16px', border: `1px solid ${cardBorder}`, padding: '24px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>Résistances ×½</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {effectiveness.resist.map(t => (
                    <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'capitalize', color: 'white', background: TYPE_COLOR[t] || '#888' }}>{t}</span>
                  ))}
                  {effectiveness.resist.length === 0 && <span style={{ fontSize: '12px', color: mutedColor }}>Aucune</span>}
                </div>
                {effectiveness.immune.length > 0 && (
                  <>
                    <h3 style={{ fontSize: '10px', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '16px 0 10px' }}>Immunités ×0</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {effectiveness.immune.map(t => (
                        <span key={t} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, textTransform: 'capitalize', color: 'white', background: TYPE_COLOR[t] || '#888' }}>{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB : STATS ─────────────────────────────────────────────────── */}
        {tab === 'stats' && (
          <div style={{ paddingBottom: '48px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {displayPokemon.stats.map((stat: any) => {
                const key = stat.stat.name;
                const label = STAT_LABEL[key] || key;
                const max = STAT_MAX[key] || 255;
                const pct = Math.round((stat.base_stat / max) * 100);
                const color = pct > 66 ? '#22c55e' : pct > 33 ? typeColor : '#ef4444';
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '22px', fontWeight: 900, color: textColor, fontStyle: 'italic' }}>{stat.base_stat}</span>
                        <span style={{ fontSize: '10px', color: mutedColor }}>/ {max}</span>
                      </div>
                    </div>
                    <div style={{ height: '6px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.8s ease', boxShadow: `0 0 8px ${color}66` }}/>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div style={{ paddingTop: '16px', borderTop: `1px solid ${cardBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total</span>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: textColor, fontStyle: 'italic' }}>
                    {displayPokemon.stats.reduce((acc: number, s: any) => acc + s.base_stat, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB : ÉVOLUTIONS ────────────────────────────────────────────── */}
        {tab === 'evolutions' && (
          <div style={{ paddingBottom: '48px' }}>
            {evoLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: mutedColor, fontSize: '12px' }}>Chargement des évolutions...</div>
            ) : evolutions.length <= 1 ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔮</p>
                <p style={{ color: mutedColor, fontSize: '13px', fontWeight: 600 }}>Ce Pokémon n'évolue pas.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
                {evolutions.map((evo, i) => (
                  <React.Fragment key={evo.id}>
                    {/* Flèche entre évolutions */}
                    {i > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', color: mutedColor }}>
                        <span style={{ fontSize: '18px' }}>→</span>
                        {evo.minLevel && <span style={{ fontSize: '9px', fontWeight: 700, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Niv. {evo.minLevel}</span>}
                      </div>
                    )}
                    {/* Carte évolution */}
                    <div
                      onClick={() => navigate(`/pokemon/${evo.id}`)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '20px', borderRadius: '16px', cursor: 'pointer',
                        background: evo.id === displayPokemon.id ? `${typeColor}16` : cardBg,
                        border: `1px solid ${evo.id === displayPokemon.id ? typeColor + '55' : cardBorder}`,
                        transition: 'transform 0.2s',
                        width: '130px',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <img src={evo.image} alt={evo.name} style={{ width: '90px', height: '90px', objectFit: 'contain', filter: `drop-shadow(0 6px 12px ${typeColor}44)` }} />
                      <span style={{ fontSize: '10px', fontWeight: 700, color: mutedColor, marginTop: '4px' }}>#{String(evo.id).padStart(3,'0')}</span>
                      <span style={{ fontSize: '12px', fontWeight: 900, color: textColor, textTransform: 'capitalize', marginTop: '2px' }}>{evo.name}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ── TAB : LIEUX DE CAPTURE ───────────────────────────────────── */}
        {tab === 'locations' && (
          <div style={{ paddingBottom: '48px' }}>
            {locLoading && (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ width: '36px', height: '36px', border: `3px solid ${typeColor}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}/>
                <p style={{ color: mutedColor, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Chargement des lieux...</p>
              </div>
            )}

            {/* Erreur HTTP */}
            {locError && (
              <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ fontSize: '28px', marginBottom: '8px' }}>⚠️</p>
                <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '13px' }}>{locError}</p>
              </div>
            )}

            {!locLoading && !locError && locations.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>🌍</p>
                <p style={{ color: mutedColor, fontSize: '13px', fontWeight: 600 }}>Ce Pokémon ne se trouve à l'état sauvage dans aucun jeu.</p>
                <p style={{ color: mutedColor, fontSize: '11px', marginTop: '6px' }}>Il s'obtient uniquement par échange ou événement.</p>
              </div>
            )}

            {!locLoading && !locError && locations.length > 0 && (
              <div>
                {/* Carte SVG du monde Pokémon */}
                <div style={{ background: cardBg, borderRadius: '20px', border: `1px solid ${cardBorder}`, padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
                  <h3 style={{ fontSize: '10px', fontWeight: 900, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>
                    🗺️ Carte des Régions
                  </h3>

                  {/* Carte SVG simplifiée des régions Pokémon Gen I-VIII */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <svg viewBox="0 0 600 360" style={{ width: '100%', borderRadius: '12px', background: isDark ? '#0a1628' : '#dbeafe' }}>
                      {/* Fond océan */}
                      <rect width="600" height="360" fill={isDark ? '#0a1628' : '#bfdbfe'}/>

                      {/* KANTO */}
                      <g>
                        <rect x="380" y="120" width="180" height="140" rx="12" fill={isDark ? '#1e3a5f' : '#93c5fd'} stroke={
                          locations.some(l => l.location_area?.name?.toLowerCase().includes('kanto') ||
                            l.version_details?.some((v: any) => ['red','blue','yellow','firered','leafgreen'].includes(v.version?.name))) ? typeColor : (isDark ? '#2d4f7a' : '#60a5fa')
                        } strokeWidth="2"/>
                        <text x="470" y="155" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">KANTO</text>
                        {/* Icônes villes Kanto */}
                        <circle cx="410" cy="175" r="4" fill={typeColor} opacity="0.8"/>
                        <text x="418" y="179" fill="white" fontSize="7" opacity="0.7">Bourg Palette</text>
                        <circle cx="450" cy="195" r="4" fill={typeColor} opacity="0.7"/>
                        <text x="458" y="199" fill="white" fontSize="7" opacity="0.7">Jadielle</text>
                        <circle cx="490" cy="185" r="4" fill={typeColor} opacity="0.6"/>
                        <text x="498" y="189" fill="white" fontSize="7" opacity="0.7">Carmin sur Mer</text>
                        <circle cx="520" cy="215" r="4" fill={typeColor} opacity="0.6"/>
                        <text x="500" y="228" fill="white" fontSize="7" opacity="0.7">Cramois'île</text>
                        {/* Pokémon trouvé ici ? */}
                        {locations.some(l => l.version_details?.some((v: any) => ['red','blue','yellow','firered','leafgreen'].includes(v.version?.name))) && (
                          <circle cx="470" cy="210" r="8" fill={typeColor} opacity="0.9">
                            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite"/>
                          </circle>
                        )}
                      </g>

                      {/* JOHTO */}
                      <g>
                        <rect x="190" y="120" width="170" height="130" rx="12" fill={isDark ? '#1a3a2a' : '#a7f3d0'} stroke={
                          locations.some(l => l.version_details?.some((v: any) => ['gold','silver','crystal','heartgold','soulsilver'].includes(v.version?.name))) ? typeColor : (isDark ? '#2d5a40' : '#6ee7b7')
                        } strokeWidth="2"/>
                        <text x="275" y="155" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">JOHTO</text>
                        <circle cx="215" cy="175" r="4" fill={typeColor} opacity="0.7"/>
                        <text x="223" y="179" fill="white" fontSize="7" opacity="0.7">Boulochêne</text>
                        <circle cx="250" cy="195" r="4" fill={typeColor} opacity="0.6"/>
                        <text x="258" y="199" fill="white" fontSize="7" opacity="0.7">Doublonville</text>
                      </g>

                      {/* HOENN */}
                      <g>
                        <rect x="30" y="200" width="140" height="120" rx="12" fill={isDark ? '#2a1a3a' : '#ddd6fe'} stroke={
                          locations.some(l => l.version_details?.some((v: any) => ['ruby','sapphire','emerald','omega-ruby','alpha-sapphire'].includes(v.version?.name))) ? typeColor : (isDark ? '#4a2d6a' : '#c4b5fd')
                        } strokeWidth="2"/>
                        <text x="100" y="235" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">HOENN</text>
                        <circle cx="55" cy="255" r="4" fill={typeColor} opacity="0.7"/>
                        <text x="63" y="259" fill="white" fontSize="7" opacity="0.7">Littleroot</text>
                      </g>

                      {/* SINNOH */}
                      <g>
                        <rect x="200" y="20" width="150" height="90" rx="12" fill={isDark ? '#1a1a3a' : '#c7d2fe'} stroke={
                          locations.some(l => l.version_details?.some((v: any) => ['diamond','pearl','platinum'].includes(v.version?.name))) ? typeColor : (isDark ? '#2d2d6a' : '#a5b4fc')
                        } strokeWidth="2"/>
                        <text x="275" y="50" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">SINNOH</text>
                        <circle cx="230" cy="70" r="4" fill={typeColor} opacity="0.7"/>
                        <text x="238" y="74" fill="white" fontSize="7" opacity="0.7">Bonaugure</text>
                      </g>

                      {/* UNOVA */}
                      <g>
                        <rect x="30" y="30" width="150" height="100" rx="12" fill={isDark ? '#1a1218' : '#fce7f3'} stroke={
                          locations.some(l => l.version_details?.some((v: any) => ['black','white','black-2','white-2'].includes(v.version?.name))) ? typeColor : (isDark ? '#3a1a2a' : '#fbcfe8')
                        } strokeWidth="2"/>
                        <text x="105" y="65" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">UNOVA</text>
                        <circle cx="60" cy="85" r="4" fill={typeColor} opacity="0.7"/>
                        <text x="68" y="89" fill="white" fontSize="7" opacity="0.7">Nuvema Town</text>
                      </g>

                      {/* KALOS */}
                      <g>
                        <rect x="390" y="20" width="130" height="90" rx="12" fill={isDark ? '#2a1a1a' : '#fee2e2'} stroke={
                          locations.some(l => l.version_details?.some((v: any) => ['x','y'].includes(v.version?.name))) ? typeColor : (isDark ? '#5a2a2a' : '#fca5a5')
                        } strokeWidth="2"/>
                        <text x="455" y="55" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">KALOS</text>
                        <circle cx="415" cy="72" r="4" fill={typeColor} opacity="0.7"/>
                        <text x="423" y="76" fill="white" fontSize="7" opacity="0.7">Vaniville</text>
                      </g>

                      {/* ALOLA */}
                      <g>
                        <rect x="30" y="240" width="110" height="90" rx="12" fill={isDark ? '#0a1a2a' : '#e0f2fe'} stroke={
                          locations.some(l => l.version_details?.some((v: any) => ['sun','moon','ultra-sun','ultra-moon'].includes(v.version?.name))) ? typeColor : (isDark ? '#1a3a5a' : '#7dd3fc')
                        } strokeWidth="2"/>
                        <text x="85" y="275" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" opacity="0.8">ALOLA</text>
                      </g>

                      {/* Légende */}
                      <g>
                        <circle cx="30" cy="350" r="5" fill={typeColor} opacity="0.9"/>
                        <circle cx="30" cy="350" r="9" fill="none" stroke={typeColor} strokeWidth="1" opacity="0.5"/>
                        <text x="42" y="354" fill={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'} fontSize="9">Trouvé dans cette région</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Liste détaillée des lieux */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {locations.slice(0, 20).map((loc: any, i: number) => {
                    const areaName = loc.location_area?.name?.replace(/-/g, ' ') || '?';
                    const versions = loc.version_details?.map((v: any) => v.version?.name) || [];
                    const maxChance = loc.version_details?.reduce((max: number, v: any) => {
                      const chance = v.encounter_details?.[0]?.chance || 0;
                      return Math.max(max, chance);
                    }, 0);

                    return (
                      <div key={i} style={{
                        background: cardBg, borderRadius: '12px', border: `1px solid ${cardBorder}`,
                        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: textColor, textTransform: 'capitalize', lineHeight: 1.3 }}>
                            📍 {areaName}
                          </span>
                          {maxChance > 0 && (
                            <span style={{ fontSize: '10px', fontWeight: 900, color: typeColor, flexShrink: 0 }}>
                              {maxChance}%
                            </span>
                          )}
                        </div>
                        {/* Barre de probabilité */}
                        {maxChance > 0 && (
                          <div style={{ height: '4px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, maxChance)}%`, background: typeColor, borderRadius: '99px' }}/>
                          </div>
                        )}
                        {/* Versions */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {versions.slice(0, 6).map((v: string) => (
                            <span key={v} style={{
                              padding: '1px 7px', borderRadius: '4px',
                              fontSize: '8px', fontWeight: 700, textTransform: 'capitalize',
                              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                              color: mutedColor, letterSpacing: '0.04em',
                            }}>{v}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {locations.length > 20 && (
                  <p style={{ textAlign: 'center', color: mutedColor, fontSize: '11px', marginTop: '12px', fontWeight: 600 }}>
                    +{locations.length - 20} autres lieux...
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODALE SUPPRESSION ───────────────────────────────────────────── */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: isDark ? '#111' : 'white', border: `1px solid ${cardBorder}`, borderRadius: '20px', padding: '36px', maxWidth: '360px', width: '90%', textAlign: 'center', animation: 'fadeInScale 0.2s ease' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</p>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: textColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Supprimer ?</h2>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '24px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700, textTransform: 'capitalize' }}>{displayPokemon.name}</span> sera supprimé définitivement.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeleteModal(false)} disabled={deleting} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: `1px solid ${cardBorder}`, background: cardBg, color: textColor, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: 'none', background: '#dc2626', color: 'white', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', opacity: deleting ? 0.6 : 1 }}>{deleting ? '...' : 'Supprimer'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes floatPoke { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
