import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/title/Layout';
import Home from './pages/Home';
import DetailPage from './pages/DetailPage';
import CreatePokemon from './pages/CreatePokemon';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
        <Route path="/create" element={<CreatePokemon />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Layout>
  );
}

export default App;