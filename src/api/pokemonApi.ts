import axios from 'axios';
import { Pokemon } from '../types/pokemon';

const POKE_URL = 'https://pokeapi.co/api/v2';
const TCG_POCKET_URL = 'https://api.tcgdex.net/v2/en';

export const pokemonApi = {
  // Récupère les données combinées : PokeAPI (Stats/Cris) + TCG Pocket (Images HD)
  async getPokemonList(offset = 0, limit = 20): Promise<Pokemon[]> {
    const response = await axios.get(`${POKE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    
    const pokemonPromises = response.data.results.map(async (p: any) => {
      const details = await axios.get(p.url);
      // On cherche la carte correspondante dans TCG Pocket
      let tcgImage = details.data.sprites.other['official-artwork'].front_default;
      
      try {
        const tcgRes = await axios.get(`${TCG_POCKET_URL}/cards?name=${p.name}`);
        // On cherche une carte qui appartient à une série Pocket ou récente
        const card = tcgRes.data.find((c: any) => c.image !== undefined);
        if (card) tcgImage = `${card.image}/high.webp`;
      } catch (e) {
        console.log("Image TCG Pocket non trouvée pour", p.name);
      }

      return {
        ...details.data,
        customImage: tcgImage // On stocke la belle image ici
      };
    });

    return Promise.all(pokemonPromises);
  }
};