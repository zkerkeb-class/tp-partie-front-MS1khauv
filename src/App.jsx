import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import Layout from './components/title/Layout';
import Home from './pages/Home';
import DetailPage from './pages/DetailPage';
import CreatePokemon from './pages/CreatePokemon';
import Favorites from './pages/Favorites';
import Battle from './pages/Battle';
import DailyChallenge from './pages/DailyChallenge';
import IntroScreen from './pages/IntroScreen';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:id" element={<DetailPage />} />
            <Route path="/create" element={<CreatePokemon />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/battle" element={<Battle />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="/intro" element={<IntroScreen />} />
          </Routes>
        </Layout>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
