import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import { Pokemon } from '../types/pokemon';
import { pokemonApi } from '../api/pokemonApi';
import PokemonForm from '../components/title/PokemonForm';

export default function CreatePokemon() {
  const navigate = useNavigate();
  const { addPokemon, getNextCustomId } = usePokemon();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (data: Partial<Pokemon>) => {
    setLoading(true);
    const newId = getNextCustomId();

    const newPokemon: Pokemon = {
      id: newId,
      ...data,
      isCustom: true,
    } as Pokemon;

    // Sauvegarde locale (contexte)
    addPokemon(newPokemon);

    // Tentative d'envoi au back (optionnel, ne bloque pas si le back est off)
    try {
      await pokemonApi.createPokemon({
        id: newId,
        name: {
          english: data.name || 'Unknown',
          japanese: data.name || 'Unknown',
          chinese: data.name || 'Unknown',
          french: data.name || 'Unknown',
        },
        type: data.types?.map((t: any) => t.type.name) || ['normal'],
        base: {
          HP: data.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50,
          Attack: data.stats?.find((s: any) => s.stat.name === 'attack')?.base_stat || 50,
          Defense: data.stats?.find((s: any) => s.stat.name === 'defense')?.base_stat || 50,
          SpecialAttack: data.stats?.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 50,
          SpecialDefense: data.stats?.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 50,
          Speed: data.stats?.find((s: any) => s.stat.name === 'speed')?.base_stat || 50,
        },
        image: data.sprites?.other?.['official-artwork']?.front_default || '',
      });
    } catch {
      // Le back n'est pas forcément lancé — on continue quand même
    }

    setLoading(false);
    navigate(`/pokemon/${newPokemon.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 lg:p-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-gray-500 hover:text-white flex items-center gap-2 uppercase text-xs font-black tracking-widest"
      >
        ← Retour
      </button>

      <PokemonForm
        onSubmit={handleCreate}
        onCancel={() => navigate('/')}
        mode="create"
        initialData={undefined}
      />

      {loading && (
        <p className="text-center text-red-400 font-black uppercase tracking-widest text-xs mt-6 animate-pulse">
          Création en cours...
        </p>
      )}
    </div>
  );
}