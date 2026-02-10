import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchPokemonById } from '../hooks/useFetchPokemon'; // À adapter selon ton hook
import { useAudio } from '../hooks/useAudio';
import { getTypeColor, capitalizeFirstLetter } from '../utils/helpers';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemon, loading } = useFetchPokemonById(id); // Hook qui récupère 1 seul pokemon
  const { play, isPlaying } = useAudio(pokemon?.cries?.latest);

  if (loading || !pokemon) return <div className="bg-[#0a0a0c] min-h-screen text-white p-20">Chargement du dossier...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 lg:p-20">
      <button onClick={() => navigate(-1)} className="mb-10 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-xs font-black tracking-widest">
        ← Retour au Pokédex
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* GAUCHE : VISUEL 3D */}
        <div className="relative group">
          <div className={`absolute inset-0 blur-[120px] opacity-20 ${getTypeColor(pokemon.types[0].type.name)}`}></div>
          <img 
            src={pokemon.customImage || pokemon.sprites.other['official-artwork'].front_default} 
            alt={pokemon.name}
            className="relative z-10 w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.8)] transform group-hover:-translate-y-4 transition-transform duration-700"
          />
        </div>

        {/* DROITE : INFOS ET STATS */}
        <div className="z-10">
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-8xl font-black uppercase italic tracking-tighter">
              {pokemon.name}
            </h1>
            <button 
              onClick={play}
              className={`p-4 rounded-full border border-white/10 hover:bg-white/5 transition-all ${isPlaying ? 'text-red-500' : 'text-white'}`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5v14l-7-7 7-7z"/></svg>
            </button>
          </div>

          <div className="flex gap-4 mb-12">
            {pokemon.types.map(t => (
              <span key={t.type.name} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getTypeColor(t.type.name)} shadow-lg`}>
                {t.type.name}
              </span>
            ))}
          </div>

          {/* GRILLE DE STATS */}
          <div className="grid grid-cols-2 gap-8 mb-12 border-t border-white/5 pt-12">
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{stat.stat.name}</span>
                  <span className="text-sm font-bold">{stat.base_stat}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getTypeColor(pokemon.types[0].type.name)}`}
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#111114] p-8 rounded-[2rem] border border-white/5">
            <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">Description Physique</h3>
            <div className="flex gap-10">
              <div>
                <p className="text-3xl font-black italic">{(pokemon.height / 10)}M</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Taille</p>
              </div>
              <div>
                <p className="text-3xl font-black italic">{(pokemon.weight / 10)}KG</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Poids</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}