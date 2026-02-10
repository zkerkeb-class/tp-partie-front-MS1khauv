import React, { useState } from 'react';
import { useFetchPokemon } from '../hooks/useFetchPokemon';
import PokeList from '../components/pokelist';
import TypeFilter from '../components/title/TypeFilter';
import SearchBar from '../components/title/SearchBar';

export default function Home() {
  const { pokemons, loading, error } = useFetchPokemon(0, 151);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const filtered = pokemons.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || p.types.some(t => selectedTypes.includes(t.type.name.toLowerCase()));
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col lg:flex-row-reverse min-h-screen bg-[#0a0a0c]">
      {/* SIDEBAR DROITE : FILTRES */}
      <aside className="w-full lg:w-72 p-6 bg-[#111114] border-l border-white/5 lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 mb-6 italic">Éléments</h2>
        <TypeFilter selectedTypes={selectedTypes} toggleType={toggleType} />
      </aside>

      {/* CENTRE : GRILLE */}
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-[1200px] mx-auto">
          <header className="mb-12">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-8">
              Pokédex <span className="text-red-600">3D</span>
            </h1>
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </header>
          <PokeList pokemons={filtered} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
}