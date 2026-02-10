import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemon } from '../hooks/usePokemon';
import { Pokemon } from '../types/pokemon';
import PokemonForm from '../components/title/PokemonForm';

export default function CreatePokemon() {
  const navigate = useNavigate();
  const { addPokemon, getNextCustomId } = usePokemon();

  const handleCreate = (data: Partial<Pokemon>) => {
    const newPokemon: Pokemon = {
      id: getNextCustomId(),
      ...data,
      isCustom: true,
    } as Pokemon;

    addPokemon(newPokemon);
    navigate(`/pokemon/${newPokemon.id}`);
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
      >
        ← Retour
      </button>

      <PokemonForm
              onSubmit={handleCreate}
              onCancel={() => navigate('/')}
              mode="create" initialData={undefined}      />
    </div>
  );
}