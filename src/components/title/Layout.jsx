import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 rounded-full border-t-white"></div>
              </div>
              <span className="text-2xl font-bold">Pokédex</span>
            </Link>

            <div className="flex space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-red-700 font-semibold'
                    : 'hover:bg-red-700'
                }`}
              >
                🏠 Accueil
              </Link>
              <Link
                to="/favorites"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/favorites')
                    ? 'bg-red-700 font-semibold'
                    : 'hover:bg-red-700'
                }`}
              >
                ❤️ Favoris
              </Link>
              <Link
                to="/create"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/create')
                    ? 'bg-red-700 font-semibold'
                    : 'hover:bg-red-700'
                }`}
              >
                ➕ Ajouter
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Données fournies par{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300"
            >
              PokéAPI
            </a>
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Pokédex React © 2026 – Attrapez-les tous !
          </p>
        </div>
      </footer>
    </div> 
  );
};

//export default Layout;