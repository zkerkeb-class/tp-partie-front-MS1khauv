import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un Pokémon par nom ou numéro..."
          className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:border-red-500 focus:outline-none text-lg shadow-lg pr-32"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-colors font-semibold"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold"
          >
            🔍
          </button>
        </div>
      </div>
    </form>
  );
}