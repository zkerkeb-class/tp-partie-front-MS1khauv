import { useState, useEffect } from 'react';
import { pokemonApi } from '../api/pokemonApi';
import { Pokemon } from '../types/pokemon';

// ─── Hook : liste paginée ────────────────────────────────────────────────────
export const useFetchPokemon = (offset: number, limit: number) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
        const pokemonData = await pokemonApi.getPokemonList(offset, limit);
        setPokemons(pokemonData);
        setTotalCount(151);
      } catch (err) {
        setError('Erreur lors du chargement des Pokémon');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemons();
  }, [offset, limit]);

  return { pokemons, loading, error, totalCount };
};

// ─── Hook : tous les 151 pokémons (pour le filtre par type) ──────────────────
export const useFetchAllPokemon = () => {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const pokemonData = await pokemonApi.getPokemonList(0, 151);
        setAllPokemons(pokemonData);
      } catch (err) {
        setError('Erreur lors du chargement des Pokémon');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { allPokemons, loading, error };
};

// ─── Hook : un seul pokemon par id ──────────────────────────────────────────
export const useFetchPokemonById = (id: string | undefined) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pokemonApi.getPokemonById(id);
        setPokemon(data);
      } catch (err) {
        setError('Pokémon introuvable');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [id]);

  return { pokemon, setPokemon, loading, error };
};