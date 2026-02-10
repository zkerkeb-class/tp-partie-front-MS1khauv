import React from 'react';
import { Link } from 'react-router-dom';
import { useAudio } from '../../hooks/useAudio';
import { usePokemon } from '../../hooks/usePokemon';
import { formatPokemonId, getTypeColor, capitalizeFirstLetter } from '../../utils/helpers';

export default function PokeCard({ pokemon }) {
  const { play, isPlaying } = useAudio(pokemon.cries?.latest);
  const { toggleFavorite, isFavorite } = usePokemon();
  const favorite = isFavorite(pokemon.id);

  const imageUrl = pokemon.customImage || pokemon.sprites.other?.['official-artwork']?.front_default;

  return (
    /* Largeur max fixée à w-64 pour éviter que la carte ne s'étale trop */
    <div className="group relative bg-[#16191f] w-full max-w-[260px] rounded-[2.5rem] p-6 transition-all duration-500 hover:-translate-y-4 border border-white/5 hover:border-red-500/30 flex flex-col items-center shadow-2xl">
      
      <div className={`absolute top-0 left-0 w-full h-full opacity-5 blur-3xl rounded-full ${getTypeColor(pokemon.types[0].type.name)}`}></div>

      <div className="w-full flex justify-between items-center z-10 mb-2">
        <span className="text-[10px] font-black text-gray-600">#{String(pokemon.id).padStart(3, '0')}</span>
        <button onClick={(e) => { e.preventDefault(); toggleFavorite(pokemon.id); }} className="hover:scale-125 transition-transform text-lg">
          {favorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Conteneur d'image avec taille fixe pour éviter l'effet "immense" */}
      <Link to={`/pokemon/${pokemon.id}`} className="relative z-10 w-full h-40 flex items-center justify-center mb-6">
        <img
          src={imageUrl}
          alt={pokemon.name}
          className="max-h-full max-w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className={`absolute -bottom-2 w-20 h-4 blur-xl opacity-30 rounded-full ${getTypeColor(pokemon.types[0].type.name)}`}></div>
      </Link>

      <div className="text-center z-10 w-full">
        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-red-500 transition-colors">
          {pokemon.name}
        </h3>
        
        <div className="flex justify-center gap-2 mb-6">
          {pokemon.types.map((t) => (
            <span key={t.type.name} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-md ${getTypeColor(t.type.name)}`}>
              {t.type.name}
            </span>
          ))}
        </div>

        {pokemon.cries?.latest && (
          <button
            onClick={(e) => { e.preventDefault(); play(); }}
            className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3.5a.5.5 0 0 0-.84-.37L5.83 6H3.5A1.5 1.5 0 0 0 2 7.5v5A1.5 1.5 0 0 0 3.5 14h2.33l3.33 2.87a.5.5 0 0 0 .84-.37v-13z" /></svg>
            <span className="text-[9px] font-black uppercase tracking-widest text-white">Son</span>
          </button>
        )}
      </div>
    </div>
  );
}