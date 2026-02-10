import React from 'react';
import { getTypeColor } from '../../utils/helpers';

const TYPES = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

export default function TypeFilter({ selectedTypes, toggleType }) {
  return (
    <div className="flex flex-col gap-3">
      {TYPES.map((type) => {
        const isActive = selectedTypes.includes(type);
        return (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`group flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 border ${
              isActive 
                ? `border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]` 
                : 'border-white/5 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${getTypeColor(type)} shadow-[0_0_10px_currentColor]`}></div>
              <span className={`text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>
                {type}
              </span>
            </div>
            {isActive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
          </button>
        );
      })}
    </div>
  );
}