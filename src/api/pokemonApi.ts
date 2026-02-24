import axios from 'axios';
import { Pokemon } from '../types/pokemon';

const POKE_URL = 'https://pokeapi.co/api/v2';
const TCG_POCKET_URL = 'https://api.tcgdex.net/v2/en';
const BACK_URL = 'http://localhost:3000';

export const pokemonApi = {
  // ─── POKEAPI : liste paginée ────────────────────────────────────────────────
  async getPokemonList(offset = 0, limit = 20): Promise<Pokemon[]> {
    const response = await axios.get(`${POKE_URL}/pokemon?offset=${offset}&limit=${limit}`);

    const pokemonPromises = response.data.results.map(async (p: any) => {
      const details = await axios.get(p.url);

      // Priorité : home (3D moderne) > official-artwork > sprite classique
      const homeImage = details.data.sprites.other?.home?.front_default;
      const officialArtwork = details.data.sprites.other?.['official-artwork']?.front_default;
      const fallback = details.data.sprites.front_default;
      const bestImage = homeImage || officialArtwork || fallback;

      return { ...details.data, customImage: bestImage };
    });

    return Promise.all(pokemonPromises);
  },

  // ─── POKEAPI : un seul pokemon par id ──────────────────────────────────────
  async getPokemonById(id: number | string): Promise<Pokemon> {
    const details = await axios.get(`${POKE_URL}/pokemon/${id}`);

    // Priorité : home (3D moderne) > official-artwork > sprite classique
    const homeImage = details.data.sprites.other?.home?.front_default;
    const officialArtwork = details.data.sprites.other?.['official-artwork']?.front_default;
    const fallback = details.data.sprites.front_default;
    const bestImage = homeImage || officialArtwork || fallback;

    return { ...details.data, customImage: bestImage };
  },

  // ─── BACK EXPRESS : CRUD ────────────────────────────────────────────────────

  // GET liste paginée depuis le back (20 par page)
  async getBackPokemons(page = 1) {
    const res = await axios.get(`${BACK_URL}/pokemons?page=${page}`);
    return res.data; // { page, totalPages, totalPokemons, pokemons }
  },

  // GET un pokemon par nom depuis le back
  async searchByName(name: string) {
    const res = await axios.get(`${BACK_URL}/pokemons/search?name=${name}`);
    return res.data;
  },

  // POST créer un pokemon dans le back
  async createPokemon(data: object) {
    const res = await axios.post(`${BACK_URL}/pokemons`, data);
    return res.data;
  },

  // PUT modifier un pokemon dans le back
  async updatePokemon(id: number | string, data: object) {
    const res = await axios.put(`${BACK_URL}/pokemons/${id}`, data);
    return res.data;
  },

  // DELETE supprimer un pokemon dans le back
  async deletePokemon(id: number | string) {
    const res = await axios.delete(`${BACK_URL}/pokemons/${id}`);
    return res.data;
  },
};